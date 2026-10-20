// Real Next documentation regression. Start the docs app before running.
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const origin = process.env.MANTLE_DOCS_URL || 'http://localhost:3000';
const destination = process.env.MANTLE_DOCS_REPORT || path.join(tmpdir(), 'mantle-dropdown-docs.json');
const probe = process.env.MANTLE_DOCS_PROBE === '1';
const browser = [process.env.MANTLE_TEST_BROWSER, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find((file) => file && existsSync(file));

if (!browser) throw new Error('Set MANTLE_TEST_BROWSER to an installed Chromium executable.');

const profile = await mkdtemp(path.join(tmpdir(), 'mantle-dropdown-docs-'));
const assertions = [];
const measurements = [];
const logs = [];
const wait = (time) => new Promise((resolve) => setTimeout(resolve, time));
let browserProcess;
let socket;
let exited;
let page;
let stderr = '';

try {
    let ready;
    const debuggerUrl = new Promise((resolve) => (ready = resolve));

    browserProcess = spawn(
        browser,
        [
            '--headless=new',
            '--disable-gpu',
            '--no-first-run',
            '--no-default-browser-check',
            '--disable-background-networking',
            '--disable-extensions',
            '--disable-sync',
            '--remote-debugging-port=0',
            `--user-data-dir=${profile}`,
            `${origin}/dropdown/`
        ],
        { windowsHide: true }
    );
    exited = new Promise((resolve) => browserProcess.on('close', resolve));
    browserProcess.stderr.on('data', (data) => {
        stderr += data;
        const url = stderr.match(/DevTools listening on (ws:\/\/[^\s]+)/)?.[1];

        if (url) ready(url);
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

        if (['Runtime.exceptionThrown', 'Runtime.consoleAPICalled', 'Network.loadingFailed'].includes(message.method)) logs.push(message);

        if (request) {
            pending.delete(message.id);
            clearTimeout(request.timer);
            message.error ? request.reject(new Error(message.error.message)) : request.resolve(message.result);
        }
    });
    const send = (method, params = {}, sessionId) =>
        new Promise((resolve, reject) => {
            const id = ++command;
            const timer = setTimeout(() => {
                pending.delete(id);
                reject(new Error(`Dropdown docs command timed out: ${method}`));
            }, 15000);

            pending.set(id, { resolve, reject, timer });
            socket.send(JSON.stringify({ id, method, params, sessionId }));
        });
    const { targetInfos } = await send('Target.getTargets');
    const target = targetInfos.find((item) => item.type === 'page' && item.url.startsWith(origin));
    const { sessionId } = await send('Target.attachToTarget', { targetId: target.targetId, flatten: true });

    page = (method, params = {}) => send(method, params, sessionId);

    const evaluate = async (expression) => {
        const result = await page('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });

        if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);

        return result.result.value;
    };

    const until = async (expression) => {
        for (let attempt = 0; attempt < 160; attempt++) {
            if (await evaluate(expression)) return;
            await wait(100);
        }

        throw new Error(`Dropdown docs condition timed out: ${expression}`);
    };

    const assert = (name, actual, expected) => {
        assertions.push({ name, actual, expected, passed: actual === expected });

        if (!probe && actual !== expected) throw new Error(`${name}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
    };

    const capture = async (name) => {
        await until("!document.querySelector('.p-connected-overlay-enter,.p-connected-overlay-enter-active')");
        await wait(200);
        const shot = await page('Page.captureScreenshot', { format: 'png' });

        await writeFile(`${destination}.${name}.png`, Buffer.from(shot.data, 'base64'));
    };

    const click = async (expression, x = 0.5, y = 0.5) => {
        const point = await evaluate(`(() => { const r=(${expression}).getBoundingClientRect(); return {x:r.x+r.width*${x},y:r.y+r.height*${y}}; })()`);

        await page('Input.dispatchMouseEvent', { type: 'mouseMoved', ...point });
        await page('Input.dispatchMouseEvent', { type: 'mousePressed', button: 'left', clickCount: 1, ...point });
        await page('Input.dispatchMouseEvent', { type: 'mouseReleased', button: 'left', clickCount: 1, ...point });
        await wait(260);
    };

    await page('Runtime.enable');
    await page('Network.enable');
    await page('Page.enable');
    await page('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
    await page('Page.reload', { ignoreCache: true });
    await until("!!document.getElementById('basic') && !!document.querySelector('style[data-primereact-style-id=base]')");
    await evaluate("document.querySelector('.layout-topbar .pi-palette').closest('button').click()");
    await until("!!document.querySelector('.layout-config')");
    await evaluate("(() => { const label=[...document.querySelectorAll('.layout-config span')].find(e=>e.textContent==='Aura'); label.parentElement.nextElementSibling.querySelector('button').click(); })()");
    await until("document.querySelector('.layout-wrapper')?.dataset.pTheme==='aura-dark-emerald' && !!document.querySelector('#theme-link').sheet");
    await evaluate("document.querySelector('.layout-config .p-sidebar-close').click()");
    await wait(350);
    await evaluate("window.__section=id=>document.getElementById(id).closest('section')");
    const inspect = (expression) =>
        evaluate(
            `(() => { const root=${expression},label=root.querySelector('.p-dropdown-label'),trigger=root.querySelector('.p-dropdown-trigger'),r=root.getBoundingClientRect(),l=label.getBoundingClientRect(),s=getComputedStyle(root),t=getComputedStyle(label);return {root:{border:s.borderWidth,borderColor:s.borderColor,background:s.backgroundColor,shadow:s.boxShadow,width:r.width,height:r.height},label:{tag:label.tagName,classes:label.className,visibility:t.visibility,border:t.borderWidth,background:t.backgroundColor,shadow:t.boxShadow,radius:t.borderRadius,paddingTop:t.paddingTop,paddingRight:t.paddingRight,paddingBottom:t.paddingBottom,paddingLeft:t.paddingLeft,text:label.textContent,value:label.value,height:l.height},trigger:{border:getComputedStyle(trigger).borderWidth,height:trigger.getBoundingClientRect().height}}; })()`
        );
    const rootFor = (section) => `__section('${section}').querySelector('.p-dropdown')`;

    const checkBoundary = async (mode, section, state) => {
        const field = await inspect(rootFor(section));

        measurements.push({ mode, section, state, field });
        assert(`${mode}/${section}/${state}: one outer border`, field.root.border, '1px');
        assert(`${mode}/${section}/${state}: label has no inner border`, field.label.border, '0px');
        assert(`${mode}/${section}/${state}: label has no separate background`, field.label.background, 'rgba(0, 0, 0, 0)');
        assert(`${mode}/${section}/${state}: label has no inner ring`, field.label.shadow, 'none');
        assert(`${mode}/${section}/${state}: label has no nested rounded frame`, field.label.radius, '0px');
        assert(`${mode}/${section}/${state}: trigger has no divider border`, field.trigger.border, '0px');

        return field;
    };

    for (const mode of ['dark', 'light']) {
        if (await evaluate(`document.querySelector('.layout-wrapper').dataset.pTheme!=='aura-${mode}-emerald'`)) await evaluate("document.querySelector('.layout-topbar .pi-sun,.layout-topbar .pi-moon').closest('button').click()");
        await until(`document.querySelector('.layout-wrapper').dataset.pTheme==='aura-${mode}-emerald' && !!document.querySelector('#theme-link').sheet`);

        for (const section of ['basic', 'floatlabel']) {
            const field = rootFor(section);

            await evaluate(`${field}.scrollIntoView({block:'center'})`);
            await checkBoundary(mode, section, 'closed');
            await capture(`${mode}-${section}-closed`);
            await click(field);
            await until("!!document.querySelector('.p-dropdown-panel') && !document.querySelector('.p-connected-overlay-enter-active')");
            await wait(180);
            assert(`${mode}/${section}: actual menu is body portaled`, await evaluate("document.querySelector('.p-dropdown-panel').parentElement===document.body"), true);
            await click("document.querySelector('.p-dropdown-panel .p-dropdown-item')");
            await until("!document.querySelector('.p-dropdown-panel')");
            await wait(250);
            const selected = await checkBoundary(mode, section, 'selected');

            assert(`${mode}/${section}: selecting retains visible label`, selected.label.visibility, 'visible');
            assert(`${mode}/${section}: selecting updates displayed value`, selected.label.text, 'New York');
            await capture(`${mode}-${section}-selected`);
            await evaluate(`${field}.querySelector('input').focus()`);
            await wait(250);
            const focused = await checkBoundary(mode, section, 'focused');
            const primary = mode === 'dark' ? 'rgb(52, 211, 153)' : 'rgb(16, 185, 129)';

            assert(`${mode}/${section}: focus paints complete outer border`, focused.root.borderColor, primary);
            assert(`${mode}/${section}: keyboard focus remains visible`, focused.root.shadow.includes(primary), true);
            await evaluate(`${field}.querySelector('input').blur()`);
        }

        for (const section of ['editable', 'filled', 'invalid', 'disabled']) {
            const field = rootFor(section);

            await evaluate(`${field}.scrollIntoView({block:'center'})`);
            await checkBoundary(mode, section, 'closed');

            if (section !== 'disabled') {
                const input = section === 'editable' ? `${field}.querySelector('input.p-dropdown-label')` : `${field}.querySelector('input')`;

                await evaluate(`${input}.focus()`);
                await wait(250);
                const focused = await checkBoundary(mode, section, 'focused');
                const expected = section === 'invalid' ? 'rgb(239, 68, 68)' : mode === 'dark' ? 'rgb(52, 211, 153)' : 'rgb(16, 185, 129)';

                assert(`${mode}/${section}: focus border uses correct token`, focused.root.borderColor, expected);
                assert(`${mode}/${section}: focus ring stays on outer control`, focused.root.shadow.includes(expected), true);

                if (section === 'editable') {
                    await page('Input.insertText', { text: 'Mantle' });
                    assert(`${mode}/editable: typing still updates input`, await evaluate(`${input}.value.endsWith('Mantle')`), true);
                }

                await capture(`${mode}-${section}-focus`);
                await evaluate(`${input}.blur()`);
            } else {
                assert(`${mode}/disabled: input remains disabled`, await evaluate(`${field}.querySelector('input').disabled`), true);
                assert(`${mode}/disabled: entire control dims once`, await evaluate(`getComputedStyle(${field}).opacity`), '0.6');
            }
        }
    }

    const passed = assertions.every((item) => item.passed);

    await writeFile(destination, JSON.stringify({ passed, probe, assertions, measurements, logs }, null, 2));
    process.stdout.write(JSON.stringify({ passed, probe, destination, assertions: assertions.length }, null, 2));
    await send('Browser.close');
    await exited;
} catch (error) {
    await writeFile(destination, JSON.stringify({ passed: false, error: error.message, assertions, measurements, logs }, null, 2));

    if (page) {
        const shot = await page('Page.captureScreenshot', { format: 'png' }).catch(() => null);

        if (shot) await writeFile(`${destination}.failure.png`, Buffer.from(shot.data, 'base64'));
    }

    throw error;
} finally {
    await writeFile(`${destination}.console.json`, JSON.stringify(logs, null, 2));

    if (browserProcess && browserProcess.exitCode === null) {
        browserProcess.kill();
        await exited;
    }

    socket?.close();
    await writeFile(`${destination}.stderr.txt`, stderr);
    if (path.dirname(profile) === path.resolve(tmpdir()) && path.basename(profile).startsWith('mantle-colorpicker-docs-')) await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
}
