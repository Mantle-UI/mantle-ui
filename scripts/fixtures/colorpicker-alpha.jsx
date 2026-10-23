import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { MantleProvider } from '../../components/lib/api/Api';
import { ColorPicker } from '../../components/lib/colorpicker/ColorPicker';

function Fixture() {
    const [value, setValue] = React.useState('00117780');
    const [options, setOptions] = React.useState({});
    const [nextTarget, setNextTarget] = React.useState('link');

    const change = (event) => {
        window.alphaChanges.push(event.value);
        setValue(event.value);
    };

    React.useEffect(() => {
        window.alphaChanges = [];
        window.alphaFixture = { setValue, setOptions, setNextTarget };
    }, []);

    return (
        <MantleProvider>
            <h1>ColorPicker optional alpha</h1>
            <div className="cases">
                <section>
                    <h2>Inline alpha</h2>
                    <ColorPicker id="inline" inline alpha value={value} onChange={change} {...options} />
                    <output id="value">{JSON.stringify(value)}</output>
                </section>
                <section>
                    <h2>Popup alpha</h2>
                    <button id="before">Before</button>
                    <ColorPicker key={options.appendTo || 'body'} id="popup" inputId="popup-input" alpha value={value} onChange={change} {...options} />
                    {nextTarget === 'summary' && (
                        <details>
                            <summary id="after">Next summary</summary>
                            <button>Inside details</button>
                        </details>
                    )}
                    {nextTarget === 'closedDetails' && (
                        <details>
                            <summary tabIndex={-1}>Closed details</summary>
                            <button id="closed-details-button">Hidden button</button>
                        </details>
                    )}
                    {nextTarget === 'radio' ? (
                        <>
                            <input type="radio" name="next-color-radio" id="unchecked-radio" aria-label="Unchecked radio" />
                            <input type="radio" name="next-color-radio" id="after" aria-label="Checked radio" defaultChecked />
                        </>
                    ) : (
                        nextTarget !== 'summary' && (
                            <a id="after" href="#after">
                                After
                            </a>
                        )
                    )}
                </section>
                <section>
                    <h2>Default remains opaque</h2>
                    <ColorPicker id="legacy" inline value="001177" />
                </section>
            </div>
            <h2>Inline appear transition initialization</h2>
            <div className="cases">
                <ColorPicker id="appear-opaque" inline value="001177" transitionOptions={{ appear: true }} />
                <ColorPicker id="appear-alpha" inline alpha value="00117780" transitionOptions={{ appear: true }} />
            </div>
        </MantleProvider>
    );
}

createRoot(document.getElementById('app')).render(<Fixture />);
