import { DocSectionText } from '@/components/doc/common/docsectiontext';

export function StyledDoc(props) {
    return (
        <>
            <DocSectionText {...props}>
                <p>List of class names used in the styled mode.</p>
                <p>
                    The opacity section uses <code>--p-colorpicker-alpha-color</code> for its text color, defaulting to <code>#fff</code> for the legacy dark ColorPicker panels. Override this CSS variable when using a light panel background.
                </p>
                <p>The opacity slider shows the current color from transparent to opaque over a checkerboard, updating as the selected color changes.</p>
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
                        <tr>
                            <td>p-colorpicker</td>
                            <td>Container element.</td>
                        </tr>
                        <tr>
                            <td>p-colorpicker-overlay</td>
                            <td>Container element in overlay mode.</td>
                        </tr>
                        <tr>
                            <td>p-colorpicker-preview </td>
                            <td>Preview input in overlay mode.</td>
                        </tr>
                        <tr>
                            <td>p-colorpicker-panel</td>
                            <td>Panel element of the colorpicker.</td>
                        </tr>
                        <tr>
                            <td>p-colorpicker-content</td>
                            <td>Wrapper that contains color and hue sections.</td>
                        </tr>
                        <tr>
                            <td>p-colorpicker-color-selector</td>
                            <td>Color selector container.</td>
                        </tr>
                        <tr>
                            <td>p-colorpicker-color</td>
                            <td>Color element.</td>
                        </tr>
                        <tr>
                            <td>p-colorpicker-color-handle</td>
                            <td>Handle of the color element.</td>
                        </tr>
                        <tr>
                            <td>p-colorpicker-hue</td>
                            <td>Hue slider.</td>
                        </tr>
                        <tr>
                            <td>p-colorpicker-hue-handle</td>
                            <td>Handle of the hue slider.</td>
                        </tr>
                        <tr>
                            <td>p-colorpicker-alpha-enabled</td>
                            <td>Root and panel modifier when alpha is enabled.</td>
                        </tr>
                        <tr>
                            <td>p-colorpicker-alpha</td>
                            <td>Opacity section, present when alpha is enabled.</td>
                        </tr>
                        <tr>
                            <td>p-colorpicker-alpha-label</td>
                            <td>Visible opacity label.</td>
                        </tr>
                        <tr>
                            <td>p-colorpicker-alpha-slider</td>
                            <td>Native opacity range input.</td>
                        </tr>
                        <tr>
                            <td>p-colorpicker-alpha-value</td>
                            <td>Opacity percentage text.</td>
                        </tr>
                        <tr>
                            <td>p-colorpicker-alpha-preview</td>
                            <td>Selected color over a checkerboard transparency background.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}
