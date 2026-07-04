import { withBasePath } from '@/components/utils/utils';
import { useEffect } from 'react';

export default function SetupRedirectPage() {
    useEffect(() => {
        window.location.replace(withBasePath('/installation'));
    }, []);

    return <p>Redirecting to installation...</p>;
}
