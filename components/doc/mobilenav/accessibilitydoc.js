import { DocSectionText } from '@/components/doc/common/docsectiontext';

export function AccessibilityDoc(props) {
    return (
        <DocSectionText {...props}>
            <h3>Screen Reader</h3>
            <p>
                MobileNav renders a <i>nav</i> landmark. Use <i>ariaLabel</i> to provide its accessible name; it defaults to <i>Navigation</i>. The active leaf item receives <i>aria-current=&quot;page&quot;</i>, while expandable items expose their
                state with <i>aria-expanded</i>.
            </p>
            <h3>Keyboard Support</h3>
            <div className="doc-tablewrapper">
                <table className="doc-table">
                    <thead>
                        <tr>
                            <th>Key</th>
                            <th>Function</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <i>enter</i>
                            </td>
                            <td>Expands or collapses a focused root navigation button, or activates a focused navigation link.</td>
                        </tr>
                        <tr>
                            <td>
                                <i>space</i>
                            </td>
                            <td>Expands or collapses the focused root navigation button.</td>
                        </tr>
                        <tr>
                            <td>
                                <i>escape</i>
                            </td>
                            <td>Closes the overlay drawer.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </DocSectionText>
    );
}
