import * as React from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { getHoverColor } from 'chart.js/helpers';
import { MantleContext, MantleProvider } from '../../components/lib/api/Api.js';
import { Chart } from '../../components/lib/chart/Chart.js';
import { Aura } from '../../components/lib/themes/Aura.js';
import { definePreset } from '../../components/lib/themes/Theme.js';

const assertions = [];
const refs = {
    first: React.createRef(),
    second: React.createRef(),
    explicit: React.createRef(),
    legacy: React.createRef(),
    pie: React.createRef(),
    radial: React.createRef(),
    custom: React.createRef(),
    system: React.createRef(),
    modern: React.createRef(),
    unstyled: React.createRef()
};
const contexts = {};
const activeObservers = new Set();
const activeMediaListeners = new Set();
const diagnostics = [];
const data = { labels: ['A', 'B'], datasets: [{ label: 'Values', data: [2, 3] }] };
const options = { animation: false, responsive: false };
const modernOptions = {
    ...options,
    plugins: { legend: { display: false } },
    scales: { x: { grid: { display: false }, ticks: { display: false }, border: { display: false } }, y: { grid: { display: false }, ticks: { display: false }, border: { display: false } } }
};
const explicitData = { labels: ['A', 'B'], datasets: [{ data: [2, 3], backgroundColor: '#aabbcc', borderColor: '#aabbcc' }] };
const explicitOptions = { ...options, color: '#123456', plugins: { legend: { labels: { color: '#987654' } } }, scales: { x: { ticks: { color: '#876543' }, grid: { color: '#765432' } } } };
const foundation = Aura;
const mixedColor = 'color-mix(in srgb, #ff0000 50%, #0000ff 50%)';
const wideColor = 'color(display-p3 1 0.2 0)';

const preset = (light, dark) => definePreset(foundation, { components: { chart: { renderer: { ...light, colorScheme: { dark } } } } });
const firstPreset = preset({ textColor: '#112233', gridColor: '#334455', primaryColor: '#445566' }, { textColor: '#aabbcc', gridColor: '#ccddee', primaryColor: '#ddeeff' });
const secondPreset = preset({ textColor: '#556677', primaryColor: '#667788' }, { textColor: '#778899', primaryColor: '#8899aa' });

const Controls = ({ name }) => {
    const context = React.useContext(MantleContext);

    React.useEffect(() => {
        contexts[name] = context;
    }, [name, context]);

    return null;
};

const Scene = ({ name, theme, chartData = data, chartOptions = options, type = 'bar', unstyled }) => (
    <MantleProvider value={{ theme }}>
        <section id={`${name}-origin`}>
            <Controls name={name} />
            <Chart id={name} ref={refs[name]} type={type} data={chartData} options={chartOptions} width="320" height="180" unstyled={unstyled} />
        </section>
    </MantleProvider>
);
const root = createRoot(document.getElementById('app'));
const pause = () => new Promise((resolve) => setTimeout(resolve, 20));

const wait = async (condition, label) => {
    for (let i = 0; i < 120 && !condition(); i++) await pause();
    if (!condition()) throw Error(`Timeout: ${label}`);
};

const assert = (name, condition, details, collectFailure = false) => {
    assertions.push({ name, passed: !!condition, details: details === undefined ? undefined : JSON.parse(JSON.stringify(details)) });
    if (!condition && !collectFailure) throw Error(`${name}: ${JSON.stringify(details)}`);
};

const emulateScheme = async (scheme) => {
    const response = await fetch('/media', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ scheme }) });
    const body = await response.text();

    if (!response.ok || body !== 'ok') throw Error(`The browser runner must support POST /media {scheme}: ${response.status} ${body}`);
};

const trackCleanup = () => {
    const OriginalObserver = window.MutationObserver;
    const originalMatchMedia = window.matchMedia.bind(window);

    window.MutationObserver = function (callback) {
        const observer = new OriginalObserver(callback);
        const observe = observer.observe.bind(observer);
        const disconnect = observer.disconnect.bind(observer);

        observer.observe = (...args) => {
            activeObservers.add(observer);
            observe(...args);
        };

        observer.disconnect = () => {
            activeObservers.delete(observer);
            disconnect();
        };

        return observer;
    };

    window.matchMedia = (query) => {
        const media = originalMatchMedia(query);
        const add = media.addEventListener.bind(media);
        const remove = media.removeEventListener.bind(media);
        const listeners = new Map();

        media.addEventListener = (event, listener, ...args) => {
            if (event === 'change') {
                const key = { media, listener };

                listeners.set(listener, key);
                activeMediaListeners.add(key);
            }

            add(event, listener, ...args);
        };

        media.removeEventListener = (event, listener, ...args) => {
            if (event === 'change') activeMediaListeners.delete(listeners.get(listener));
            remove(event, listener, ...args);
        };

        return media;
    };
};

const nativePixel = (color) => {
    const canvas = document.createElement('canvas');

    canvas.width = 1;
    canvas.height = 1;

    const context = canvas.getContext('2d', { willReadFrequently: true });

    context.fillStyle = color;
    context.fillRect(0, 0, 1, 1);

    return Array.from(context.getImageData(0, 0, 1, 1).data);
};

const pixel = (chart) => {
    const bar = chart.getDatasetMeta(0).data[0];
    const ratio = chart.currentDevicePixelRatio;

    return Array.from(chart.ctx.getImageData(Math.round(bar.x * ratio), Math.round(((bar.y + bar.base) / 2) * ratio), 1, 1).data);
};

const run = async () => {
    trackCleanup();
    await emulateScheme('light');
    flushSync(() =>
        root.render(
            <React.StrictMode>
                <Scene name="first" theme={{ preset: firstPreset, options: { darkModeSelector: '.app-dark' } }} />
                <Scene name="second" theme={{ preset: secondPreset, options: { prefix: 'brand', darkModeSelector: '.app-dark' } }} />
                <Scene name="explicit" theme={{ preset: firstPreset, options: { darkModeSelector: '.app-dark' } }} chartData={explicitData} chartOptions={explicitOptions} />
                <Scene name="pie" theme={{ preset: firstPreset }} type="pie" />
                <Scene name="radial" theme={{ preset: firstPreset }} type="radar" />
                <Scene
                    name="custom"
                    theme={{ preset: firstPreset }}
                    chartData={{ labels: ['A', 'B'], datasets: [{ data: [2, 3], xAxisID: 'horizontal', yAxisID: 'vertical' }] }}
                    chartOptions={{ ...options, scales: { horizontal: { axis: 'x' }, vertical: { axis: 'y' } } }}
                />
                <Scene name="system" theme={{ preset: firstPreset, options: { prefix: 'system', darkModeSelector: 'system' } }} />
                <Scene name="modern" theme={{ preset: definePreset(foundation, { components: { chart: { renderer: { primaryColor: mixedColor } } } }), options: { prefix: 'modern', darkModeSelector: false } }} chartOptions={modernOptions} />
                <Scene name="unstyled" theme={{ preset: firstPreset }} unstyled />
                <Chart id="legacy" ref={refs.legacy} type="bar" data={data} options={options} />
            </React.StrictMode>
        )
    );
    await wait(() => Object.values(refs).every((ref) => ref.current?.getChart()), 'initial renderers');

    const first = refs.first.current.getChart();
    const second = refs.second.current.getChart();
    const explicit = refs.explicit.current.getChart();
    const system = refs.system.current.getChart();
    const modern = refs.modern.current.getChart();

    assert('renderer text uses scoped component token', first.options.color === 'rgb(17, 34, 51)', first.options.color);
    assert('legend uses scoped component token', first.options.plugins.legend.labels.color === 'rgb(17, 34, 51)', first.options.plugins.legend.labels.color);
    assert('scale grid uses scoped component token', first.scales.x.options.grid.color === 'rgb(51, 68, 85)', first.scales.x.options.grid.color);
    assert('resolved drawn element uses scoped palette', first.getDatasetMeta(0).data[0].options.backgroundColor === 'rgb(68, 85, 102)', first.getDatasetMeta(0).data[0].options.backgroundColor);
    assert('canvas actually paints token palette', JSON.stringify(pixel(first)) === JSON.stringify([68, 85, 102, 255]), pixel(first));
    assert('sibling custom prefix palette', second.getDatasetMeta(0).data[0].options.backgroundColor === 'rgb(102, 119, 136)', second.getDatasetMeta(0).data[0].options.backgroundColor);
    assert('explicit data color preserved', explicit.data.datasets[0].backgroundColor === '#aabbcc', explicit.data.datasets[0]);
    assert('explicit option color preserved', explicit.options.color === '#123456', explicit.options.color);
    assert('explicit legend color preserved', explicit.options.plugins.legend.labels.color === '#987654', explicit.options.plugins.legend.labels.color);
    assert('explicit scale color preserved', explicit.scales.x.options.grid.color === '#765432', explicit.scales.x.options.grid.color);
    assert('caller data unmodified', !data.datasets[0].backgroundColor && explicitData.datasets[0].backgroundColor === '#aabbcc', data);
    assert('legacy renderer has no injected color', refs.legacy.current.getChart().config.options.color === undefined, refs.legacy.current.getChart().config.options.color);
    assert('unstyled renderer has no injected color', refs.unstyled.current.getChart().config.options.color === undefined, refs.unstyled.current.getChart().config.options.color);
    assert('unstyled root has no styled component class', !refs.unstyled.current.getElement().classList.contains('p-chart'), refs.unstyled.current.getElement().className);
    assert('actual canvas ref preserved', refs.first.current.getCanvas() === document.querySelector('#first canvas'), refs.first.current.getCanvas().tagName);
    assert('actual root ref preserved', refs.first.current.getElement() === document.getElementById('first'), refs.first.current.getElement().id);
    assert('base64 image ref remains usable', refs.first.current.getBase64Image().startsWith('data:image/png;base64,'), typeof refs.first.current.getBase64Image());
    assert('pie point palette', refs.pie.current.getChart().data.datasets[0].backgroundColor.length === 2, refs.pie.current.getChart().data.datasets[0].backgroundColor);
    assert('radial axes only', Object.keys(refs.radial.current.getChart().scales).join() === 'r', Object.keys(refs.radial.current.getChart().scales));
    assert('custom axes only', Object.keys(refs.custom.current.getChart().scales).sort().join() === 'horizontal,vertical', Object.keys(refs.custom.current.getChart().scales));
    assert('system scheme starts light', system.options.color === 'rgb(17, 34, 51)', system.options.color);
    await emulateScheme('dark');
    await wait(() => system.options.color === 'rgb(170, 187, 204)', 'actual system dark');
    assert('actual system dark keeps renderer instance', refs.system.current.getChart() === system, system.options.color);
    assert('actual system dark paints palette', JSON.stringify(pixel(system)) === JSON.stringify([221, 238, 255, 255]), pixel(system));
    assert('class selector sibling ignores system dark', second.options.color === 'rgb(85, 102, 119)', second.options.color);
    await emulateScheme('light');
    await wait(() => system.options.color === 'rgb(17, 34, 51)', 'actual system light');
    assert('actual system light repaints palette', JSON.stringify(pixel(system)) === JSON.stringify([68, 85, 102, 255]), pixel(system));

    document.getElementById('first-origin').classList.add('app-dark');
    document.getElementById('explicit-origin').classList.add('app-dark');
    await wait(() => first.options.color === 'rgb(170, 187, 204)', 'local dark propagation');
    assert('dark renderer updates without recreation', refs.first.current.getChart() === first, first.options.color);
    assert('dark dataset token applied', first.data.datasets[0].backgroundColor === 'rgb(221, 238, 255)', first.data.datasets[0]);
    assert('dark drawn element token applied', first.getDatasetMeta(0).data[0].options.backgroundColor === 'rgb(221, 238, 255)', first.getDatasetMeta(0).data[0].options);
    assert('dark canvas actually paints token palette', JSON.stringify(pixel(first)) === JSON.stringify([221, 238, 255, 255]), pixel(first));
    assert('sibling remains light', second.options.color === 'rgb(85, 102, 119)', second.options.color);
    assert('explicit colors survive dark changes', explicit.options.color === '#123456' && explicit.data.datasets[0].backgroundColor === '#aabbcc', explicit.data.datasets[0]);

    flushSync(() => contexts.first.setTheme({ preset: secondPreset, options: { prefix: 'runtime', darkModeSelector: '.app-dark' } }));
    await wait(() => first.options.color === 'rgb(119, 136, 153)', 'runtime prefix replacement');
    assert('runtime prefix replacement keeps instance', refs.first.current.getChart() === first, first.options.color);
    assert('runtime palette replacement paints canvas', JSON.stringify(pixel(first)) === JSON.stringify([136, 153, 170, 255]), pixel(first));
    document.getElementById('first-origin').classList.remove('app-dark');
    await wait(() => first.options.color === 'rgb(85, 102, 119)', 'return light');

    flushSync(() => contexts.first.setTheme({ preset: definePreset(foundation, { primitive: { emerald: { 500: '#00aa11' } } }), options: { prefix: 'primitive', darkModeSelector: false } }));
    await wait(() => first.data.datasets[0].backgroundColor === 'rgb(0, 170, 17)', 'primitive update');
    assert('primitive override paints canvas', JSON.stringify(pixel(first)) === JSON.stringify([0, 170, 17, 255]), pixel(first));
    flushSync(() => contexts.first.setTheme({ preset: definePreset(foundation, { semantic: { colorScheme: { light: { primary: { color: '#aa00bb' } } } } }), options: { prefix: 'semantic', darkModeSelector: false } }));
    await wait(() => first.data.datasets[0].backgroundColor === 'rgb(170, 0, 187)', 'semantic update');
    assert('semantic override paints canvas', JSON.stringify(pixel(first)) === JSON.stringify([170, 0, 187, 255]), pixel(first));
    flushSync(() => contexts.first.setTheme({ preset: definePreset(foundation, { components: { chart: { renderer: { primaryColor: '#cc7711' } } } }), options: { prefix: 'component', darkModeSelector: false } }));
    await wait(() => first.data.datasets[0].backgroundColor === 'rgb(204, 119, 17)', 'component update');
    assert('component override paints canvas', JSON.stringify(pixel(first)) === JSON.stringify([204, 119, 17, 255]), pixel(first));

    first.config.options.plugins.legend.labels.color = '#010203';
    first.data.datasets[0].backgroundColor = '#030201';
    flushSync(() => contexts.first.setTheme({ preset: firstPreset, options: { darkModeSelector: '.app-dark' } }));
    await wait(() => first.options.color === 'rgb(17, 34, 51)', 'imperative edits preservation');
    assert('imperative option survives theme refresh', first.options.plugins.legend.labels.color === '#010203', first.options.plugins.legend.labels.color);
    assert('imperative data color survives theme refresh', first.data.datasets[0].backgroundColor === '#030201', first.data.datasets[0]);

    for (const [name, cssColor] of [
        ['color-mix', mixedColor],
        ['wide-gamut', wideColor],
        ['translucent-modern', 'color(srgb 0.2 0.4 0.6 / 0.5)']
    ]) {
        modern.setActiveElements([]);
        modern.update();
        flushSync(() => contexts.modern.setTheme({ preset: definePreset(foundation, { components: { chart: { renderer: { primaryColor: cssColor } } } }), options: { prefix: name, darkModeSelector: false } }));
        await pause();

        const expectedDefault = nativePixel(cssColor);
        const expectedHover = getHoverColor(`rgba(${expectedDefault[0]}, ${expectedDefault[1]}, ${expectedDefault[2]}, ${expectedDefault[3] / 255})`);
        const hoverColor = modern.getDatasetMeta(0).controller.getStyle(0, true).backgroundColor;

        diagnostics.push({ name, cssColor, rendererColor: modern.data.datasets[0].backgroundColor, hoverColor, expectedDefault, expectedHover });
        assert(`${name}: actual default canvas color`, JSON.stringify(pixel(modern)) === JSON.stringify(expectedDefault), { actual: pixel(modern), expected: expectedDefault }, true);
        assert(`${name}: hover parser yields canvas color`, typeof hoverColor === 'string' && CSS.supports('color', hoverColor), { hoverColor, expectedHover }, true);
        modern.setActiveElements([{ datasetIndex: 0, index: 0 }]);
        modern.update();
        assert(`${name}: actual active canvas color`, JSON.stringify(pixel(modern)) === JSON.stringify(nativePixel(expectedHover)), { actual: pixel(modern), expected: nativePixel(expectedHover) }, true);
    }

    assert('temporary probes cleaned', document.querySelectorAll('.p-chart > span').length === 0, document.querySelectorAll('.p-chart > span').length);
    const instances = Object.values(refs).map((ref) => ref.current.getChart());

    root.unmount();
    assert(
        'all renderers destroyed on unmount',
        instances.every((chart) => chart.canvas === null && chart.ctx === null),
        instances.map((chart) => chart.canvas)
    );
    assert('all observers cleaned under StrictMode', activeObservers.size === 0, activeObservers.size);
    assert('all system listeners cleaned under StrictMode', activeMediaListeners.size === 0, activeMediaListeners.size);
    assert(
        'all component refs cleared',
        Object.values(refs).every((ref) => ref.current === null),
        Object.values(refs).map((ref) => ref.current)
    );
    assert('provider styles cleaned', document.querySelectorAll('style[data-mantle-theme]').length === 0, document.querySelectorAll('style[data-mantle-theme]').length);
};

run()
    .then(() => {
        const passed = assertions.every((item) => item.passed);

        document.getElementById('portal-theme-test-results').textContent = JSON.stringify({ passed, assertions, diagnostics, ...(passed ? {} : { error: 'Chart browser assertions failed' }) });
    })
    .catch((error) => {
        document.getElementById('portal-theme-test-results').textContent = JSON.stringify({ passed: false, error: error.stack, assertions, diagnostics });
    });
