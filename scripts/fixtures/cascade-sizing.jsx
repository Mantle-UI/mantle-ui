import * as React from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { MantleProvider } from '../../components/lib/api/Api';
import { CascadeSelect } from '../../components/lib/cascadeselect/CascadeSelect';
import { Aura } from '../../components/lib/themes/themes';

const root = createRoot(document.getElementById('app'));
const staticTheme = document.documentElement.dataset.staticTheme === 'true';
const assertions = [];
const options = [{ name: 'Country', states: [{ name: 'State', cities: [{ label: 'City' }] }] }];
const sizes = staticTheme
    ? [{ name: 'default', padding: '0.75rem', pixels: 12 }]
    : [
          { name: 'small', padding: '0.5rem', pixels: 8 },
          { name: 'default', padding: '0.75rem', pixels: 12 },
          { name: 'large', padding: '1rem', pixels: 16 },
          { name: 'custom', padding: '0.625rem', pixels: 10 }
      ];

const noop = () => {};

const wait = () => new Promise((resolve) => setTimeout(resolve, 180));

const assert = (name, actual, expected) => {
    assertions.push({ name, actual, expected, passed: actual === expected });
    document.getElementById('portal-theme-test-results').textContent = JSON.stringify({ passed: false, phase: name, assertions });
    if (actual !== expected) throw new Error(`${name}: expected ${expected}, got ${actual}`);
};

const run = async () => {
    const theme = staticTheme ? undefined : { preset: Aura, options: { prefix: 'sizing-probe', darkModeSelector: '.app-dark' } };

    for (const mode of staticTheme ? ['static'] : ['light', 'dark']) {
        document.getElementById('app').classList.toggle('app-dark', mode === 'dark');

        for (const size of sizes) {
            flushSync(() =>
                root.render(
                    <React.StrictMode>
                        <MantleProvider value={{ theme }}>
                            <style>{'*{box-sizing:border-box} #sizing-cascade{width:280px} #app{padding:20px}'}</style>
                            <CascadeSelect
                                id="sizing-cascade"
                                value={null}
                                options={options}
                                optionLabel="label"
                                optionGroupLabel="name"
                                optionGroupChildren={['states', 'cities']}
                                dt={staticTheme ? undefined : { label: { paddingY: size.padding } }}
                                onChange={noop}
                            />
                        </MantleProvider>
                    </React.StrictMode>
                )
            );
            await wait();
            const control = document.getElementById('sizing-cascade');
            const controlHeight = control.getBoundingClientRect().height;

            assert(`${mode}/${size.name}: label consumes size token`, getComputedStyle(control.querySelector('.p-cascadeselect-label')).paddingTop, `${size.pixels}px`);
            control.click();
            await wait();
            const panel = document.querySelector('div.p-cascadeselect-panel');

            assert(`${mode}/${size.name}: menu is body-portaled`, panel.parentElement === document.body, true);
            let list = panel.querySelector('ul');

            for (const level of ['country', 'state', 'city']) {
                const content = list.querySelector(':scope > li > .p-cascadeselect-item-content');

                assert(`${mode}/${size.name}/${level}: row consumes label padding token`, getComputedStyle(content).paddingTop, `${size.pixels}px`);
                assert(`${mode}/${size.name}/${level}: row height matches field within its border`, Math.abs(content.getBoundingClientRect().height - controlHeight) <= 3, true);
                content.click();
                await wait();
                if (level !== 'city') list = list.querySelector('.p-cascadeselect-sublist');
            }

            assert(`${mode}/${size.name}: leaf selection closes popup`, document.querySelector('div.p-cascadeselect-panel'), null);
        }
    }

    flushSync(() => root.unmount());
    assert('StrictMode cleanup removes owned sheets', document.querySelectorAll('style[data-mantle-theme]').length, 0);
};

run()
    .then(() => {
        document.getElementById('portal-theme-test-results').textContent = JSON.stringify({ passed: true, assertions });
    })
    .catch((error) => {
        document.getElementById('portal-theme-test-results').textContent = JSON.stringify({ passed: false, error: error.message, assertions });
    });
