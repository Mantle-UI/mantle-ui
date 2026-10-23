import { DocSectionCode } from '@/components/doc/common/docsectioncode';
import { DocSectionText } from '@/components/doc/common/docsectiontext';
import { ColorPicker } from '@/components/lib/colorpicker/ColorPicker';

export function ReadOnlyDoc(props) {
    const code = {
        basic: `
<ColorPicker alpha readOnly value="6466f180" />
        `,
        javascript: `
import React from 'react';
import { ColorPicker } from '@mantle-ui/react/colorpicker';

export default function ReadOnlyDemo() {
    return <ColorPicker alpha readOnly value="6466f180" aria-label="Read-only color" />;
}
        `,
        typescript: `
import React from 'react';
import { ColorPicker } from '@mantle-ui/react/colorpicker';

export default function ReadOnlyDemo() {
    return <ColorPicker alpha readOnly value="6466f180" aria-label="Read-only color" />;
}
        `
    };

    return (
        <>
            <DocSectionText {...props}>
                <p>
                    Use <i>readOnly</i> to prevent color, hue and opacity changes. The popup preview remains focusable and its panel can be opened for inspection.
                </p>
            </DocSectionText>
            <div className="card flex justify-content-center">
                <ColorPicker alpha readOnly value="6466f180" aria-label="Read-only color" />
            </div>
            <DocSectionCode code={code} />
        </>
    );
}
