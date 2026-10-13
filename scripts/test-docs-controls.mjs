// Real Next.js dev documentation audit. Start with npm run dev:docs.
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const origin = process.env.MANTLE_DOCS_URL || 'http://localhost:3000';
const destination = process.env.MANTLE_DOCS_REPORT || path.join(tmpdir(), 'mantle-docs-audit.json');
const browser = [process.env.MANTLE_TEST_BROWSER, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find((file) => file && existsSync(file));
const profile = await mkdtemp(path.join(tmpdir(), 'mantle-docs-audit-'));
const logs = [];
let socket;
let browserProcess;
let stderr = '';
let exited;
const wait = (time) => new Promise((resolve) => setTimeout(resolve, time));

try {
    let debuggerReady;
    const debuggerUrl = new Promise((resolve) => (debuggerReady = resolve));

    browserProcess = spawn(browser, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--disable-background-networking', '--disable-extensions', '--disable-sync', '--remote-debugging-port=0', `--user-data-dir=${profile}`, `${origin}/autocomplete/`], { windowsHide: true });
    exited = new Promise((resolve) => browserProcess.on('close', resolve));
    browserProcess.stderr.on('data', (data) => {
        stderr += data;
        const url = stderr.match(/DevTools listening on (ws:\/\/[^\s]+)/)?.[1];

        if (url) debuggerReady(url);
    });
    socket = new WebSocket(await debuggerUrl);
    await new Promise((resolve, reject) => {
        socket.addEventListener('open', resolve, { once: true });
        socket.addEventListener('error', reject, { once: true });
    });
    let command = 0;
    const pending = new Map();

    socket.addEventListener('message', ({ data }) => {
        const message = JSON.parse(data);
        const request = pending.get(message.id);

        if (message.method === 'Runtime.exceptionThrown' || message.method === 'Runtime.consoleAPICalled' || message.method === 'Network.loadingFailed') logs.push(message);
        if (request) {
            pending.delete(message.id);
            clearTimeout(request.timer);
            message.error ? request.reject(new Error(message.error.message)) : request.resolve(message.result);
        }
    });
    const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
        const id = ++command;
        const timer = setTimeout(() => { pending.delete(id); reject(new Error(`Docs command timed out: ${method}`)); }, 15000);

        pending.set(id, { resolve, reject, timer });
        socket.send(JSON.stringify({ id, method, params, sessionId }));
    });
    const { targetInfos } = await send('Target.getTargets');
    const target = targetInfos.find((item) => item.type === 'page' && item.url.startsWith(origin));
    const { sessionId } = await send('Target.attachToTarget', { targetId: target.targetId, flatten: true });
    const page = (method, params = {}) => send(method, params, sessionId);
    const evaluate = async (expression) => {
        const result = await page('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });

        if (result.exceptionDetails) throw new Error(result.exceptionDetails.text + ': ' + result.exceptionDetails.exception?.description);
        return result.result.value;
    };

    await page('Runtime.enable');
    await page('Network.enable');
    await page('DOM.enable');
    await page('CSS.enable');
    await page('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
    for (let attempt = 0; attempt < 80 && !(await evaluate("!!document.querySelector('.layout-wrapper')")); attempt++) await wait(250);
    const initial = await evaluate(`({url:location.href,title:document.title,theme:document.querySelector('.layout-wrapper')?.dataset.pTheme,themeLink:document.querySelector('#theme-link')?.href,loaded:!!document.querySelector('#theme-link')?.sheet,styles:[...document.styleSheets].map(s=>s.href),buttons:[...document.querySelectorAll('.layout-topbar button')].map(b=>({label:b.getAttribute('aria-label'),text:b.textContent,html:b.outerHTML})),sections:[...document.querySelectorAll('[id]')].map(e=>e.id).filter(id=>['dropdown','icon','button','time','basic','inline'].includes(id))})`);
    await writeFile(destination, JSON.stringify({ phase: 'initial', initial }, null, 2));
    await evaluate("document.querySelector('.layout-topbar .pi-palette').closest('button').click()");
    for (let attempt = 0; attempt < 40 && !(await evaluate("!!document.querySelector('.layout-config')")); attempt++) await wait(100);
    const config = await evaluate("document.querySelector('.layout-config').outerHTML");

    await writeFile(destination, JSON.stringify({ phase: 'config', initial, config }, null, 2));
    const shot = await page('Page.captureScreenshot', { format: 'png' });
    await writeFile(`${destination}.png`, Buffer.from(shot.data, 'base64'));
    await writeFile(`${destination}.console.json`, JSON.stringify(logs, null, 2));
    process.stdout.write(JSON.stringify({ destination, initial }, null, 2));
    await send('Browser.close');
    await exited;
} finally {
    if (browserProcess && browserProcess.exitCode === null) { browserProcess.kill(); await exited; }
    socket?.close();
    await writeFile(`${destination}.stderr.txt`, stderr);
    if (path.dirname(profile) === path.resolve(tmpdir()) && path.basename(profile).startsWith('mantle-docs-audit-')) await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
}
