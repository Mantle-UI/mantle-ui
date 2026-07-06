import { DocSectionText } from '@/components/doc/common/docsectiontext';

export function PathwayDoc(props) {
    return (
        <DocSectionText {...props}>
            <p>Mantle UI uses a simple contributor structure involving community contributors and maintainers:</p>
            <h3>Contributor Role</h3>
            <p>After a certain period of frequent contributions, a community member is offered the Contributor role. On average, it may take about three months, but the exact duration can vary depending on the individual commitment.</p>

            <h3>Committer Role</h3>
            <p>If a contributor actively participates in the codebase and PRs, their role may be upgraded to a Committer level, providing direct commit access to the MantleUI codebase.</p>

            <h3>Employment</h3>
            <p>Strong open source contributions can lead to greater trust, broader responsibilities, and potential collaboration opportunities as the project grows.</p>
        </DocSectionText>
    );
}
