// Real Next documentation regression. Start the docs app before running.
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const origin = process.env.MANTLE_DOCS_URL || 'http://localhost:3000';
const destination = process.env.MANTLE_DOCS_REPORT || path.join(tmpdir(), 'mantle-colorpicker-docs.json');
const probe = process.env.MANTLE_DOCS_PROBE === '1';
const browser = [process.env.MANTLE_TEST_BROWSER, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find((file) => file && existsSync(file));

if (!browser) throw new Error('Set MANTLE_TEST_BROWSER to an installed Chromium executable.');

const profile = await mkdtemp(path.join(tmpdir(), 'mantle-colorpicker-docs-'));
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
            `${origin}/colorpicker/`
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
                reject(new Error(`ColorPicker docs command timed out: ${method}`));
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

        throw new Error(`ColorPicker docs condition timed out: ${expression}`);
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

    const inspect = (expression) =>
        evaluate(
            `(() => { const panel=${expression}, color=panel.querySelector('.p-colorpicker-color-selector'), hue=panel.querySelector('.p-colorpicker-hue'); const rect=e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom,position:s.position,background:s.backgroundColor,zIndex:s.zIndex,inlineStyle:e.getAttribute('style'),classes:e.className}}; const p=rect(panel),c=rect(color),h=rect(hue); return {panel:p,selector:c,hue:h,childrenInside:c.x>=p.x && c.y>=p.y && c.right<=p.right && c.bottom<=p.bottom && h.right<=p.right && h.bottom<=p.bottom,hitSelector:color.contains(document.elementFromPoint(c.x+c.width/2,c.y+c.height/2)),hitHue:hue.contains(document.elementFromPoint(h.x+h.width/2,h.y+h.height/2)),bodyPortal:panel.parentElement===document.body}; })()`
        );

    await page('Runtime.enable');
    await page('Network.enable');
    await page('Page.enable');
    await page('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
    await page('Page.reload', { ignoreCache: true });
    await until("!!document.getElementById('inline') && !!document.querySelector('style[data-primereact-style-id=base]')");
    await evaluate("document.querySelector('.layout-topbar .pi-palette').closest('button').click()");
    await until("!!document.querySelector('.layout-config')");
    await evaluate("(() => { const label=[...document.querySelectorAll('.layout-config span')].find(e=>e.textContent==='Aura'); label.parentElement.nextElementSibling.querySelector('button').click(); })()");
    await until("document.querySelector('.layout-wrapper')?.dataset.pTheme==='aura-dark-emerald' && !!document.querySelector('#theme-link').sheet");
    await evaluate("document.querySelector('.layout-config .p-sidebar-close').click()");
    await wait(350);
    await evaluate("window.__section=id=>document.getElementById(id).closest('section')");
    await evaluate(`window.__pickerRGB=(h,s,b)=>{const c=b*s/10000,x=c*(1-Math.abs((h/60)%2-1)),m=b/100-c;const rgb=h<60?[c,x,0]:h<120?[x,c,0]:h<180?[0,c,x]:h<240?[0,x,c]:h<300?[x,0,c]:[c,0,x];return 'rgb('+rgb.map(v=>Math.round((v+m)*255)).join(', ')+')'};
        window.__pickerSelected=panel=>{const color=panel.querySelector('.p-colorpicker-color-handle'),hue=panel.querySelector('.p-colorpicker-hue-handle');return __pickerRGB(Math.round(360*(1-parseFloat(hue.style.top)/100)),parseFloat(color.style.left),100-parseFloat(color.style.top))};`);
    const popup = "document.querySelector('.p-colorpicker-overlay-panel')";

    for (const mode of ['dark', 'light']) {
        if (await evaluate(`document.querySelector('.layout-wrapper').dataset.pTheme!=='aura-${mode}-emerald'`)) await evaluate("document.querySelector('.layout-topbar .pi-sun,.layout-topbar .pi-moon').closest('button').click()");
        await until(`document.querySelector('.layout-wrapper').dataset.pTheme==='aura-${mode}-emerald' && !!document.querySelector('#theme-link').sheet`);
        const basic = "__section('basic').querySelector('.p-colorpicker-preview')";

        await evaluate(`${basic}.scrollIntoView({block:'center'})`);
        await click(basic);
        await until(`!!${popup} && !document.querySelector('.p-connected-overlay-enter-active')`);
        await wait(180);
        const overlay = await inspect(popup);

        measurements.push({ mode, kind: 'popup', ...overlay });
        await capture(`${mode}-popup`);
        assert(`${mode}/popup: real body portal`, overlay.bodyPortal, true);
        assert(`${mode}/popup: panel contains gradient and hue`, overlay.childrenInside, true);
        assert(`${mode}/popup: selected area receives pointer input`, overlay.hitSelector && overlay.hitHue, true);
        assert(`${mode}/popup: Aura panel surface`, overlay.panel.background, mode === 'dark' ? 'rgb(24, 24, 27)' : 'rgb(255, 255, 255)');
        await click(`${popup}.querySelector('.p-colorpicker-hue')`, 0.5, mode === 'dark' ? 2 / 3 : 1 / 3);
        const hueColor = await evaluate(`getComputedStyle(${basic}).backgroundColor`);

        assert(`${mode}/popup: hue selection updates preview swatch`, hueColor, await evaluate(`__pickerSelected(${popup})`));
        await click(`${popup}.querySelector('.p-colorpicker-color-selector')`, 0.5, mode === 'dark' ? 1 / 3 : 2 / 3);
        assert(`${mode}/popup: saturation selection updates preview`, await evaluate(`getComputedStyle(${basic}).backgroundColor!==${JSON.stringify(hueColor)}`), true);
        assert(`${mode}/popup: preview matches selected hue, saturation and brightness`, await evaluate(`getComputedStyle(${basic}).backgroundColor`), await evaluate(`__pickerSelected(${popup})`));
        await capture(`${mode}-popup-selected`);
        await click(basic);
        await until(`!${popup}`);

        const inline = "__section('inline').querySelector('.p-colorpicker-panel')";

        await evaluate(`${inline}.scrollIntoView({block:'center'})`);
        await wait(150);
        const embedded = await inspect(inline);
        const card = await evaluate(
            `(() => { const p=${inline},r=p.closest('.card').getBoundingClientRect(),c=p.getBoundingClientRect(); return {contains:r.bottom>=c.bottom && r.right>=c.right,followedByCode:p.closest('.card').nextElementSibling.getBoundingClientRect().top>=c.bottom}; })()`
        );

        measurements.push({ mode, kind: 'inline', ...embedded, card });
        await capture(`${mode}-inline`);
        assert(`${mode}/inline: stays within docs card`, card.contains, true);
        assert(`${mode}/inline: reserves layout before code example`, card.followedByCode, true);
        assert(`${mode}/inline: panel contains gradient and hue`, embedded.childrenInside, true);
        assert(`${mode}/inline: both controls remain above other content`, embedded.hitSelector && embedded.hitHue, true);
        assert(`${mode}/inline: remains at component location`, embedded.bodyPortal, false);
        assert(`${mode}/inline: no preview swatch is rendered`, await evaluate("__section('inline').querySelectorAll('.p-colorpicker-preview').length"), 0);
        await click(`${inline}.querySelector('.p-colorpicker-hue')`, 0.5, 2 / 3);
        assert(
            `${mode}/inline: hue updates gradient base`,
            await evaluate(`getComputedStyle(${inline}.querySelector('.p-colorpicker-color-selector')).backgroundColor`),
            await evaluate(`__pickerRGB(Math.round(360*(1-parseFloat(${inline}.querySelector('.p-colorpicker-hue-handle').style.top)/100)),100,100)`)
        );
        await click(`${inline}.querySelector('.p-colorpicker-color-selector')`, 0.4, 0.4);
        assert(`${mode}/inline: saturation handle follows selection`, await evaluate(`parseFloat(${inline}.querySelector('.p-colorpicker-color-handle').style.left)>0`), true);

        for (const format of ['hex', 'rgb', 'hsb']) {
            const input = `document.getElementById('cp-${format}')`;

            await evaluate(`${input}.scrollIntoView({block:'center'})`);
            await click(input);
            await until(`!!${popup}`);
            await wait(180);
            const previous = await evaluate(`${input}.closest('.p-colorpicker').nextElementSibling.textContent`);

            await click(`${popup}.querySelector('.p-colorpicker-hue')`, 0.5, 2 / 3);
            await click(`${popup}.querySelector('.p-colorpicker-color-selector')`, mode === 'dark' ? 0.5 : 0.3, mode === 'dark' ? 0.5 : 0.7);
            const selected = await evaluate(`({color:getComputedStyle(${input}).backgroundColor,value:${input}.closest('.p-colorpicker').nextElementSibling.textContent,inlineColor:${input}.style.backgroundColor})`);

            measurements.push({ mode, format, selected });
            assert(`${mode}/${format}: picking updates the controlled docs value`, selected.value !== previous, true);
            assert(`${mode}/${format}: preview matches picker selection`, selected.color, await evaluate(`__pickerSelected(${popup})`));
            assert(
                `${mode}/${format}: rendered value matches preview`,
                selected.color,
                await evaluate(
                    `(() => { const value=${JSON.stringify(selected.value)},format=${JSON.stringify(format)}; if(format==='hsb'){const v=JSON.parse(value);return __pickerRGB(v.h,v.s,v.b)} const color=format==='hex'?'#'+value:'rgb('+Object.values(JSON.parse(value)).join(',')+')',probe=document.createElement('span');probe.style.backgroundColor=color;document.body.appendChild(probe);const rgb=getComputedStyle(probe).backgroundColor;probe.remove();return rgb; })()`
                )
            );
            await click(input);
            await until(`!${popup}`);
            assert(`${mode}/${format}: preview retains selected color after close`, await evaluate(`getComputedStyle(${input}).backgroundColor`), selected.color);
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
