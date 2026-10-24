import { DocSectionCode } from '@/components/doc/common/docsectioncode';
import { DocSectionText } from '@/components/doc/common/docsectiontext';
import { ColorPicker } from '@/components/lib/colorpicker/ColorPicker';
import { useState } from 'react';

export function AlphaDoc(props) {
    const [hex, setHex] = useState('6466f180');
    const [rgb, setRgb] = useState({ r: 100, g: 102, b: 241, a: 0.5 });
    const [hsb, setHsb] = useState({ h: 239, s: 59, b: 95, a: 0.5 });

    const code = {
        basic: `
<ColorPicker alpha value={hex} onChange={(e) => setHex(e.value)} />
<ColorPicker alpha inline format="rgb" value={rgb} onChange={(e) => setRgb(e.value)} />
<ColorPicker alpha format="hsb" value={hsb} onChange={(e) => setHsb(e.value)} />
        `,
        javascript: `
import React, { useState } from 'react';
import { ColorPicker } from '@mantle-ui/react/colorpicker';

export default function AlphaDemo() {
    const [hex, setHex] = useState('6466f180');
    const [rgb, setRgb] = useState({ r: 100, g: 102, b: 241, a: 0.5 });
    const [hsb, setHsb] = useState({ h: 239, s: 59, b: 95, a: 0.5 });

    return (
        <div className="card flex flex-wrap gap-5">
            <div className="flex flex-column gap-2">
                <label htmlFor="alpha-hex-demo">HEX with alpha</label>
                <ColorPicker inputId="alpha-hex-demo" alpha value={hex} onChange={(e) => setHex(e.value)} />
                <code>{hex}</code>
            </div>
            <div className="flex flex-column gap-2">
                <span>RGB with alpha (inline)</span>
                <ColorPicker alpha inline format="rgb" value={rgb} onChange={(e) => setRgb(e.value)} />
                <code>{JSON.stringify(rgb)}</code>
            </div>
            <div className="flex flex-column gap-2">
                <label htmlFor="alpha-hsb-demo">HSB with alpha</label>
                <ColorPicker inputId="alpha-hsb-demo" alpha format="hsb" value={hsb} onChange={(e) => setHsb(e.value)} />
                <code>{JSON.stringify(hsb)}</code>
            </div>
        </div>
    );
}
        `,
        typescript: `
import React, { useState } from 'react';
import { ColorPicker } from '@mantle-ui/react/colorpicker';

export default function AlphaDemo() {
    const [hex, setHex] = useState('6466f180');
    const [rgb, setRgb] = useState({ r: 100, g: 102, b: 241, a: 0.5 });
    const [hsb, setHsb] = useState({ h: 239, s: 59, b: 95, a: 0.5 });

    return (
        <div className="card flex flex-wrap gap-5">
            <div className="flex flex-column gap-2">
                <label htmlFor="alpha-hex-demo">HEX with alpha</label>
                <ColorPicker inputId="alpha-hex-demo" alpha value={hex} onChange={(e) => {
                    if (typeof e.value === 'string') setHex(e.value);
                }} />
                <code>{hex}</code>
            </div>
            <div className="flex flex-column gap-2">
                <span>RGB with alpha (inline)</span>
                <ColorPicker alpha inline format="rgb" value={rgb} onChange={(e) => {
                    if (e.value && typeof e.value !== 'string' && 'r' in e.value) {
                        setRgb({ ...e.value, a: e.value.a ?? 1 });
                    }
                }} />
                <code>{JSON.stringify(rgb)}</code>
            </div>
            <div className="flex flex-column gap-2">
                <label htmlFor="alpha-hsb-demo">HSB with alpha</label>
                <ColorPicker inputId="alpha-hsb-demo" alpha format="hsb" value={hsb} onChange={(e) => {
                    if (e.value && typeof e.value !== 'string' && 'h' in e.value) {
                        setHsb({ ...e.value, a: e.value.a ?? 1 });
                    }
                }} />
                <code>{JSON.stringify(hsb)}</code>
            </div>
        </div>
    );
}
        `
    };

    return (
        <>
            <DocSectionText {...props}>
                <p>
                    Enable <i>alpha</i> to add an opacity slider and a checkerboard transparency preview. It defaults to <i>false</i>, preserving the existing six-digit hex and RGB/HSB value contracts.
                </p>
                <div className="doc-tablewrapper">
                    <table className="doc-table">
                        <thead>
                            <tr>
                                <th>Format</th>
                                <th>Value with alpha enabled</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>hex</td>
                                <td>Accepts six-digit RRGGBB or eight-digit RRGGBBAA, with an optional leading #. Emits lowercase RRGGBBAA without #. AA ranges from 00 (transparent) to ff (opaque), rounded to the nearest byte.</td>
                            </tr>
                            <tr>
                                <td>rgb</td>
                                <td>
                                    <code>{'{ r, g, b, a }'}</code>, with each RGB channel from 0 to 255 and <i>a</i> from 0 (transparent) to 1 (opaque).
                                </td>
                            </tr>
                            <tr>
                                <td>hsb</td>
                                <td>
                                    <code>{'{ h, s, b, a }'}</code>, with hue from 0 to 360, saturation and brightness from 0 to 100, and the same 0-1 alpha range.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p>
                    Six-digit hex and objects without <i>a</i> are opaque. Missing or non-finite object alpha defaults to 1; finite alpha is clamped to the 0–1 range. The hex <i>defaultColor</i> follows the same six/eight-digit rules in every format.
                </p>
                <p>
                    Color and hue changes preserve alpha, including zero and supplied object precision. Opacity-only edits preserve the supplied RGB channels or hex RGB bytes. The slider displays the nearest whole percent and edits in 1% steps,
                    emitting <i>a = percent / 100</i> for objects. For example, 50% emits
                    <i> a: 0.5</i> or hex suffix <i>80</i>; byte 80 represents 128/255, approximately 50.196%. These representations therefore have different precision.
                </p>
                <p>
                    Update <i>value</i> from <i>onChange</i> as with the existing controlled picker. External value, format, alpha and defaultColor changes refresh the control without emitting a change event. Both <i>disabled</i> and <i>readOnly</i>
                    prevent color, hue and opacity edits. Use <i>alphaLabel</i> to translate the visible and accessible opacity label.
                </p>
            </DocSectionText>
            <div className="card flex flex-wrap gap-5">
                <div className="flex flex-column gap-2">
                    <label htmlFor="alpha-hex">HEX with alpha</label>
                    <ColorPicker inputId="alpha-hex" alpha value={hex} onChange={(e) => setHex(e.value)} />
                    <code>{hex}</code>
                </div>
                <div className="flex flex-column gap-2">
                    <span>RGB with alpha (inline)</span>
                    <ColorPicker alpha inline format="rgb" value={rgb} onChange={(e) => setRgb(e.value)} />
                    <code>{JSON.stringify(rgb)}</code>
                </div>
                <div className="flex flex-column gap-2">
                    <label htmlFor="alpha-hsb">HSB with alpha</label>
                    <ColorPicker inputId="alpha-hsb" alpha format="hsb" value={hsb} onChange={(e) => setHsb(e.value)} />
                    <code>{JSON.stringify(hsb)}</code>
                </div>
            </div>
            <DocSectionCode code={code} />
        </>
    );
}
