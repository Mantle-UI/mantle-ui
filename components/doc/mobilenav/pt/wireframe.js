import { DocSectionText } from '@/components/doc/common/docsectiontext';

export const Wireframe = (props) => {
    return (
        <>
            <DocSectionText {...props} />
            <div>
                <img className="w-full" src="/images/pt/mobilenav-wireframe.png" alt="MobileNav passthrough wireframe" />
            </div>
        </>
    );
};
