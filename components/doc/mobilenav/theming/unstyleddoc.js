import { DocSectionCode } from '@/components/doc/common/docsectioncode';
import { DocSectionText } from '@/components/doc/common/docsectiontext';

export function UnstyledDoc(props) {
    const code = {
        basic: `
<MobileNav visible={visible} onHide={() => setVisible(false)} model={items} unstyled />
        `
    };

    return (
        <>
            <DocSectionText {...props}>
                <p>
                    Set <i>unstyled</i> to remove MobileNav’s default navigation styles. Use the pass-through API or your own CSS to style the overlay drawer and its navigation tree.
                </p>
            </DocSectionText>
            <DocSectionCode code={code} />
        </>
    );
}
