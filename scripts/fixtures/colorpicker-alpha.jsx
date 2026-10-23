import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { MantleProvider } from '../../components/lib/api/Api';
import { ColorPicker } from '../../components/lib/colorpicker/ColorPicker';

function Fixture() {
    const [value, setValue] = React.useState('00117780');
    const [options, setOptions] = React.useState({});

    const change = (event) => {
        window.alphaChanges.push(event.value);
        setValue(event.value);
    };

    React.useEffect(() => {
        window.alphaChanges = [];
        window.alphaFixture = { setValue, setOptions };
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
                    <ColorPicker id="popup" inputId="popup-input" alpha value={value} onChange={change} {...options} />
                    <a id="after" href="#after">
                        After
                    </a>
                </section>
                <section>
                    <h2>Default remains opaque</h2>
                    <ColorPicker id="legacy" inline value="001177" />
                </section>
            </div>
        </MantleProvider>
    );
}

createRoot(document.getElementById('app')).render(<Fixture />);
