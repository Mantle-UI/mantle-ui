// Real Next.js dev documentation audit. Start with npm run dev:docs.
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const origin = process.env.MANTLE_DOCS_URL || 'http://localhost:3000';
const destination = process.env.MANTLE_DOCS_REPORT || path.join(tmpdir(), 'mantle-docs-audit.json');
const browser = [process.env.MANTLE_TEST_BROWSER, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find((file) => file && existsSync(file));

if (!browser) {
    throw new Error('Set MANTLE_TEST_BROWSER to an installed Chromium executable to audit the running documentation app.');
}

const profile = await mkdtemp(path.join(tmpdir(), 'mantle-docs-audit-'));
const logs = [];
const assertions = [];
let socket;
let browserProcess;
let stderr = '';
let exited;
let pageApi;
const wait = (time) => new Promise((resolve) => setTimeout(resolve, time));

try {
    let debuggerReady;
    const debuggerUrl = new Promise((resolve) => (debuggerReady = resolve));

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
            `${origin}/autocomplete/`
        ],
        { windowsHide: true }
    );
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
    const send = (method, params = {}, sessionId) =>
        new Promise((resolve, reject) => {
            const id = ++command;
            const timer = setTimeout(() => {
                pending.delete(id);
                reject(new Error(`Docs command timed out: ${method}`));
            }, 15000);

            pending.set(id, { resolve, reject, timer });
            socket.send(JSON.stringify({ id, method, params, sessionId }));
        });
    const { targetInfos } = await send('Target.getTargets');
    const target = targetInfos.find((item) => item.type === 'page' && item.url.startsWith(origin));
    const { sessionId } = await send('Target.attachToTarget', { targetId: target.targetId, flatten: true });
    const page = (method, params = {}) => send(method, params, sessionId);

    pageApi = page;

    const evaluate = async (expression) => {
        const result = await page('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });

        if (result.exceptionDetails) throw new Error(result.exceptionDetails.text + ': ' + result.exceptionDetails.exception?.description);

        return result.result.value;
    };

    const assert = (name, actual, expected) => {
        assertions.push({ name, actual, expected, passed: actual === expected });

        if (actual !== expected) throw new Error(`${name}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
    };

    const helper = `window.__docs = {
        section(id) { return document.getElementById(id).closest('section'); },
        style(e) { const s=getComputedStyle(e), r=e.getBoundingClientRect(); return {color:s.color,background:s.backgroundColor,border:s.borderColor,borderWidth:s.borderWidth,radius:s.borderRadius,shadow:s.boxShadow,outline:s.outlineStyle,opacity:s.opacity,gap:s.gap,display:s.display,disabled:e.disabled===true,text:e.textContent,rect:{x:r.x,y:r.y,width:r.width,height:r.height}}; }
    }`;
    const read = (expression) => evaluate(`__docs.style(${expression})`);

    const until = async (expression) => {
        for (let attempt = 0; attempt < 60; attempt++) {
            if (await evaluate(expression)) return;
            await wait(100);
        }

        throw new Error(`Docs condition did not become true: ${expression}`);
    };

    const changeMode = async (mode) => {
        if (await evaluate(`document.querySelector('.layout-wrapper')?.dataset.pTheme!=='aura-${mode}-emerald'`)) {
            await evaluate("document.querySelector('.layout-topbar .pi-sun, .layout-topbar .pi-moon').closest('button').click()");
        }

        await until(`document.querySelector('.layout-wrapper')?.dataset.pTheme==='aura-${mode}-emerald' && !!document.querySelector('#theme-link').sheet`);
    };

    const key = async (name, windowsVirtualKeyCode) => {
        await page('Input.dispatchKeyEvent', { type: 'keyDown', key: name, code: name, windowsVirtualKeyCode });
        await page('Input.dispatchKeyEvent', { type: 'keyUp', key: name, code: name, windowsVirtualKeyCode });
    };

    const closeCalendar = async () => {
        await key('Escape', 27);
        await until("!document.querySelector('.p-datepicker:not(.p-datepicker-inline)')");
    };

    const move = async (expression, active = false) => {
        const point = await evaluate(
            `(() => {const e=${expression}; if(!e.closest('.p-datepicker:not(.p-datepicker-inline),.p-autocomplete-panel')) e.scrollIntoView({block:'center'}); const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2};})()`
        );

        await page('Input.dispatchMouseEvent', { type: 'mouseMoved', ...point });
        if (active) await page('Input.dispatchMouseEvent', { type: 'mousePressed', button: 'left', clickCount: 1, ...point });
        await wait(100);

        return point;
    };

    const release = (point) => page('Input.dispatchMouseEvent', { type: 'mouseReleased', button: 'left', clickCount: 1, ...point });

    const capture = async (name) => {
        await until("!document.querySelector('.p-connected-overlay-enter,.p-connected-overlay-enter-active')");
        await wait(250);
        const shot = await page('Page.captureScreenshot', { format: 'png' });

        await writeFile(`${destination}.${name}.png`, Buffer.from(shot.data, 'base64'));
    };

    const pseudo = async (selector, classes) => {
        const { root } = await page('DOM.getDocument');
        const { nodeId } = await page('DOM.querySelector', { nodeId: root.nodeId, selector });

        if (!nodeId) throw new Error(`Docs pseudo-state target missing: ${selector}`);
        await page('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: classes });
        await wait(250);
    };

    const contrast = (foreground, background) => {
        const luminance = (color) =>
            color
                .match(/[\d.]+/g)
                .slice(0, 3)
                .map(Number)
                .map((n) => {
                    const v = n / 255;

                    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
                })
                .reduce((total, value, index) => total + value * [0.2126, 0.7152, 0.0722][index], 0);
        const first = luminance(foreground),
            second = luminance(background);

        return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
    };

    await page('Runtime.enable');
    await page('Network.enable');
    await page('Page.enable');
    await page('DOM.enable');
    await page('CSS.enable');
    await page('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
    await page('Page.reload', { ignoreCache: true });
    for (let attempt = 0; attempt < 160 && !(await evaluate("!!document.querySelector('style[data-primereact-style-id=base]')")); attempt++) await wait(250);
    const initial = await evaluate(
        `({url:location.href,title:document.title,theme:document.querySelector('.layout-wrapper')?.dataset.pTheme,themeLink:document.querySelector('#theme-link')?.href,loaded:!!document.querySelector('#theme-link')?.sheet,styles:[...document.styleSheets].map(s=>s.href),buttons:[...document.querySelectorAll('.layout-topbar button')].map(b=>({label:b.getAttribute('aria-label'),text:b.textContent,html:b.outerHTML})),sections:[...document.querySelectorAll('[id]')].map(e=>e.id).filter(id=>['dropdown','icon','button','time','basic','inline'].includes(id))})`
    );

    await writeFile(destination, JSON.stringify({ phase: 'initial', initial }, null, 2));
    await evaluate("document.querySelector('.layout-topbar .pi-palette').closest('button').click()");
    for (let attempt = 0; attempt < 40 && !(await evaluate("!!document.querySelector('.layout-config')")); attempt++) await wait(100);
    const config = await evaluate("document.querySelector('.layout-config')?.outerHTML");

    await writeFile(destination, JSON.stringify({ phase: 'config', initial, config }, null, 2));
    const shot = await page('Page.captureScreenshot', { format: 'png' });

    await writeFile(`${destination}.png`, Buffer.from(shot.data, 'base64'));
    await evaluate(`(() => { const label=[...document.querySelectorAll('.layout-config span')].find(e=>e.textContent==='Aura'); label.parentElement.nextElementSibling.querySelector('button').click(); })()`);
    for (let attempt = 0; attempt < 80 && !(await evaluate("document.querySelector('.layout-wrapper')?.dataset.pTheme === 'aura-dark-emerald'")); attempt++) await wait(100);
    await evaluate("document.querySelector('.layout-config .p-sidebar-close').click()");
    await wait(400);
    await evaluate(helper);
    const sections = await evaluate(
        `({ theme:document.querySelector('.layout-wrapper')?.dataset.pTheme, link:document.querySelector('#theme-link').href, section:document.getElementById('dropdown').parentElement.parentElement.outerHTML.slice(0,600), roots:[...document.querySelectorAll('.p-autocomplete-dd')].map(e=>__docs.style(e)) })`
    );

    const autocomplete = [];
    const auto = "__docs.section('dropdown').querySelector('.p-autocomplete-dd')";

    for (const mode of ['dark', 'light']) {
        await changeMode(mode);
        await evaluate(`${auto}.scrollIntoView({block:'center'}); ${auto}.querySelector('input').focus()`);
        await wait(250);
        const field = await evaluate(
            `(() => {const e=${auto}, b=e.querySelector('button'); return {root:__docs.style(e), input:__docs.style(e.querySelector('input')),button:__docs.style(b),icon:__docs.style(b.querySelector('svg')),label:__docs.style(b.querySelector('.p-button-label'))};})()`
        );

        assert(`${mode}/autocomplete: icon horizontal center`, Math.abs(field.icon.rect.x + field.icon.rect.width / 2 - field.button.rect.x - field.button.rect.width / 2) < 0.6, true);
        assert(`${mode}/autocomplete: icon vertical center`, Math.abs(field.icon.rect.y + field.icon.rect.height / 2 - field.button.rect.y - field.button.rect.height / 2) < 0.6, true);
        assert(`${mode}/autocomplete: one outer field border`, field.root.borderWidth, '1px');
        assert(`${mode}/autocomplete: focused outer field ring`, field.root.shadow !== 'none', true);
        assert(`${mode}/autocomplete: no nested input ring`, field.input.shadow, 'none');
        assert(`${mode}/autocomplete: no nested input border`, field.input.borderWidth, '0px');
        assert(`${mode}/autocomplete: equal joined heights`, field.input.rect.height, field.button.rect.height);
        await capture(`${mode}-autocomplete-focus`);
        await key('Tab', 9);
        assert(`${mode}/autocomplete: keyboard reaches trigger`, await evaluate(`document.activeElement===${auto}.querySelector('button')`), true);
        assert(`${mode}/autocomplete: button focus keeps whole field ring`, (await read(auto)).shadow !== 'none', true);
        await evaluate(`${auto}.querySelector('button').click()`);
        await until("document.querySelectorAll('.p-autocomplete-panel .p-autocomplete-item').length===10");
        assert(`${mode}/autocomplete: actual popup is body-portaled`, await evaluate("document.querySelector('.p-autocomplete-panel').parentElement===document.body"), true);
        await capture(`${mode}-autocomplete-dropdown`);
        await evaluate("document.querySelector('.p-autocomplete-panel .p-autocomplete-item').click()");
        await until("!document.querySelector('.p-autocomplete-panel')");
        assert(`${mode}/autocomplete: suggestion selection sets value`, await evaluate(`${auto}.querySelector('input').value`), '0');
        autocomplete.push({ mode, ...field });
    }

    await changeMode('dark');
    await page('Page.navigate', { url: `${origin}/calendar/` });
    for (let attempt = 0; attempt < 120 && !(await evaluate("!!document.getElementById('icon') && !!document.querySelector('style[data-primereact-style-id=calendar]')")); attempt++) await wait(250);
    const calendarSections = await evaluate(`['icon','button','time','minmax','range'].map(id=>({id,html:document.getElementById(id)?.parentElement.parentElement.outerHTML.slice(0,500)}))`);
    const states = [];

    for (const mode of ['dark', 'light']) {
        await changeMode(mode);

        await evaluate(helper);
        assert(`${mode}: real docs Aura stylesheet is active`, await evaluate(`document.querySelector('#theme-link').href.includes('aura-${mode}-emerald') && !!document.querySelector('#theme-link').sheet`), true);
        await evaluate("__docs.section('icon').scrollIntoView({block:'center'})");
        const triggers = await evaluate(
            "[...__docs.section('icon').querySelectorAll('.p-datepicker-trigger')].map(e=>({button:__docs.style(e),icon:__docs.style(e.querySelector('svg,.pi,.p-button-icon')),input:__docs.style(e.parentElement.querySelector('input'))}))"
        );

        triggers.forEach(({ button, icon, input }, index) => {
            assert(`${mode}/calendar trigger ${index}: icon horizontal center`, Math.abs(icon.rect.x + icon.rect.width / 2 - button.rect.x - button.rect.width / 2) < 0.6, true);
            assert(`${mode}/calendar trigger ${index}: icon vertical center`, Math.abs(icon.rect.y + icon.rect.height / 2 - button.rect.y - button.rect.height / 2) < 0.6, true);
            assert(`${mode}/calendar trigger ${index}: joined heights`, Math.abs(button.rect.height - input.rect.height) < 0.6, true);
            assert(`${mode}/calendar trigger ${index}: input has square joined corners`, input.radius, '5px 0px 0px 5px');
            assert(`${mode}/calendar trigger ${index}: button has square joined corners`, button.radius, '0px 5px 5px 0px');
        });
        await evaluate("__docs.section('icon').querySelector('input').focus()");
        await wait(250);
        const joinedCalendar = "__docs.section('icon').querySelector('.p-calendar')";

        assert(`${mode}/calendar focus: outer border exists`, (await read(joinedCalendar)).borderWidth, '1px');
        assert(`${mode}/calendar focus: outer ring surrounds trigger`, (await read(joinedCalendar)).shadow !== 'none', true);
        assert(`${mode}/calendar focus: input has no inner ring`, (await read(`${joinedCalendar}.querySelector('input')`)).shadow, 'none');
        assert(`${mode}/calendar focus: input has no inner border`, (await read(`${joinedCalendar}.querySelector('input')`)).borderWidth, '0px');
        await evaluate(`${joinedCalendar}.querySelector('button').focus()`);
        assert(`${mode}/calendar focus: trigger focus keeps outer ring`, (await read(joinedCalendar)).shadow !== 'none', true);
        await capture(`${mode}-calendar-trigger`);
        await closeCalendar();
        await evaluate("__docs.section('inline').scrollIntoView({block:'center'})");
        const panel = "__docs.section('inline').querySelector('.p-datepicker')";
        const day = `${panel}.querySelector('td:not(.p-datepicker-other-month):not(.p-datepicker-today) > span:not(.p-disabled):not(.p-highlight)')`;

        await move(day);
        const hover = await read(day);

        assert(`${mode}/calendar: hover date contrast`, contrast(hover.color, hover.background) >= 4.5, true);
        const today = await read(`${panel}.querySelector('.p-datepicker-today > span')`);

        assert(`${mode}/calendar: today date contrast`, contrast(today.color, today.background) >= 4.5, true);
        await evaluate(`${day}.click()`);
        const selected = `${panel}.querySelector('span.p-highlight')`;

        await move(selected);
        const selectedStyle = await read(selected);

        assert(`${mode}/calendar: selected plus hover contrast`, contrast(selectedStyle.color, selectedStyle.background) >= 4.5, true);
        await evaluate(`${selected}.focus()`);
        assert(`${mode}/calendar: focused selected date stays readable`, contrast((await read(selected)).color, (await read(selected)).background) >= 4.5, true);
        assert(`${mode}/calendar: selected date shows focus outline`, (await read(selected)).outline, 'solid');
        await capture(`${mode}-calendar-states`);
        await closeCalendar();
        await evaluate("__docs.section('button').querySelector('input').scrollIntoView({block:'center'}); __docs.section('button').querySelector('input').click()");
        await until("!!document.querySelector('.p-datepicker:not(.p-datepicker-inline) .p-datepicker-buttonbar')");
        const popup = "document.querySelector('.p-datepicker:not(.p-datepicker-inline)')";
        const buttons = await evaluate(`[...${popup}.querySelectorAll('.p-datepicker-buttonbar button')].map(e=>__docs.style(e))`);
        const panelColor = (await read(popup)).background;

        assert(`${mode}/button bar: both actions exist`, buttons.length, 2);
        buttons.forEach((button, index) => {
            assert(`${mode}/button bar ${index}: actually enabled`, button.disabled, false);
            assert(`${mode}/button bar ${index}: full opacity`, button.opacity, '1');
            assert(`${mode}/button bar ${index}: readable text`, contrast(button.color, panelColor) >= 4.5, true);
        });
        await capture(`${mode}-calendar-buttonbar`);
        const todayButton = `${popup}.querySelector('.p-datepicker-buttonbar button')`;

        await move(todayButton);
        const barHover = await read(todayButton);

        assert(`${mode}/button bar: hover text contrast`, contrast(barHover.color, barHover.background) >= 4.5, true);
        const barPoint = await move(todayButton, true);
        const barActive = await read(todayButton);

        assert(`${mode}/button bar: active text contrast`, contrast(barActive.color, barActive.background) >= 4.5, true);
        await release(barPoint);
        await until("!document.querySelector('.p-datepicker:not(.p-datepicker-inline)')");
        assert(`${mode}/calendar: pointer Today action sets value`, await evaluate("__docs.section('button').querySelector('input').value!==''"), true);
        await evaluate("__docs.section('button').querySelector('input').click()");
        await until("!!document.querySelector('.p-datepicker:not(.p-datepicker-inline) .p-datepicker-buttonbar')");
        const beforeMonth = await evaluate(`${popup}.querySelector('.p-datepicker-title').textContent`);

        const nextButton = `${popup}.querySelector('.p-datepicker-next')`;

        await move(nextButton);
        const navHover = await read(nextButton);

        assert(`${mode}/calendar navigation: hover icon contrast`, contrast(navHover.color, navHover.background) >= 3, true);
        const navPoint = await move(nextButton, true);
        const navActive = await read(nextButton);

        assert(`${mode}/calendar navigation: active icon contrast`, contrast(navActive.color, navActive.background) >= 3, true);
        await release(navPoint);
        await wait(100);
        assert(`${mode}/calendar: next-month action works`, (await evaluate(`${popup}.querySelector('.p-datepicker-title').textContent`)) !== beforeMonth, true);
        await key('Tab', 9);
        await evaluate(`${nextButton}.focus()`);
        assert(`${mode}/calendar navigation: keyboard focus is visible`, (await read(nextButton)).outline, 'solid');
        await evaluate(`${popup}.querySelector('.p-datepicker-buttonbar button').click()`);
        await until("!document.querySelector('.p-datepicker:not(.p-datepicker-inline)')");
        assert(`${mode}/calendar: Today action sets value`, await evaluate("__docs.section('button').querySelector('input').value!==''"), true);
        await evaluate("__docs.section('button').querySelector('input').click()");
        await until("!!document.querySelector('.p-datepicker:not(.p-datepicker-inline) .p-datepicker-buttonbar')");
        await evaluate(`${popup}.querySelector('.p-datepicker-buttonbar button:last-child').click()`);
        await wait(100);
        assert(`${mode}/calendar: Clear action clears value`, await evaluate("__docs.section('button').querySelector('input').value"), '');
        await closeCalendar();
        await evaluate("__docs.section('time').querySelector('input').scrollIntoView({block:'center'}); __docs.section('time').querySelector('input').click()");
        await until("!!document.querySelector('.p-datepicker:not(.p-datepicker-inline) .p-hour-picker')");
        const timeButton = `${popup}.querySelector('.p-hour-picker button')`;

        await key('Tab', 9);
        await evaluate(`${timeButton}.focus()`);
        assert(`${mode}/time control: keyboard focus is visible`, (await read(timeButton)).outline, 'solid');
        await move(timeButton);
        const timeHover = await read(timeButton);

        assert(`${mode}/time control: hover icon contrast`, contrast(timeHover.color, timeHover.background) >= 3, true);
        const beforeHour = await evaluate(`${popup}.querySelector('.p-hour-picker > span').textContent`);
        const point = await move(timeButton, true);
        const activeTime = await read(timeButton);

        assert(`${mode}/time control: active icon contrast`, contrast(activeTime.color, activeTime.background) >= 3, true);
        await release(point);
        await wait(100);
        assert(`${mode}/time control: increment changes hour`, (await evaluate(`${popup}.querySelector('.p-hour-picker > span').textContent`)) !== beforeHour, true);
        await release(await move(`${popup}.querySelector('.p-hour-picker button:last-child')`, true));
        await wait(100);
        assert(`${mode}/time control: decrement restores hour`, await evaluate(`${popup}.querySelector('.p-hour-picker > span').textContent`), beforeHour);
        await capture(`${mode}-calendar-time`);
        await closeCalendar();
        await evaluate("__docs.section('minmax').querySelector('input').scrollIntoView({block:'center'}); __docs.section('minmax').querySelector('input').click()");
        await until("!!document.querySelector('.p-datepicker:not(.p-datepicker-inline)')");
        await evaluate(`${popup}.querySelector('.p-datepicker-prev').click()`);
        await wait(100);
        const disabledDay = `${popup}.querySelector('td:not(.p-datepicker-other-month) > span.p-disabled')`;
        const disabledStyle = await read(disabledDay);

        assert(`${mode}/calendar min/max: disabled date is dimmed`, disabledStyle.opacity, '0.6');
        await move(disabledDay);
        assert(`${mode}/calendar min/max: disabled date has no hover fill`, (await read(disabledDay)).background, disabledStyle.background);
        const minmaxValue = await evaluate("__docs.section('minmax').querySelector('input').value");

        await evaluate(`${disabledDay}.click()`);
        assert(`${mode}/calendar min/max: disabled date cannot select`, await evaluate("__docs.section('minmax').querySelector('input').value"), minmaxValue);
        await capture(`${mode}-calendar-disabled`);
        await closeCalendar();
        await evaluate("__docs.section('range').querySelector('input').scrollIntoView({block:'center'}); __docs.section('range').querySelector('input').click()");
        await until("!!document.querySelector('.p-datepicker:not(.p-datepicker-inline)')");
        await evaluate(`(() => { const days=[...${popup}.querySelectorAll('td:not(.p-datepicker-other-month) > span:not(.p-disabled)')]; days[2].click(); })()`);
        await wait(100);
        await evaluate(`(() => { const days=[...${popup}.querySelectorAll('td:not(.p-datepicker-other-month) > span:not(.p-disabled)')]; days[5].click(); })()`);
        await until("!document.querySelector('.p-datepicker:not(.p-datepicker-inline)')");
        assert(`${mode}/calendar range: both endpoints are in input`, await evaluate("__docs.section('range').querySelector('input').value.includes(' - ')"), true);
        await evaluate("__docs.section('range').querySelector('input').click()");
        await until("document.querySelectorAll('.p-datepicker:not(.p-datepicker-inline) span.p-highlight').length===4");
        const range = await evaluate(`[...${popup}.querySelectorAll('td > span.p-highlight')].map(e=>__docs.style(e))`);

        range.forEach((date, index) => assert(`${mode}/calendar range ${index}: selected text contrast`, contrast(date.color, date.background) >= 4.5, true));
        await capture(`${mode}-calendar-range`);
        await closeCalendar();
        states.push({ mode, triggers, hover, today, selected: selectedStyle, buttonbar: buttons, barHover, barActive, navHover, navActive, timeHover, activeTime, disabledStyle, range });
    }

    await page('Page.navigate', { url: `${origin}/cascadeselect/` });
    await until("!!document.getElementById('basic') && !!document.querySelector('style[data-primereact-style-id=cascadeselect]')");
    await evaluate(helper);
    const cascade = [];

    for (const mode of ['dark', 'light']) {
        await page('Page.reload', { ignoreCache: true });
        await until("!!document.getElementById('basic') && !!document.querySelector('style[data-primereact-style-id=cascadeselect]')");
        await evaluate(helper);
        await changeMode(mode);
        await evaluate("__docs.section('basic').querySelector('.p-cascadeselect').scrollIntoView({block:'center'}); __docs.section('basic').querySelector('.p-cascadeselect').click()");
        await until("!!document.querySelector('div.p-cascadeselect-panel')");
        await until("!document.querySelector('.p-connected-overlay-enter,.p-connected-overlay-enter-active')");
        await wait(250);
        const cascadePanel = "document.querySelector('div.p-cascadeselect-panel')";
        const expectedBackground = mode === 'dark' ? 'rgb(24, 24, 27)' : 'rgb(255, 255, 255)';
        const cascadeHeight = (await read("__docs.section('basic').querySelector('.p-cascadeselect')")).rect.height;

        assert(`${mode}/cascade: panel uses Aura overlay surface`, (await read(cascadePanel)).background, expectedBackground);
        assert(`${mode}/cascade: actual popup is body-portaled`, await evaluate(`${cascadePanel}.parentElement===document.body`), true);
        assert(`${mode}/cascade: root list clears legacy surface`, (await read(`${cascadePanel}.querySelector('ul')`)).background, 'rgba(0, 0, 0, 0)');
        assert(`${mode}/cascade: root row height follows field`, Math.abs((await read(`${cascadePanel}.querySelector('.p-cascadeselect-item-content')`)).rect.height - cascadeHeight) <= 3, true);
        await evaluate(`${cascadePanel}.querySelector('.p-cascadeselect-item-content').click()`);
        await until("!!document.querySelector('.p-cascadeselect-item-active > .p-cascadeselect-sublist-wrapper')");
        const firstSubmenu = `${cascadePanel}.querySelector('.p-cascadeselect-item-active > .p-cascadeselect-sublist-wrapper > ul')`;

        assert(`${mode}/cascade: nested menu uses same Aura surface`, (await read(firstSubmenu)).background, expectedBackground);
        assert(`${mode}/cascade: nested row height follows field`, Math.abs((await read(`${firstSubmenu}.querySelector('.p-cascadeselect-item-content')`)).rect.height - cascadeHeight) <= 3, true);
        assert(`${mode}/cascade: selected item clears legacy fill`, (await read(`${cascadePanel}.querySelector('li.p-highlight')`)).background, 'rgba(0, 0, 0, 0)');
        const selectedPaint = await read(`${cascadePanel}.querySelector('li.p-highlight > .p-cascadeselect-item-content')`);

        assert(
            `${mode}/cascade: selected item consumes Aura selection token`,
            await evaluate(
                `(() => { const e=${cascadePanel}.querySelector('li.p-highlight > .p-cascadeselect-item-content'), probe=document.createElement('span'); probe.style.backgroundColor='var(--mantle-cascadeselect-option-selected-background)'; e.appendChild(probe); const expected=getComputedStyle(probe).backgroundColor; probe.remove(); return getComputedStyle(e).backgroundColor===expected && expected!=='rgba(0, 0, 0, 0)'; })()`
            ),
            true
        );
        await capture(`${mode}-cascade-submenu`);
        await evaluate(`${firstSubmenu}.querySelector('.p-cascadeselect-item-content').click()`);
        const leafMenu = `${firstSubmenu}.querySelector('.p-cascadeselect-sublist')`;

        await until(`!!${leafMenu}`);
        assert(`${mode}/cascade: third menu uses same Aura surface`, (await read(leafMenu)).background, expectedBackground);
        assert(`${mode}/cascade: leaf row height follows field`, Math.abs((await read(`${leafMenu}.querySelector('.p-cascadeselect-item-content')`)).rect.height - cascadeHeight) <= 3, true);
        await capture(`${mode}-cascade-cities`);
        await evaluate(`${leafMenu}.querySelector('.p-cascadeselect-item-content').click()`);
        await until("!document.querySelector('div.p-cascadeselect-panel')");
        assert(`${mode}/cascade: leaf selection updates label`, await evaluate("__docs.section('basic').querySelector('.p-cascadeselect-label').textContent"), 'Sydney');
        cascade.push({ mode, selectedPaint });
    }

    await page('Page.navigate', { url: `${origin}/checkbox/` });
    await until("!!document.getElementById('invalid') && !!document.querySelector('style[data-primereact-style-id=checkbox]')");
    await evaluate(helper);
    const invalidCheckbox = "__docs.section('invalid').querySelector('.p-checkbox')";
    const checkSelector = 'section:has(#invalid) .p-checkbox-input';
    const checkStates = [];

    for (const mode of ['dark', 'light']) {
        await changeMode(mode);
        await evaluate(`${invalidCheckbox}.scrollIntoView({block:'center'})`);
        if (await evaluate(`${invalidCheckbox}.querySelector('input').checked`)) await evaluate(`${invalidCheckbox}.querySelector('input').click()`);
        await evaluate(`${invalidCheckbox}.querySelector('input').blur()`);
        await pseudo(checkSelector, []);
        await page('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 350, y: 60 });
        await wait(250);
        assert(`${mode}/checkbox: unchecked invalid uses error border`, (await read(`${invalidCheckbox}.querySelector('.p-checkbox-box')`)).border, 'rgb(239, 68, 68)');
        await pseudo(checkSelector, ['hover']);
        assert(`${mode}/checkbox: unchecked invalid hover uses error border`, (await read(`${invalidCheckbox}.querySelector('.p-checkbox-box')`)).border, 'rgb(220, 38, 38)');
        await pseudo(checkSelector, ['hover', 'focus-visible']);
        assert(`${mode}/checkbox: unchecked invalid focus uses error outline`, await evaluate(`getComputedStyle(${invalidCheckbox}.querySelector('.p-checkbox-box')).outlineColor`), 'rgb(239, 68, 68)');
        await pseudo(checkSelector, []);
        await evaluate(`${invalidCheckbox}.querySelector('input').click()`);
        await wait(250);
        assert(`${mode}/checkbox: checked remains invalid`, await evaluate(`${invalidCheckbox}.classList.contains('p-invalid')`), true);
        const checked = await read(`${invalidCheckbox}.querySelector('.p-checkbox-box')`);

        assert(`${mode}/checkbox: checked invalid uses error fill`, checked.background, 'rgb(239, 68, 68)');
        assert(`${mode}/checkbox: checked invalid uses error border`, checked.border, 'rgb(239, 68, 68)');
        assert(`${mode}/checkbox: invalid checkmark consumes error contrast token`, (await read(`${invalidCheckbox}.querySelector('.p-checkbox-icon')`)).color, 'rgb(255, 255, 255)');
        await capture(`${mode}-checkbox-invalid-checked`);
        await evaluate(`${invalidCheckbox}.querySelector('input').blur()`);
        await pseudo(checkSelector, ['hover']);
        const hover = await read(`${invalidCheckbox}.querySelector('.p-checkbox-box')`);

        assert(`${mode}/checkbox: checked invalid hover fill`, hover.background, 'rgb(220, 38, 38)');
        assert(`${mode}/checkbox: checked invalid hover border`, hover.border, 'rgb(220, 38, 38)');
        await pseudo(checkSelector, ['hover', 'focus-visible']);
        const focus = await read(`${invalidCheckbox}.querySelector('.p-checkbox-box')`);

        assert(`${mode}/checkbox: invalid focus outline uses error color`, await evaluate(`getComputedStyle(${invalidCheckbox}.querySelector('.p-checkbox-box')).outlineColor`), 'rgb(239, 68, 68)');
        assert(`${mode}/checkbox: focus outline is visible`, focus.outline, 'solid');
        await capture(`${mode}-checkbox-invalid-focus`);
        await pseudo(checkSelector, []);
        checkStates.push({ mode, checked, hover, focus });
    }

    for (const control of [
        { page: 'inputtext', field: '.p-inputtext', target: '.p-inputtext' },
        { page: 'dropdown', field: '.p-dropdown', target: '.p-dropdown input' },
        { page: 'multiselect', field: '.p-multiselect', target: '.p-multiselect input' }
    ]) {
        await page('Page.navigate', { url: `${origin}/${control.page}/` });
        await until(`!!document.getElementById('invalid') && !!document.getElementById('invalid').closest('section').querySelector('${control.target}')`);
        await until("document.querySelector('.layout-wrapper')?.dataset.pTheme?.startsWith('aura-') && !!document.querySelector('#theme-link')?.sheet");
        await evaluate(helper);

        for (const mode of ['dark', 'light']) {
            await changeMode(mode);
            await evaluate(`__docs.section('invalid').querySelector('${control.target}').focus()`);
            await pseudo(`section:has(#invalid) ${control.target}`, ['focus', 'focus-visible']);
            const field = `__docs.section('invalid').querySelector('${control.field}')`;
            const focus = await read(field);
            const error = 'rgb(239, 68, 68)';

            assert(`${mode}/${control.page}: actual invalid example retains error border on focus`, focus.border, error);
            assert(
                `${mode}/${control.page}: keyboard focus remains visible and error colored`,
                await evaluate(`(() => { const s=getComputedStyle(${field}); return s.boxShadow!=='none' ? s.boxShadow.includes('${error}') : s.outlineStyle==='solid' && parseFloat(s.outlineWidth)>0 && s.outlineColor==='${error}'; })()`),
                true
            );
            await capture(`${mode}-${control.page}-invalid-focus`);
            await pseudo(`section:has(#invalid) ${control.target}`, []);
            await evaluate(`__docs.section('invalid').querySelector('${control.target}').blur()`);
        }
    }

    const keyWarnings = logs.filter((event) => event.params?.args?.some((arg) => typeof arg.value === 'string' && /Each child.*unique.*key|same key/.test(arg.value)));

    assert('Calendar docs render and navigate without missing-key warnings', keyWarnings.length, 0);
    await writeFile(destination, JSON.stringify({ passed: true, phase: 'controls', initial, sections, autocomplete, calendarSections, states, cascade, checkStates, assertions, logs }, null, 2));
    await writeFile(`${destination}.console.json`, JSON.stringify(logs, null, 2));
    process.stdout.write(
        JSON.stringify(
            { passed: true, destination, assertions: assertions.length, pages: ['/autocomplete/', '/calendar/', '/cascadeselect/', '/checkbox/', '/inputtext/', '/dropdown/', '/multiselect/'], themes: ['aura-dark-emerald', 'aura-light-emerald'] },
            null,
            2
        )
    );
    await send('Browser.close');
    await exited;
} catch (error) {
    await writeFile(destination, JSON.stringify({ passed: false, error: error.message, assertions, logs }, null, 2));

    if (pageApi) {
        const shot = await pageApi('Page.captureScreenshot', { format: 'png' }).catch(() => null);

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
    if (path.dirname(profile) === path.resolve(tmpdir()) && path.basename(profile).startsWith('mantle-docs-audit-')) await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
}
