import Link from 'next/link';
import { useRouter } from 'next/router';

export function DocSubSection(props) {
    const router = useRouter();

    return (
        <div style={{ marginBottom: '30px' }}>
            <h3 className="doc-section-label">
                {props.label}
                <Link href={router.pathname + '#' + props.id} target="_self" id={props.id}>
                    #
                </Link>
            </h3>
            {props.children}
        </div>
    );
}
