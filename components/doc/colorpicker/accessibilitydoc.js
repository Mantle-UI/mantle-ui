import { DocSectionText } from '@/components/doc/common/docsectiontext';

export function AccessibilityDoc() {
    return (
        <DocSectionText id="accessibility" label="Accessibility">
            <h3>Screen Reader</h3>
            <p>
                Provide a label for the popup preview using <i>inputId</i> and a matching label element, or use <i>aria-label</i>. With <i>alpha</i> enabled, opacity uses a native range input with a default accessible name of <i>Opacity</i>, a range
                of 0–100 and a percentage value. Customize its visible and accessible label with <i>alphaLabel</i>, or provide attributes through <i>pt.alphaSlider</i>.
            </p>
            <p>
                The existing saturation/brightness area and hue strip use pointer and touch interaction and do not yet provide keyboard or screen reader color selection. The accessible opacity control does not make the entire color picker keyboard
                accessible.
            </p>
            <h3>Popup Keyboard Support</h3>
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
                            <td>Tab</td>
                            <td>Moves focus to the preview. With an alpha popup open, moves from the preview to opacity, then closes the popup and moves to the next control.</td>
                        </tr>
                        <tr>
                            <td>Space</td>
                            <td>With alpha enabled, opens the popup and moves focus to opacity. Otherwise, toggles the popup.</td>
                        </tr>
                        <tr>
                            <td>Enter</td>
                            <td>With alpha enabled, opens the popup and moves focus to opacity.</td>
                        </tr>
                        <tr>
                            <td>Escape</td>
                            <td>Closes the popup. From opacity, restores focus to the preview.</td>
                        </tr>
                        <tr>
                            <td>Shift + Tab from opacity</td>
                            <td>Closes the popup and returns focus to the preview.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <h3>Opacity Keyboard Support</h3>
            <p>Opacity is available in inline and popup modes. The native range input supports these keys:</p>
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
                            <td>Right / Up arrow</td>
                            <td>Increases opacity by one percentage point.</td>
                        </tr>
                        <tr>
                            <td>Left / Down arrow</td>
                            <td>Decreases opacity by one percentage point.</td>
                        </tr>
                        <tr>
                            <td>Home / End</td>
                            <td>Sets opacity to 0% / 100%.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p>Disabled pickers cannot be focused or edited. Read-only pickers keep the popup preview focusable and allow the popup to be inspected, while blocking color, hue and opacity edits.</p>
        </DocSectionText>
    );
}
