import { DocSectionCode } from '@/components/doc/common/docsectioncode';
import { DocSectionText } from '@/components/doc/common/docsectiontext';

export function ImportDoc(props) {
    const code = {
        basic: `
import { ConfirmPopup } from '@mantle-ui/react/confirmpopup'; // To use <ConfirmPopup> tag
import { confirmPopup } from '@mantle-ui/react/confirmpopup'; // To use confirmPopup method
        `
    };

    return (
        <>
            <DocSectionText {...props} />
            <DocSectionCode code={code} hideToggleCode import hideStackBlitz />
        </>
    );
}
