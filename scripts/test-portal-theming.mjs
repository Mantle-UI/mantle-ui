// Real Chromium computed-style checks. Requires an installed Chrome/Edge, or
// MANTLE_TEST_BROWSER pointing to a Chromium executable. No new npm dependency.
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

const candidates = [process.env.MANTLE_TEST_BROWSER, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome'];
const browser = candidates.find((candidate) => candidate && existsSync(candidate));

if (!browser) {
    throw new Error('Set MANTLE_TEST_BROWSER to an installed Chromium executable to run computed-style regressions.');
}

const bundle = await rollup({
    input: path.resolve(import.meta.dirname, 'fixtures', process.argv[2] || 'portal-theming.jsx'),
    plugins: [
        replace({ preventAssignment: true, 'process.env.NODE_ENV': JSON.stringify('development') }),
        nodeResolve({ browser: true, extensions: ['.js', '.jsx', '.json', '.node'] }),
        commonjs({ include: /node_modules/ }),
        babel({ babelHelpers: 'bundled', babelrc: false, exclude: 'node_modules/**', extensions: ['.js', '.jsx'], presets: ['@babel/preset-react'] })
    ]
});
const { output } = await bundle.generate({ format: 'iife', inlineDynamicImports: true });

await bundle.close();

const profile = await mkdtemp(path.join(tmpdir(), 'mantle-portal-theme-'));
let debuggerReady;
let debuggerConnection;
let debuggerSocket;
const browserLogs = [];
const debuggerUrl = new Promise((resolve) => (debuggerReady = resolve));

const connectDebugger = async () => {
    const socket = new WebSocket(await debuggerUrl);
    const pending = new Map();
    let commandId = 0;

    debuggerSocket = socket;
    await new Promise((resolve, reject) => {
        socket.addEventListener('open', resolve, { once: true });
        socket.addEventListener('error', reject, { once: true });
    });
    socket.addEventListener('message', ({ data }) => {
        const message = JSON.parse(data);
        const request = pending.get(message.id);

        if (message.method === 'Runtime.exceptionThrown' || message.method === 'Runtime.consoleAPICalled') {
            browserLogs.push(message.params);
        }

        if (request) {
            pending.delete(message.id);
            clearTimeout(request.timeout);
            message.error ? request.reject(new Error(message.error.message)) : request.resolve(message.result);
        }
    });
    const send = (method, params = {}, sessionId) =>
        new Promise((resolve, reject) => {
            const id = ++commandId;

            const timeout = setTimeout(() => {
                pending.delete(id);
                reject(new Error(`Browser command timed out: ${method}`));
            }, 5000);

            pending.set(id, { resolve, reject, timeout });
            socket.send(JSON.stringify({ id, method, params, sessionId }));
        });
    let target;

    for (let attempt = 0; attempt < 20 && !target; attempt++) {
        const { targetInfos } = await send('Target.getTargets');

        target = targetInfos.find((item) => item.type === 'page' && item.url.startsWith('http://127.0.0.1:'));

        if (!target) {
            await new Promise((resolve) => setTimeout(resolve, 100));
        }
    }

    if (!target) {
        throw new Error('Chromium did not expose the local fixture page.');
    }

    const { sessionId } = await send('Target.attachToTarget', { targetId: target.targetId, flatten: true });
    const page = (method, params) => send(method, params, sessionId);

    await page('DOM.enable');
    await page('CSS.enable');
    await page('Runtime.enable');

    const forcePseudo = async (selector, forcedPseudoClasses, pointer = false) => {
        const { root } = await page('DOM.getDocument');
        const { nodeId } = await page('DOM.querySelector', { nodeId: root.nodeId, selector });

        if (!nodeId) {
            throw new Error(`Pseudo-state target missing: ${selector}`);
        }

        if (pointer) {
            await page('DOM.scrollIntoViewIfNeeded', { nodeId });
            const { model } = await page('DOM.getBoxModel', { nodeId });
            const x = (model.content[0] + model.content[2]) / 2;
            const y = (model.content[1] + model.content[5]) / 2;

            await page('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1 });
            await page('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y });

            if (forcedPseudoClasses.includes('active')) {
                await page('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 });
            }
        } else {
            await page('CSS.forcePseudoState', { nodeId, forcedPseudoClasses });
        }
    };

    return { forcePseudo, page, close: () => send('Browser.close') };
};

const server = createServer((request, response) => {
    if ((request.url === '/pseudo' || request.url === '/media') && request.method === 'POST') {
        let body = '';

        request.on('data', (chunk) => (body += chunk));
        request.on('end', async () => {
            try {
                const { selector, classes, pointer, scheme } = JSON.parse(body);
                const { forcePseudo, page } = await (debuggerConnection ||= connectDebugger());

                if (request.url === '/media') {
                    if (!['light', 'dark', 'no-preference'].includes(scheme)) {
                        throw new Error('Invalid test color scheme.');
                    }

                    await page('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: scheme }] });
                } else {
                    await forcePseudo(selector, classes, pointer);
                }

                response.end('ok');
            } catch (error) {
                response.statusCode = 500;
                response.end(error.message);
            }
        });
    } else if (request.url === '/theme.css') {
        readFile(path.resolve(import.meta.dirname, '..', `public/themes/aura-${process.env.MANTLE_TEST_STATIC_THEME || 'light'}-emerald/theme.css`))
            .then((css) => {
                response.setHeader('Content-Type', 'text/css');
                response.end(css);
            })
            .catch((error) => {
                response.statusCode = 500;
                response.end(error.message);
            });
    } else if (request.url === '/fixture.js') {
        response.setHeader('Content-Type', 'text/javascript');
        response.end(output[0].code);
    } else {
        response.setHeader('Content-Type', 'text/html');
        response.end(
            `<!doctype html><html data-test-group="${process.env.MANTLE_TEST_GROUP || ''}"${process.env.MANTLE_TEST_GLOBAL_THEME ? ' data-global-theme="true"' : ''}${process.env.MANTLE_TEST_STATIC_THEME ? ' data-static-theme="true"' : ''}><head><meta charset="utf-8">${process.env.MANTLE_TEST_STATIC_THEME ? '<link rel="stylesheet" href="/theme.css">' : ''}<style>* { transition: none !important; animation: none !important; }</style></head><body><div id="app"></div><pre id="portal-theme-test-results">pending</pre><script src="/fixture.js"></script></body></html>`
        );
    }
});

let browserProcess;
let browserExited;
let stderr = '';

try {
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));

    const port = server.address().port;

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
            `http://127.0.0.1:${port}`
        ],
        { windowsHide: true }
    );
    browserExited = new Promise((resolve) => browserProcess.on('close', resolve));
    browserProcess.on('error', (error) => {
        stderr += error.message;
        debuggerReady(undefined);
    });
    browserProcess.stderr.on('data', (chunk) => {
        stderr += chunk;
        const address = stderr.match(/DevTools listening on (ws:\/\/[^\s]+)/)?.[1];

        if (address) {
            debuggerReady(address);
        }
    });
    const { page, close } = await (debuggerConnection ||= connectDebugger());
    const deadline = Date.now() + 35000;
    let report;

    while (Date.now() < deadline) {
        const { result } = await page('Runtime.evaluate', { expression: 'document.getElementById("portal-theme-test-results")?.textContent', returnByValue: true });

        if (result.value && result.value !== 'pending') {
            report = JSON.parse(result.value);

            if (report.passed || report.error) {
                break;
            }
        }

        await new Promise((resolve) => setTimeout(resolve, 100));
    }

    if (!report?.passed && !report?.error) {
        report = { ...report, passed: false, error: `Fixture did not finish within 35 seconds; last phase: ${report?.phase || 'pending'}` };
    }

    if (process.env.MANTLE_TEST_REPORT) {
        await writeFile(process.env.MANTLE_TEST_REPORT, JSON.stringify(report, null, 2));
        await writeFile(`${process.env.MANTLE_TEST_REPORT}.console.json`, JSON.stringify(browserLogs, null, 2));
        await writeFile(`${process.env.MANTLE_TEST_REPORT}.stderr.txt`, stderr);

        if (!report.passed) {
            const { data } = await page('Page.captureScreenshot', { format: 'png' });

            await writeFile(`${process.env.MANTLE_TEST_REPORT}.png`, Buffer.from(data, 'base64'));
        }
    }

    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);

    if (!report.passed) {
        process.exitCode = 1;
    }

    await close();
    await browserExited;
} finally {
    if (browserProcess && browserProcess.exitCode === null) {
        browserProcess.kill();
        await browserExited;
    }

    debuggerSocket?.close();
    await new Promise((resolve) => server.close(resolve));

    // This exact directory was created under the OS temporary directory above.
    if (path.dirname(profile) === path.resolve(tmpdir()) && path.basename(profile).startsWith('mantle-portal-theme-')) {
        await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
    }
}
