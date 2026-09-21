import { DocComponent } from '@/components/doc/common/doccomponent';
import DocApiTable from '@/components/doc/common/docapitable';
import { AccessibilityDoc } from '@/components/doc/mobilenav/accessibilitydoc';
import { BasicDoc } from '@/components/doc/mobilenav/basicdoc';
import { ImportDoc } from '@/components/doc/mobilenav/importdoc';
import { ModelDoc } from '@/components/doc/mobilenav/modeldoc';
import { StyledDoc } from '@/components/doc/mobilenav/theming/styleddoc';
import { UnstyledDoc } from '@/components/doc/mobilenav/theming/unstyleddoc';
import { Wireframe } from '@/components/doc/mobilenav/pt/wireframe';

const MobileNavDemo = () => {
    const docs = [
        { id: 'import', label: 'Import', component: ImportDoc },
        { id: 'basic', label: 'Basic', component: BasicDoc },
        { id: 'model', label: 'Menu Model', component: ModelDoc },
        { id: 'accessibility', label: 'Accessibility', component: AccessibilityDoc }
    ];
    const themingDocs = [
        { id: 'styled', label: 'Styled', component: StyledDoc },
        { id: 'unstyled', label: 'Unstyled', component: UnstyledDoc }
    ];
    const ptDocs = [
        { id: 'pt.wireframe', label: 'Wireframe', component: Wireframe },
        { id: 'pt.mobilenav.options', label: 'MobileNav PT Options', component: DocApiTable }
    ];

    return (
        <DocComponent
            title="React Mobile Navigation Component"
            header="MobileNav"
            description="MobileNav displays a tree of navigation items in a responsive overlay drawer."
            componentDocs={docs}
            apiDocs={['MobileNav', 'MenuItem']}
            themingDocs={themingDocs}
            ptDocs={ptDocs}
        />
    );
};

export default MobileNavDemo;
