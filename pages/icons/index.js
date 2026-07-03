import { DocComponent } from '@/components/doc/common/doccomponent';
import { BasicDoc } from '@/components/doc/icons/basicdoc';
import { ColorDoc } from '@/components/doc/icons/colordoc';
import { ConstantsDoc } from '@/components/doc/icons/constantsdoc';
import { DownloadDoc } from '@/components/doc/icons/downloaddoc';
import { ImportDoc } from '@/components/doc/icons/importdoc';
import { ListDoc } from '@/components/doc/icons/listdoc';
import { SizeDoc } from '@/components/doc/icons/sizedoc';
import { SpinDoc } from '@/components/doc/icons/spindoc';
import { FigmaDoc } from '@/components/doc/icons/figmadoc';

const IconsDoc = () => {
    const docs = [
        {
            id: 'download',
            label: 'Download',
            component: DownloadDoc
        },
        {
            id: 'import',
            label: 'Import',
            component: ImportDoc
        },
        {
            id: 'figma',
            label: 'Figma',
            component: FigmaDoc
        },
        {
            id: 'basic',
            label: 'Basic',
            component: BasicDoc
        },
        {
            id: 'size',
            label: 'Size',
            component: SizeDoc
        },
        {
            id: 'color',
            label: 'Color',
            component: ColorDoc
        },
        {
            id: 'spin',
            label: 'Spin',
            component: SpinDoc
        },
        {
            id: 'constants',
            label: 'Constants',
            component: ConstantsDoc
        },
        {
            id: 'list',
            label: 'List',
            component: ListDoc
        }
    ];

    return <DocComponent title="React Icon Library - MantleUI" header="Icons" description="MantleIcons is the default icon library of MantleUI." componentDocs={docs} hideTabMenu />;
};

export default IconsDoc;

