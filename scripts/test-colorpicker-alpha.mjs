// Native Chromium keyboard/layout regression. Uses existing Rollup dependencies.
// Optional MANTLE_TEST_BROWSER, MANTLE_TEST_REPORT, MANTLE_TEST_SCREENSHOT paths,
// and MANTLE_TEST_THEME=lara-light-indigo|lara-dark-indigo.
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { rollup } from 'rollup';

const browser = [process.env.MANTLE_TEST_BROWSER, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', '/usr/bin/chromium', '/usr/bin/google-chrome'].find(
    (file) => file && existsSync(file)
);

if (!browser) throw new Error('Set MANTLE_TEST_BROWSER to an installed Chromium executable.');

const bundle = await rollup({
    input: path.resolve(import.meta.dirname, 'fixtures/colorpicker-alpha.jsx'),
    plugins: [
        replace({ preventAssignment: true, 'process.env.NODE_ENV': JSON.stringify('development') }),
        nodeResolve({ browser: true, extensions: ['.js', '.jsx', '.json'] }),
        commonjs({ include: /node_modules/ }),
        babel({ babelHelpers: 'bundled', babelrc: false, exclude: 'node_modules/**', extensions: ['.js', '.jsx'], presets: ['@babel/preset-react'] })
    ]
});
const { output } = await bundle.generate({ format: 'iife', inlineDynamicImports: true });

await bundle.close();

const themeName = process.env.MANTLE_TEST_THEME || 'lara-light-indigo';

if (!['lara-light-indigo', 'lara-dark-indigo'].includes(themeName)) throw new Error('MANTLE_TEST_THEME must be lara-light-indigo or lara-dark-indigo.');

const theme = await readFile(path.resolve(import.meta.dirname, `../public/themes/${themeName}/theme.css`));
const server = createServer((request, response) => {
    if (request.url === '/fixture.js') {
        response.setHeader('Content-Type', 'text/javascript');
        response.end(output[0].code);
    } else if (request.url === '/theme.css') {
        response.setHeader('Content-Type', 'text/css');
        response.end(theme);
    } else {
        response.setHeader('Content-Type', 'text/html');
        response.end(
            '<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="/theme.css"><style>body{font:16px system-ui;padding:24px}.cases{display:flex;gap:64px;align-items:start}h2{font-size:16px}output{display:block;margin-top:12px}button{margin:8px}*{animation:none!important}</style></head><body><div id="app"></div><script src="/fixture.js"></script></body></html>'
        );
    }
});
const profile = await mkdtemp(path.join(tmpdir(), 'mantle-alpha-browser-'));
const assertions = [];
const errors = [];
let child;
let socket;
let browserExited;
let stderr = '';
let page;
let readyTimer;
const report = { passed: false, theme: themeName, assertions, errors };

try {
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    let ready;
    const readyPromise = new Promise((resolve, reject) => {
        readyTimer = setTimeout(() => reject(new Error('Chromium debugger did not start.')), 15000);

        ready = (url) => {
            clearTimeout(readyTimer);
            resolve(url);
        };
    });

    child = spawn(
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
            '--window-size=1280,900',
            `--user-data-dir=${profile}`,
            `http://127.0.0.1:${server.address().port}`
        ],
        { windowsHide: true }
    );
    browserExited = new Promise((resolve) => child.on('close', resolve));
    child.stderr.on('data', (chunk) => {
        stderr += chunk;
        const url = stderr.match(/DevTools listening on (ws:\/\/[^\s]+)/)?.[1];

        if (url) ready(url);
    });
    socket = new WebSocket(await readyPromise);
    await new Promise((resolve, reject) => {
        socket.addEventListener('open', resolve, { once: true });
        socket.addEventListener('error', reject, { once: true });
    });
    let id = 0;
    const pending = new Map();

    socket.addEventListener('message', ({ data }) => {
        const message = JSON.parse(data);
        const request = pending.get(message.id);

        if (message.method === 'Runtime.exceptionThrown') errors.push(message.params);

        if (request) {
            pending.delete(message.id);
            clearTimeout(request.timer);
            message.error ? request.reject(new Error(message.error.message)) : request.resolve(message.result);
        }
    });
    const send = (method, params = {}, sessionId) =>
        new Promise((resolve, reject) => {
            const messageId = ++id;
            const timer = setTimeout(() => {
                pending.delete(messageId);
                reject(new Error(`Command timed out: ${method}`));
            }, 10000);

            pending.set(messageId, { resolve, reject, timer });
            socket.send(JSON.stringify({ id: messageId, method, params, sessionId }));
        });
    const { targetInfos } = await send('Target.getTargets');
    const target = targetInfos.find((item) => item.type === 'page' && item.url.startsWith('http://127.0.0.1:'));
    const { sessionId } = await send('Target.attachToTarget', { targetId: target.targetId, flatten: true });

    page = (method, params) => send(method, params, sessionId);
    await page('Runtime.enable');

    const evaluate = async (expression) => {
        const response = await page('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });

        if (response.exceptionDetails) throw new Error(response.exceptionDetails.text + ': ' + response.exceptionDetails.exception?.description);

        return response.result.value;
    };

    const waitFor = async (expression) => {
        const deadline = Date.now() + 5000;

        while (Date.now() < deadline) {
            if (await evaluate(expression)) return;
            await new Promise((resolve) => setTimeout(resolve, 40));
        }

        throw new Error(`Timed out: ${expression}`);
    };

    const check = async (name, expression) => {
        const passed = Boolean(await evaluate(expression));

        assertions.push({ name, passed });
        if (!passed) throw new Error(name);
    };

    const key = async (name, modifiers = 0) => {
        const codes = { ArrowRight: 39, ArrowLeft: 37, Home: 36, End: 35, Enter: 13, ' ': 32, Escape: 27, Tab: 9 };
        const params = { key: name, code: name === ' ' ? 'Space' : name, windowsVirtualKeyCode: codes[name], nativeVirtualKeyCode: codes[name], modifiers };

        await page('Input.dispatchKeyEvent', { type: 'keyDown', ...params });
        await page('Input.dispatchKeyEvent', { type: 'keyUp', ...params });
    };

    const focus = (selector) => evaluate(`document.querySelector(${JSON.stringify(selector)}).focus()`);
    const slider = '#inline .p-colorpicker-alpha-slider';

    await waitFor('Boolean(window.alphaFixture)');
    await check('Default picker has no alpha UI', '!document.querySelector("#legacy input[type=range]")');
    await check('Opacity range is named and in percent', `document.querySelector('${slider}').getAttribute('aria-label') === 'Opacity' && document.querySelector('${slider}').value === '50'`);
    await focus(slider);
    await key('ArrowRight');
    await waitFor('window.alphaChanges.length === 1');
    await check('ArrowRight emits 51% without changing hex RGB', 'window.alphaChanges.at(-1) === "00117782"');
    await key('ArrowLeft');
    await check('ArrowLeft emits 50%', 'window.alphaChanges.at(-1) === "00117780"');
    await key('Home');
    await check('Home emits transparent', 'window.alphaChanges.at(-1) === "00117700"');
    await key('End');
    await check('End emits opaque', 'window.alphaChanges.at(-1) === "001177ff"');
    await evaluate('window.alphaFixture.setValue("00117780")');
    await waitFor(`document.querySelector('${slider}').value === '50'`);
    await check(
        'Inline preview composites color over checkerboard',
        'getComputedStyle(document.querySelector("#inline .p-colorpicker-alpha-preview")).backgroundImage.includes("conic-gradient") && getComputedStyle(document.querySelector("#inline .p-colorpicker-alpha-preview")).backgroundImage.includes("rgba(0, 17, 119")'
    );
    await check(
        'Inline opacity UI fits panel bounds',
        '(() => {const panel=document.querySelector("#inline .p-colorpicker-panel").getBoundingClientRect();const slider=document.querySelector("#inline input[type=range]").getBoundingClientRect();return slider.bottom <= panel.bottom && slider.right <= panel.right && slider.left >= panel.left;})()'
    );
    report.contrast = await evaluate(`(() => {
        const text = getComputedStyle(document.querySelector('#inline .p-colorpicker-alpha-label')).color;
        const background = getComputedStyle(document.querySelector('#inline .p-colorpicker-panel')).backgroundColor;
        const luminance = (color) => color.match(/[\\d.]+/g).slice(0, 3).map(Number).map((c) => c / 255).map((c) => c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4).reduce((sum, c, i) => sum + c * [.2126, .7152, .0722][i], 0);
        const values = [luminance(text), luminance(background)].sort((a, b) => b-a);
        return { text, background, ratio: (values[0] + .05) / (values[1] + .05) };
    })()`);
    assertions.push({ name: 'Opacity text contrast reaches 4.5:1', passed: report.contrast.ratio >= 4.5 });

    if (report.contrast.ratio < 4.5) throw new Error('Opacity text contrast below 4.5:1');

    for (const format of ['rgb', 'hsb']) {
        const value = format === 'rgb' ? '{r:0,g:17,b:119,a:.5}' : '{h:240,s:100,b:100,a:.5}';

        await evaluate(`window.alphaFixture.setOptions({format:'${format}'}); window.alphaFixture.setValue(${value})`);
        await waitFor(`document.querySelector('${slider}').value === '50'`);
        await focus(slider);
        await key('ArrowRight');
        await check(`${format} native opacity edit emits normalized a`, 'window.alphaChanges.at(-1).a === .51');
    }

    await evaluate('window.alphaFixture.setOptions({}); window.alphaFixture.setValue("00117780")');
    await waitFor(`document.querySelector('${slider}').value === '50'`);
    await focus('#popup-input');
    await key('Enter');
    await waitFor('document.activeElement.classList.contains("p-colorpicker-alpha-slider") && !document.querySelector("#inline").contains(document.activeElement)');
    await check('Enter focuses popup opacity', 'document.activeElement.value === "50"');
    await check(
        'Popup checkerboard preview is visible',
        '(() => {const e=document.activeElement.closest(".p-colorpicker-panel").querySelector(".p-colorpicker-alpha-preview");return e.getBoundingClientRect().width > 0 && getComputedStyle(e).backgroundImage.includes("conic-gradient");})()'
    );
    await key('ArrowRight');
    await check('Popup native opacity edit emits updated value', 'window.alphaChanges.at(-1) === "00117782"');
    await key('Escape');
    await waitFor('document.activeElement.id === "popup-input"');
    await check('Escape returns popup focus to trigger', 'document.activeElement.id === "popup-input"');
    await key(' ');
    await waitFor('document.activeElement.classList.contains("p-colorpicker-alpha-slider")');
    await check('Space focuses popup opacity', 'document.activeElement.classList.contains("p-colorpicker-alpha-slider")');
    await key('Tab', 8);
    await check('Shift+Tab closes popup and focuses trigger', 'document.activeElement.id === "popup-input"');
    await key('Enter');
    await waitFor('document.activeElement.classList.contains("p-colorpicker-alpha-slider")');
    await key('Tab');
    await check('Tab leaves popup at next control', 'document.activeElement.id === "after"');
    await waitFor('!Array.from(document.querySelectorAll(".p-colorpicker-overlay-panel")).some(e => e.getBoundingClientRect().height > 0)');
    await evaluate('document.querySelector("#popup-input").click()');
    await waitFor('Array.from(document.querySelectorAll(".p-colorpicker-overlay-panel")).some(e => e.getBoundingClientRect().height > 0)');
    await focus('#popup-input');
    await key('Tab');
    await check('Tab from open trigger reaches popup opacity', 'document.activeElement.classList.contains("p-colorpicker-alpha-slider")');
    await key('Escape');

    for (const option of ['disabled', 'readOnly']) {
        await evaluate(`window.alphaFixture.setOptions({${option}: true})`);
        await waitFor(`document.querySelector('${slider}').disabled`);
        await check(`${option} disables native opacity editing`, `document.querySelector('${slider}').disabled`);
        const count = await evaluate('window.alphaChanges.length');

        await focus(slider);
        await key('Home');
        await check(`${option} emits no keyboard changes`, `window.alphaChanges.length === ${count}`);
        await evaluate('window.alphaFixture.setOptions({})');
        await waitFor(`!document.querySelector('${slider}').disabled`);
    }

    await focus('#popup-input');
    await key('Enter');
    await waitFor('document.activeElement.classList.contains("p-colorpicker-alpha-slider")');
    await check('Popup opacity UI fits panel bounds', '(() => {const e=document.activeElement;const r=e.getBoundingClientRect();const p=e.closest(".p-colorpicker-panel").getBoundingClientRect();return r.bottom<=p.bottom && r.right<=p.right;})()');
    report.passed = errors.length === 0;

    if (process.env.MANTLE_TEST_SCREENSHOT) {
        const { data } = await page('Page.captureScreenshot', { format: 'png' });

        await writeFile(process.env.MANTLE_TEST_SCREENSHOT, Buffer.from(data, 'base64'));
    }

    await send('Browser.close');
    await browserExited;
} catch (error) {
    report.error = error.stack;
} finally {
    clearTimeout(readyTimer);

    if (page && child?.exitCode === null && process.env.MANTLE_TEST_SCREENSHOT) {
        const { data } = await page('Page.captureScreenshot', { format: 'png' });

        await writeFile(process.env.MANTLE_TEST_SCREENSHOT, Buffer.from(data, 'base64'));
    }

    if (child && child.exitCode === null) {
        child.kill();
        await browserExited;
    }

    socket?.close();
    await new Promise((resolve) => server.close(resolve));
    if (path.dirname(profile) === path.resolve(tmpdir()) && path.basename(profile).startsWith('mantle-alpha-browser-')) await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
    if (process.env.MANTLE_TEST_REPORT) await writeFile(process.env.MANTLE_TEST_REPORT, JSON.stringify(report, null, 2));
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
    if (!report.passed) process.exitCode = 1;
}
