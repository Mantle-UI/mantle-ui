// Run the issue #462 Menu reproducer in a real Chromium popup window.
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdtemp, rm } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { rollup } from 'rollup';

const directory = path.dirname(fileURLToPath(import.meta.url));
const browser = [process.env.MANTLE_TEST_BROWSER, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find((file) => file && existsSync(file));

if (!browser) throw new Error('Set MANTLE_TEST_BROWSER to an installed Chromium executable.');

const bundle = await rollup({
    input: path.resolve(directory, 'fixtures/popup-window-menu.jsx'),
    plugins: [
        replace({ preventAssignment: true, 'process.env.NODE_ENV': JSON.stringify('development') }),
        nodeResolve({ browser: true, extensions: ['.js', '.jsx', '.json'] }),
        commonjs({ include: /node_modules/ }),
        babel({ babelHelpers: 'bundled', babelrc: false, exclude: 'node_modules/**', extensions: ['.js', '.jsx'], presets: ['@babel/preset-react'] })
    ]
});
const { output } = await bundle.generate({ format: 'iife', inlineDynamicImports: true });

await bundle.close();

const server = createServer((request, response) => {
    if (request.url === '/fixture.js') {
        response.setHeader('Content-Type', 'text/javascript');
        response.end(output[0].code);
    } else {
        response.setHeader('Content-Type', 'text/html');
        response.end('<!doctype html><html><body><button id="open-popup">Open popup</button><div id="app"></div><script src="/fixture.js"></script></body></html>');
    }
});
const profile = await mkdtemp(path.join(tmpdir(), 'mantle-popup-browser-'));
const pending = new Map();
let child;
let browserExited;
let send;
let incoming = '';
let nextId = 0;

try {
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    child = spawn(browser, ['--headless=new', '--disable-gpu', '--no-first-run', '--disable-background-networking', '--disable-extensions', '--remote-debugging-pipe', `--user-data-dir=${profile}`, `http://127.0.0.1:${server.address().port}`], {
        windowsHide: true,
        stdio: ['ignore', 'ignore', 'pipe', 'pipe', 'pipe']
    });
    browserExited = new Promise((resolve) => child.on('close', resolve));
    child.stdio[4].setEncoding('utf8');
    child.stdio[4].on('data', (chunk) => {
        incoming += chunk;
        let boundary;

        while ((boundary = incoming.indexOf('\0')) !== -1) {
            const message = JSON.parse(incoming.slice(0, boundary));
            const request = pending.get(message.id);

            incoming = incoming.slice(boundary + 1);
            if (request) {
                pending.delete(message.id);
                clearTimeout(request.timer);
                message.error ? request.reject(new Error(message.error.message)) : request.resolve(message.result);
            }
        }
    });
    send = (method, params = {}, sessionId) =>
        new Promise((resolve, reject) => {
            const id = ++nextId;
            const timer = setTimeout(() => {
                pending.delete(id);
                reject(new Error(`Timed out: ${method}`));
            }, 10000);

            pending.set(id, { resolve, reject, timer });
            child.stdio[3].write(JSON.stringify({ id, method, params, sessionId }) + '\0');
        });

    let target;
    const targetDeadline = Date.now() + 10000;

    while (!target && Date.now() < targetDeadline) {
        const { targetInfos } = await send('Target.getTargets');

        target = targetInfos.find((item) => item.type === 'page' && item.url.startsWith('http://127.0.0.1:'));
        if (!target) await new Promise((resolve) => setTimeout(resolve, 50));
    }

    if (!target) throw new Error('Chromium did not open the fixture.');

    const { sessionId } = await send('Target.attachToTarget', { targetId: target.targetId, flatten: true });
    const page = (method, params) => send(method, params, sessionId);

    await page('Runtime.enable');

    const evaluate = async (expression) => {
        const result = await page('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });

        if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);

        return result.result.value;
    };
    const waitFor = async (expression) => {
        const deadline = Date.now() + 5000;

        while (Date.now() < deadline) {
            if (await evaluate(expression)) return;
            await new Promise((resolve) => setTimeout(resolve, 50));
        }

        throw new Error(`Timed out: ${expression}`);
    };

    await waitFor("document.querySelector('#trigger') !== null");
    await evaluate("document.querySelector('#trigger').click()");
    await waitFor("document.querySelector('.p-menu') !== null");
    await new Promise((resolve) => setTimeout(resolve, 200));
    if (!(await evaluate('window.menuClickListeners.size > 0'))) throw new Error('Main Menu did not bind a main window click listener.');
    await evaluate("document.querySelector('#outside').click()");
    await waitFor("document.querySelector('.p-menu') === null");

    const position = await evaluate("(() => { const rect = document.querySelector('#open-popup').getBoundingClientRect(); return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 }; })()");

    await page('Input.dispatchMouseEvent', { type: 'mousePressed', ...position, button: 'left', clickCount: 1 });
    await page('Input.dispatchMouseEvent', { type: 'mouseReleased', ...position, button: 'left', clickCount: 1 });
    await waitFor("window.popupFixture?.document.querySelector('#trigger') !== null");
    await evaluate("window.popupFixture.document.querySelector('#trigger').click()");
    await waitFor("window.popupFixture.document.querySelector('.p-menu') !== null");
    await new Promise((resolve) => setTimeout(resolve, 200));
    if (!(await evaluate('window.popupFixture !== window && window.popupFixture.document !== document'))) throw new Error('The popup did not create a separate browsing context.');
    if (!(await evaluate('window.popupFixture.menuClickListeners.size > 0'))) throw new Error('Popup Menu did not bind a popup window click listener.');
    await evaluate("document.querySelector('#outside').click()");
    await new Promise((resolve) => setTimeout(resolve, 200));
    if (!(await evaluate("window.popupFixture.document.querySelector('.p-menu') !== null"))) throw new Error('A main window click closed the popup Menu.');
    await evaluate("window.popupFixture.document.querySelector('#outside').click()");
    await waitFor("window.popupFixture.document.querySelector('.p-menu') === null");
    await evaluate('window.popupFixture.close()');
    process.stdout.write('PASS: main and popup Menus close on clicks in their own window.\n');
} finally {
    if (child?.exitCode === null && send) {
        try {
            await send('Browser.close');
            await browserExited;
        } catch {
            child.kill();
            await browserExited;
        }
    }

    for (const request of pending.values()) clearTimeout(request.timer);
    pending.clear();
    await new Promise((resolve) => server.close(resolve));
    if (path.dirname(profile) !== path.resolve(tmpdir()) || !path.basename(profile).startsWith('mantle-popup-browser-')) throw new Error('Unexpected browser profile path.');
    await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
}
