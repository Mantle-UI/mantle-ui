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
import { fileURLToPath } from 'node:url';
import { rollup } from 'rollup';
import { finalizeBrowserRun, recordRunnerFailure, writeRunnerOutput } from './browser-runner-cleanup.mjs';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const browser = [process.env.MANTLE_TEST_BROWSER, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', '/usr/bin/chromium', '/usr/bin/google-chrome'].find(
    (file) => file && existsSync(file)
);

if (!browser) throw new Error('Set MANTLE_TEST_BROWSER to an installed Chromium executable.');

const bundle = await rollup({
    input: path.resolve(scriptDirectory, 'fixtures/colorpicker-alpha.jsx'),
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

const theme = await readFile(path.resolve(scriptDirectory, `../public/themes/${themeName}/theme.css`));
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
let browserExited;
let stderr = '';
let page;
let send;
const pending = new Map();
const report = { passed: false, node: process.version, transport: 'pipe', theme: themeName, assertions, errors };

try {
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
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
            '--remote-debugging-pipe',
            '--window-size=1280,900',
            `--user-data-dir=${profile}`,
            `http://127.0.0.1:${server.address().port}`
        ],
        { windowsHide: true, stdio: ['ignore', 'ignore', 'pipe', 'pipe', 'pipe'] }
    );
    browserExited = new Promise((resolve) => child.on('close', resolve));
    child.stderr.on('data', (chunk) => {
        stderr += chunk;
    });
    let id = 0;
    let incoming = '';

    const rejectPending = (error) => {
        for (const request of pending.values()) {
            clearTimeout(request.timer);
            request.reject(error);
        }

        pending.clear();
    };

    child.on('error', rejectPending);
    child.stdio[3].on('error', rejectPending);
    child.stdio[4].on('error', rejectPending);
    child.stdio[4].setEncoding('utf8');
    // Chrome's CDP pipe uses UTF-8 JSON separated by NUL on file descriptors 3/4.
    // Native child-process streams work on Node 20.10 without a WebSocket global.
    child.stdio[4].on('data', (chunk) => {
        incoming += chunk;
        let boundary;

        while ((boundary = incoming.indexOf('\0')) !== -1) {
            const message = JSON.parse(incoming.slice(0, boundary));
            const request = pending.get(message.id);

            incoming = incoming.slice(boundary + 1);
            if (message.method === 'Runtime.exceptionThrown') errors.push(message.params);

            if (request) {
                pending.delete(message.id);
                clearTimeout(request.timer);
                message.error ? request.reject(new Error(message.error.message)) : request.resolve(message.result);
            }
        }
    });
    send = (method, params = {}, sessionId) =>
        new Promise((resolve, reject) => {
            const messageId = ++id;
            const timer = setTimeout(() => {
                pending.delete(messageId);
                reject(new Error(`Command timed out: ${method}`));
            }, 10000);

            pending.set(messageId, { resolve, reject, timer });
            child.stdio[3].write(JSON.stringify({ id: messageId, method, params, sessionId }) + '\0');
        });
    let target;
    const deadline = Date.now() + 10000;

    while (!target && Date.now() < deadline) {
        const { targetInfos } = await send('Target.getTargets');

        target = targetInfos.find((item) => item.type === 'page' && item.url.startsWith('http://127.0.0.1:'));
        if (!target) await new Promise((resolve) => setTimeout(resolve, 40));
    }

    if (!target) throw new Error(`Chromium did not open the fixture page. ${stderr}`);

    const { sessionId } = await send('Target.attachToTarget', { targetId: target.targetId, flatten: true });

    page = (method, params) => send(method, params, sessionId);
    await page('Runtime.enable');
    await page('DOM.enable');
    await page('CSS.enable');

    const rangeParts = async () => {
        const { root } = await page('DOM.getDocument', { depth: -1, pierce: true });
        const descendants = (node) => [node, ...(node.children || []).flatMap(descendants), ...(node.shadowRoots || []).flatMap(descendants)];
        const nodes = descendants(root);
        const input = nodes.find((node) => node.nodeName === 'INPUT' && node.attributes?.includes('p-colorpicker-alpha-slider'));
        const parts = descendants(input).filter((node) => node.attributes?.includes('track') || node.attributes?.includes('thumb'));
        const result = {};

        for (const part of parts) {
            const { computedStyle } = await page('CSS.getComputedStyleForNode', { nodeId: part.nodeId });
            const { model } = await page('DOM.getBoxModel', { nodeId: part.nodeId });
            const properties = ['background-image', 'background-color', 'background-size', 'width', 'height', 'border-top-color', 'border-top-width', 'border-radius', 'box-shadow'];

            result[part.attributes.includes('track') ? 'track' : 'thumb'] = {
                ...Object.fromEntries(computedStyle.filter(({ name }) => properties.includes(name)).map(({ name, value }) => [name, value])),
                bounds: { left: model.border[0], right: model.border[2], top: model.border[1], bottom: model.border[5] }
            };
        }

        return result;
    };

    let globalObject;
    const fixtureDeadline = Date.now() + 10000;

    while (!globalObject && Date.now() < fixtureDeadline) {
        try {
            const { result } = await page('Runtime.evaluate', { expression: 'window.alphaFixture ? globalThis : undefined' });

            if (result.objectId) globalObject = result;
        } catch (error) {
            if (!/Cannot find context|Execution context was destroyed/.test(error.message)) throw error;
        }

        if (!globalObject) await new Promise((resolve) => setTimeout(resolve, 40));
    }

    if (!globalObject) throw new Error('Chromium did not initialize the fixture.');

    const evaluate = async (fn, ...args) => {
        const response = await page('Runtime.callFunctionOn', {
            objectId: globalObject.objectId,
            functionDeclaration: fn.toString(),
            arguments: args.map((value) => ({ value })),
            returnByValue: true,
            awaitPromise: true
        });

        if (response.exceptionDetails) throw new Error(response.exceptionDetails.text + ': ' + response.exceptionDetails.exception?.description);

        return response.result.value;
    };

    const waitFor = async (fn, ...args) => {
        const deadline = Date.now() + 5000;

        while (Date.now() < deadline) {
            if (await evaluate(fn, ...args)) return;
            await new Promise((resolve) => setTimeout(resolve, 40));
        }

        throw new Error(`Timed out: ${fn.toString()}`);
    };

    const record = (name, passed) => {
        assertions.push({ name, passed });
        if (!passed) throw new Error(name);
    };

    const check = async (name, fn, ...args) => record(name, Boolean(await evaluate(fn, ...args)));

    const key = async (name, modifiers = 0) => {
        const codes = { ArrowRight: 39, ArrowLeft: 37, Home: 36, End: 35, Enter: 13, ' ': 32, Escape: 27, Tab: 9 };
        const params = { key: name, code: name === ' ' ? 'Space' : name, windowsVirtualKeyCode: codes[name], nativeVirtualKeyCode: codes[name], modifiers };

        await page('Input.dispatchKeyEvent', { type: 'keyDown', ...params });
        await page('Input.dispatchKeyEvent', { type: 'keyUp', ...params });
    };

    const focus = (selector) => evaluate((target) => document.querySelector(target).focus(), selector);

    const click = async (selector, xRatio = 0.5, yRatio = 0.5) => {
        if (![xRatio, yRatio].every((ratio) => Number.isFinite(ratio) && ratio >= 0 && ratio <= 1)) throw new TypeError('Click ratios must be finite numbers in [0, 1].');

        const position = await evaluate(
            (target, x, y) => {
                const bounds = document.querySelector(target).getBoundingClientRect();

                return { x: bounds.left + bounds.width * x, y: bounds.top + bounds.height * y };
            },
            selector,
            xRatio,
            yRatio
        );

        await page('Input.dispatchMouseEvent', { type: 'mouseMoved', ...position });
        await page('Input.dispatchMouseEvent', { type: 'mousePressed', ...position, button: 'left', clickCount: 1 });
        await page('Input.dispatchMouseEvent', { type: 'mouseReleased', ...position, button: 'left', clickCount: 1 });
    };

    const slider = '#inline .p-colorpicker-alpha-slider';

    await waitFor(() => Boolean(window.alphaFixture));

    const argumentCases = ['\");globalThis.runnerInjected=true;//', '</script><script>globalThis.runnerInjected=true</script>', '` ${globalThis.runnerInjected=true}', 'quote" single\' backslash\\ newline\n', 'line\u2028separator\u2029paragraph'];

    for (const [index, value] of argumentCases.entries()) {
        record(`Structured argument ${index + 1} stays data`, (await evaluate((argument) => argument, value)) === value);
    }

    const probeSelector = await evaluate((id) => {
        window.runnerInjected = false;
        const button = document.createElement('button');

        button.id = id;
        button.textContent = 'Runner argument probe';
        button.onclick = () => (button.dataset.clicked = 'true');
        document.body.prepend(button);

        return '#' + CSS.escape(id);
    }, argumentCases.join(' '));

    await focus(probeSelector);
    await check('Focus accepts escaped selector data', (target) => document.activeElement === document.querySelector(target), probeSelector);
    let rejectedRatios = 0;

    for (const ratio of [NaN, Infinity, -Infinity, -0.1, 1.1, '0.5', null, true, {}]) {
        for (const axes of [
            [ratio, 0.5],
            [0.5, ratio]
        ]) {
            try {
                await click(probeSelector, ...axes);
            } catch (error) {
                if (!(error instanceof TypeError)) throw error;

                rejectedRatios++;
            }
        }
    }

    record('Click rejects nonnumeric, nonfinite and out-of-range ratios on either axis', rejectedRatios === 18);
    await check('Rejected ratios dispatch no clicks', (target) => !document.querySelector(target).dataset.clicked, probeSelector);
    await click(probeSelector);
    await check('Click accepts escaped selector data without code execution', (target) => document.querySelector(target).dataset.clicked === 'true' && window.runnerInjected === false, probeSelector);
    await evaluate((target) => document.querySelector(target).remove(), probeSelector);

    await check('Inline appear transition initializes without alpha', () => document.querySelector('#appear-opaque .p-colorpicker-color-selector').style.backgroundColor !== '' && !document.querySelector('#appear-opaque input[type=range]'));
    await check(
        'Inline appear transition initializes with alpha',
        () => document.querySelector('#appear-alpha input[type=range]').value === '50' && document.querySelector('#appear-alpha .p-colorpicker-alpha-preview').style.getPropertyValue('--p-colorpicker-preview-color').includes('rgba(0, 17, 119')
    );
    await check('Default picker has no alpha UI', () => !document.querySelector('#legacy input[type=range]'));
    await check('Opacity range is named and in percent', (target) => document.querySelector(target).getAttribute('aria-label') === 'Opacity' && document.querySelector(target).value === '50', slider);
    report.range = await rangeParts();
    record(
        'Opacity track blends transparent to selected RGB over checkerboard',
        report.range.track['background-image'].includes('rgba(0, 17, 119, 0)') && report.range.track['background-image'].includes('rgb(0, 17, 119)') && report.range.track['background-image'].includes('conic-gradient')
    );
    record('Opacity thumb has visible size and contrasting border', parseFloat(report.range.thumb.width) >= 12 && report.range.thumb['border-top-color'] === 'rgb(255, 255, 255)' && report.range.thumb['background-color'] === 'rgb(50, 50, 50)');
    await focus(slider);
    await check('Keyboard focus has a visible outline', (target) => getComputedStyle(document.querySelector(target)).outlineStyle !== 'none' && parseFloat(getComputedStyle(document.querySelector(target)).outlineWidth) >= 2, slider);
    await key('ArrowRight');
    await waitFor(() => window.alphaChanges.length === 1);
    await check('ArrowRight emits 51% without changing hex RGB', () => window.alphaChanges.at(-1) === '00117782');
    await key('ArrowLeft');
    await check('ArrowLeft emits 50%', () => window.alphaChanges.at(-1) === '00117780');
    await key('Home');
    await check('Home emits transparent', () => window.alphaChanges.at(-1) === '00117700');
    const transparentRange = await rangeParts();

    record('Transparent endpoint places thumb at track start', Math.abs(transparentRange.thumb.bounds.left - transparentRange.track.bounds.left) <= 1);
    await key('End');
    await check('End emits opaque', () => window.alphaChanges.at(-1) === '001177ff');
    const opaqueRange = await rangeParts();

    record('Opaque endpoint places thumb at track end', Math.abs(opaqueRange.thumb.bounds.right - opaqueRange.track.bounds.right) <= 1);
    await evaluate(() => window.alphaFixture.setValue('ff000080'));
    await waitFor((target) => document.querySelector(target).style.getPropertyValue('--p-colorpicker-alpha-rgb') === '255, 0, 0', slider);
    const redRange = await rangeParts();

    record('Controlled RGB replacement refreshes the opacity gradient', redRange.track['background-image'].includes('rgba(255, 0, 0, 0)') && redRange.track['background-image'].includes('rgb(255, 0, 0)'));
    await click('#inline .p-colorpicker-hue', 0.5, 2 / 3);
    await waitFor((target) => document.querySelector(target).style.getPropertyValue('--p-colorpicker-alpha-rgb') === '0, 255, 0', slider);
    const greenRange = await rangeParts();

    record('Hue selection refreshes the opacity gradient live', greenRange.track['background-image'].includes('rgba(0, 255, 0, 0)') && greenRange.track['background-image'].includes('rgb(0, 255, 0)'));
    await click('#inline .p-colorpicker-color-selector');
    await waitFor((target) => document.querySelector(target).style.getPropertyValue('--p-colorpicker-alpha-rgb') === '64, 128, 64', slider);
    const selectedRange = await rangeParts();

    record('Saturation and brightness refresh the opacity gradient live', selectedRange.track['background-image'].includes('rgba(64, 128, 64, 0)'));
    await evaluate(() => window.alphaFixture.setValue('00117780'));
    await waitFor((target) => document.querySelector(target).value === '50' && document.querySelector(target).style.getPropertyValue('--p-colorpicker-alpha-rgb') === '0, 17, 119', slider);
    await check(
        'Inline preview composites color over checkerboard',
        () =>
            getComputedStyle(document.querySelector('#inline .p-colorpicker-alpha-preview')).backgroundImage.includes('conic-gradient') &&
            getComputedStyle(document.querySelector('#inline .p-colorpicker-alpha-preview')).backgroundImage.includes('rgba(0, 17, 119')
    );
    await check('Inline opacity UI fits panel bounds', () => {
        const panel = document.querySelector('#inline .p-colorpicker-panel').getBoundingClientRect();
        const range = document.querySelector('#inline input[type=range]').getBoundingClientRect();

        return range.bottom <= panel.bottom && range.right <= panel.right && range.left >= panel.left;
    });
    report.contrast = await evaluate(() => {
        const text = getComputedStyle(document.querySelector('#inline .p-colorpicker-alpha-label')).color;
        const background = getComputedStyle(document.querySelector('#inline .p-colorpicker-panel')).backgroundColor;
        const luminance = (color) =>
            color
                .match(/[\d.]+/g)
                .slice(0, 3)
                .map(Number)
                .map((c) => c / 255)
                .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
                .reduce((sum, c, i) => sum + c * [0.2126, 0.7152, 0.0722][i], 0);
        const values = [luminance(text), luminance(background)].sort((a, b) => b - a);

        return { text, background, ratio: (values[0] + 0.05) / (values[1] + 0.05) };
    });
    assertions.push({ name: 'Opacity text contrast reaches 4.5:1', passed: report.contrast.ratio >= 4.5 });

    if (report.contrast.ratio < 4.5) throw new Error('Opacity text contrast below 4.5:1');

    for (const format of ['rgb', 'hsb']) {
        const value = format === 'rgb' ? { r: 0, g: 17, b: 119, a: 0.5 } : { h: 240, s: 100, b: 100, a: 0.5 };

        await evaluate(
            (options, color) => {
                window.alphaFixture.setOptions(options);
                window.alphaFixture.setValue(color);

                return new Promise((resolve) => requestAnimationFrame(resolve));
            },
            { format },
            value
        );
        await waitFor((target) => document.querySelector(target).value === '50', slider);
        await focus(slider);
        await key('ArrowRight');
        await check(`${format} native opacity edit emits normalized a`, () => window.alphaChanges.at(-1).a === 0.51);
    }

    for (const appendTo of [null, 'self']) {
        for (const dismissal of ['Escape', 'preview', 'outside', 'imperative']) {
            await evaluate(
                (options) => {
                    window.alphaFixture.setOptions(options);
                    window.alphaFixture.setValue('00117780');
                    window.alphaFixture.setNextTarget('link');

                    return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
                },
                { appendTo, transitionOptions: { timeout: { enter: 0, exit: 1500 } } }
            );
            await focus('#popup-input');
            await key('Enter');
            await waitFor(() => document.activeElement.classList.contains('p-colorpicker-alpha-slider') && !document.querySelector('#inline').contains(document.activeElement));

            if (dismissal === 'Escape') await key('Escape');
            else if (dismissal === 'preview') await click('#popup-input');
            else if (dismissal === 'outside') await click('#before');
            else await evaluate(() => window.alphaFixture.hidePopup());

            await check(`${appendTo || 'portal'} ${dismissal} makes the exiting panel inert`, () => {
                const panel = document.querySelector('.p-colorpicker-overlay-panel');

                return panel?.hasAttribute('inert') && panel.querySelector('input[type=range]').tabIndex === -1;
            });
            await key('Tab');
            await check(`${appendTo || 'portal'} ${dismissal} keeps focus outside the exiting panel`, () => !document.activeElement.closest('.p-colorpicker-overlay-panel'));
            await focus('#popup-input');
            await key('Enter');
            await waitFor(() => document.activeElement.classList.contains('p-colorpicker-alpha-slider') && !document.querySelector('#inline').contains(document.activeElement));
            await check(`${appendTo || 'portal'} ${dismissal} restores opacity on rapid reopening`, () => !document.activeElement.closest('.p-colorpicker-overlay-panel').hasAttribute('inert') && document.activeElement.tabIndex === 0);
            await key('Escape');
            await waitFor(() => !document.querySelector('.p-colorpicker-overlay-panel'));
        }
    }

    await evaluate(() => {
        window.alphaFixture.setOptions({});
        window.alphaFixture.setValue('00117780');
    });
    await waitFor((target) => document.querySelector(target).value === '50' && document.querySelector(target).style.getPropertyValue('--p-colorpicker-alpha-rgb') === '0, 17, 119', slider);
    await focus('#popup-input');
    await key('Enter');
    await waitFor(() => document.activeElement.classList.contains('p-colorpicker-alpha-slider') && !document.querySelector('#inline').contains(document.activeElement));
    await check('Enter focuses popup opacity', () => document.activeElement.value === '50');
    await check('Popup checkerboard preview is visible', () => {
        const preview = document.activeElement.closest('.p-colorpicker-panel').querySelector('.p-colorpicker-alpha-preview');

        return preview.getBoundingClientRect().width > 0 && getComputedStyle(preview).backgroundImage.includes('conic-gradient');
    });
    await key('ArrowRight');
    await check('Popup native opacity edit emits updated value', () => window.alphaChanges.at(-1) === '00117782');
    await key('Escape');
    await waitFor(() => document.activeElement.id === 'popup-input');
    await check('Escape returns popup focus to trigger', () => document.activeElement.id === 'popup-input');
    await key(' ');
    await waitFor(() => document.activeElement.classList.contains('p-colorpicker-alpha-slider'));
    await check('Space focuses popup opacity', () => document.activeElement.classList.contains('p-colorpicker-alpha-slider'));
    await key('Tab', 8);
    await check('Shift+Tab closes popup and focuses trigger', () => document.activeElement.id === 'popup-input');
    await key('Enter');
    await waitFor(() => document.activeElement.classList.contains('p-colorpicker-alpha-slider'));
    await key('Tab');
    await check('Tab leaves popup at next control', () => document.activeElement.id === 'after');
    await waitFor(() => !Array.from(document.querySelectorAll('.p-colorpicker-overlay-panel')).some((panel) => panel.getBoundingClientRect().height > 0));
    await evaluate(() => document.querySelector('#popup-input').click());
    await waitFor(() => Array.from(document.querySelectorAll('.p-colorpicker-overlay-panel')).some((panel) => panel.getBoundingClientRect().height > 0));
    await focus('#popup-input');
    await key('Tab');
    await check('Tab from open trigger reaches popup opacity', () => document.activeElement.classList.contains('p-colorpicker-alpha-slider'));
    await key('Escape');

    for (const option of ['disabled', 'readOnly']) {
        await evaluate((options) => window.alphaFixture.setOptions(options), { [option]: true });
        await waitFor((target) => document.querySelector(target).disabled, slider);
        await check(`${option} disables native opacity editing`, (target) => document.querySelector(target).disabled, slider);
        await check(`${option} visibly dims the opacity control`, (target) => Number(getComputedStyle(document.querySelector(target)).opacity) < 1, slider);
        const count = await evaluate(() => window.alphaChanges.length);

        await focus(slider);
        await key('Home');
        await check(`${option} emits no keyboard changes`, (previousCount) => window.alphaChanges.length === previousCount, count);
        await evaluate(() => window.alphaFixture.setOptions({}));
        await waitFor((target) => !document.querySelector(target).disabled, slider);
    }

    for (const appendTo of [null, 'self']) {
        for (const nextTarget of ['summary', 'closedDetails', 'radio']) {
            await evaluate(
                (options, next) => {
                    window.alphaFixture.setOptions(options);
                    window.alphaFixture.setNextTarget(next);

                    return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
                },
                { appendTo },
                nextTarget
            );
            await focus('#popup-input');
            await key('Enter');
            await waitFor(() => document.activeElement.classList.contains('p-colorpicker-alpha-slider') && !document.querySelector('#inline').contains(document.activeElement));
            await key('Tab');
            await check(`${appendTo || 'portal'} popup Tab follows native ${nextTarget} order`, () => document.activeElement.id === 'after');
            await key('Tab');
            await check(`${appendTo || 'portal'} exiting popup range stays out of tab order`, () => !document.activeElement.closest('.p-colorpicker-overlay-panel'));
            await focus('#popup-input');
            await key('Enter');
            await waitFor(() => document.activeElement.classList.contains('p-colorpicker-alpha-slider') && !document.querySelector('#inline').contains(document.activeElement));
            await check(`${appendTo || 'portal'} popup restores opacity focus after ${nextTarget} exit`, () => document.activeElement.disabled === false);
            await key('Escape');
        }
    }

    await evaluate(() => {
        window.alphaFixture.setOptions({});
        window.alphaFixture.setNextTarget('link');

        return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    });
    await focus('#popup-input');
    await key('Enter');
    await waitFor(() => document.activeElement.classList.contains('p-colorpicker-alpha-slider'));
    await check('Popup opacity UI fits panel bounds', () => {
        const range = document.activeElement.getBoundingClientRect();
        const panel = document.activeElement.closest('.p-colorpicker-panel').getBoundingClientRect();

        return range.bottom <= panel.bottom && range.right <= panel.right;
    });
    report.passed = errors.length === 0;
} catch (error) {
    recordRunnerFailure(report, error, 'test');
} finally {
    const canCapture = page && child?.exitCode === null && process.env.MANTLE_TEST_SCREENSHOT;
    const exitCode = await finalizeBrowserRun({
        report,
        captureScreenshot: canCapture
            ? async () => {
                  const { data } = await page('Page.captureScreenshot', { format: 'png' });

                  return Buffer.from(data, 'base64');
              }
            : undefined,
        writeScreenshot: (data) => writeFile(process.env.MANTLE_TEST_SCREENSHOT, data),
        closeBrowser: async () => {
            if (child?.exitCode === null && send) {
                await send('Browser.close');
                await browserExited;
            }
        },
        terminateBrowser: async () => {
            if (child?.exitCode === null) {
                if (!child.kill()) throw new Error('Unable to terminate Chromium.');

                await browserExited;
            }
        },
        closeServer: () => new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve()))),
        removeProfile: async () => {
            if (path.dirname(profile) !== path.resolve(tmpdir()) || !path.basename(profile).startsWith('mantle-alpha-browser-')) throw new Error('Refusing to remove an unexpected browser profile path.');

            await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
        },
        writeReport: process.env.MANTLE_TEST_REPORT ? (value) => writeFile(process.env.MANTLE_TEST_REPORT, JSON.stringify(value, null, 2)) : undefined,
        outputReport: (value) => writeRunnerOutput(process.stdout, `${JSON.stringify(value, null, 2)}\n`)
    });

    for (const request of pending.values()) clearTimeout(request.timer);
    pending.clear();
    if (exitCode) process.exitCode = exitCode;
}
