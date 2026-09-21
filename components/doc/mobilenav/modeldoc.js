import { DocSectionCode } from '@/components/doc/common/docsectioncode';
import { DocSectionText } from '@/components/doc/common/docsectiontext';

export function ModelDoc(props) {
    const code = {
        basic: `
const items = [
    {
        label: 'Components',
        icon: 'pi pi-compass',
        items: [
            {
                label: 'Form',
                items: [
                    { label: 'Button', url: '/button' },
                    { label: 'InputText', url: '/inputtext' }
                ]
            }
        ]
    }
];

<MobileNav model={items} activeItem="/button" />
        `
    };

    return (
        <>
            <DocSectionText {...props}>
                <p>
                    The <i>model</i> is a tree of <i>MenuItem</i> objects. Root items with children are expandable; nested items without a URL are rendered as section labels. Set <i>activeItem</i> to an item, item id, or URL to mark the current page
                    and expand its ancestor.
                </p>
            </DocSectionText>
            <DocSectionCode code={code} />
        </>
    );
}
