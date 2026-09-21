import { DocSectionText } from '@/components/doc/common/docsectiontext';

export function StyledDoc(props) {
    const rows = [
        ['p-mobilenav', 'Overlay drawer root.'],
        ['p-mobilenav-list', 'Root navigation list.'],
        ['p-mobilenav-sublist', 'Nested navigation list.'],
        ['p-mobilenav-item', 'Navigation item.'],
        ['p-mobilenav-item-active', 'Current navigation item.'],
        ['p-mobilenav-item-expanded', 'Expanded root navigation item.'],
        ['p-mobilenav-item-content', 'Item link or expandable button.'],
        ['p-mobilenav-icon', 'Item icon container.'],
        ['p-mobilenav-group-label', 'Nested group label.']
    ];

    return (
        <>
            <DocSectionText {...props}>
                <p>List of class names used in styled mode.</p>
            </DocSectionText>
            <div className="doc-tablewrapper">
                <table className="doc-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Element</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map(([name, description]) => (
                            <tr key={name}>
                                <td>{name}</td>
                                <td>{description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
