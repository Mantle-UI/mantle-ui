/** @jest-environment node */
import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { MantleProvider } from '../api/Api';
import { Dialog } from '../dialog/Dialog';
import { Dropdown } from '../dropdown/Dropdown';
import { InputNumber } from '../inputnumber/InputNumber';
import { Aura, createPresetCss, definePreset } from './themes';

describe('server token theming', () => {
    it('renders sibling scopes without accessing a document or creating portals', () => {
        const html = renderToString(
            <>
                <MantleProvider value={{ theme: { preset: Aura } }}>
                    <InputNumber value={1} />
                    <Dialog id="server-dialog" visible onHide={() => {}} />
                </MantleProvider>
                <MantleProvider value={{ theme: { preset: definePreset(Aura, { primitive: { emerald: { 500: '#112233' } } }), options: { prefix: 'other' } } }}>
                    <Dropdown id="server-dropdown" options={['One']} />
                </MantleProvider>
            </>
        );
        const scopes = [...new Set([...html.matchAll(/data-mantle-theme-scope="([^"]+)"/g)].map((match) => match[1]))];

        expect(typeof document).toBe('undefined');
        expect(scopes).toHaveLength(2);
        expect(html).not.toContain('role="dialog"');
        expect(html).not.toContain('<style');
        expect(createPresetCss(Aura, { selector: `[data-mantle-theme-scope="${scopes[0]}"]` })).not.toContain(':root {');
    });
});
