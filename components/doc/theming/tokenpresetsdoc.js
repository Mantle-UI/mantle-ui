import { DocSectionCode } from '@/components/doc/common/docsectioncode';
import { DocSectionText } from '@/components/doc/common/docsectiontext';

export function TokenPresetsDoc(props) {
    const code = {
        provider: `
import { MantleProvider } from '@mantle-ui/react/api';
import { Aura } from '@mantle-ui/react/themes';

export function App({ children }) {
    return (
        <MantleProvider
            value={{
                theme: {
                    preset: Aura,
                    options: {
                        darkModeSelector: '.app-dark'
                    }
                }
            }}
        >
            {children}
        </MantleProvider>
    );
}
        `,
        customize: `
import { useContext } from 'react';
import { MantleContext } from '@mantle-ui/react/api';
import { Aura, definePreset } from '@mantle-ui/react/themes';

const MyAura = definePreset(Aura, {
    semantic: {
        primary: {
            500: '#8b5cf6',
            600: '#7c3aed',
            700: '#6d28d9'
        }
    }
});

export function ThemeControls() {
    const { setTheme } = useContext(MantleContext);
    const updatePalette = () => setTheme((theme) => ({
        ...theme,
        preset: definePreset(theme.preset, {
            semantic: { primary: { 500: '#0ea5e9', 600: '#0284c7', 700: '#0369a1' } }
        })
    }));

    return <button onClick={updatePalette}>Use blue primary palette</button>;
}
        `,
        scoped: `
import { Dialog } from '@mantle-ui/react/dialog';
import { Dropdown } from '@mantle-ui/react/dropdown';

const localDropdown = {
    panel: { background: '#fff7ed' },
    colorScheme: { dark: { panel: { background: '#431407' } } }
};

export function LocalControls() {
    return (
        <>
            <Dropdown options={['One', 'Two']} dt={localDropdown} />
            <Dropdown options={['One', 'Two']} />
            <Dialog visible onHide={() => {}}
                dt={{ root: { background: '#fff7ed' }, mask: { background: 'rgba(67, 20, 7, 0.5)' } }}>
                Local dialog tokens also reach its body-mounted mask.
            </Dialog>
        </>
    );
}
        `,
        extend: `
const MyAura = definePreset(Aura, {
    extend: { my: { transition: { fast: '0.2s' } } },
    components: {
        button: {
            extend: { accent: { color: '#f59e0b', inverseColor: '#ffffff' } },
            css: ({ dt }) => \`
                .p-button-accent {
                    background: \${dt('button.accent.color')};
                    color: \${dt('button.accent.inverse.color')};
                    transition-duration: \${dt('my.transition.fast')};
                }
            \`
        }
    },
    css: '.custom-content { border-radius: 8px; }'
});

// Component and top-level CSS augment Aura; repeated composition is deduplicated.
// CSS dt() returns var() references with the provider's configured prefix.
<Button className="p-button-accent"
    dt={{ extend: { accent: { color: '#a855f7' } } }} label="Local accent" />;
        `
    };

    return (
        <>
            <DocSectionText {...props}>
                <p>
                    Token presets are the modern styled-mode API. A preset defines primitive, semantic and component tokens, which Mantle resolves into CSS variables and injects for each provider. The generated style element is removed when its
                    provider unmounts, so separate React roots and Shadow DOM containers can use different presets. Aura supplies tokens and CSS for the styled component suite, including forms, overlays, containers, data displays, navigation,
                    feedback and media. Component tokens customize individual parts and states; primitive and semantic overrides update their shared aliases. The generated static Aura light and dark themes use the same preset and CSS bridge.
                </p>
            </DocSectionText>
            <p>
                Each provider scopes tokens to its component roots. Built-in overlays carry that scope and the originating subtree&apos;s dark state into body portals, and track live dark-class changes. Imperative overlays use their trigger&apos;s
                ancestry. Update an individual provider with MantleContext.setTheme or replace its value.theme configuration. The imperative applyPreset and updatePrimaryPalette APIs manage a separate document theme. A provider&apos;s scope is
                automatic; the selector option applies to the imperative CSS APIs.
            </p>
            <p>
                Providers use uncontrolled theme state by default: value.theme supplies the initial configuration, equivalent inline configurations preserve setTheme updates, and changed token or option values replace the state. Change themeRevision
                to reapply an equivalent configuration explicitly. For controlled state, use themeMode=&quot;controlled&quot; and onThemeChange to update value.theme; setTheme requests a change and props remain authoritative. Presets and options
                should be immutable; DOM containers and callback functions are compared by identity.
            </p>
            <p>
                The dt prop overrides this component&apos;s token group for one instance. Its internal parts and detached portals share that instance, while ordinary nested components keep their own defaults. Local styles follow preset, prefix and
                dark-state changes and are removed on unmount or when dt is removed. Provider custom CSS applies within Mantle roots and their descendants; place custom content inside a Mantle container to keep it scoped.
            </p>
            <p>
                Top-level extend defines shared tokens, and component extend adds tokens below the component name without an extra extend segment. CSS callbacks receive a dt accessor for variable references. definePreset composes consuming CSS with
                additions instead of replacing Aura, and deduplicates repeated strings or callback identities. Custom CSS still follows the normal CSS cascade. CSS layers register primereact before the theme layer so delayed component mounts keep the
                same precedence.
            </p>
            <p>
                Independent server-rendered React roots must use distinct identifierPrefix values in both renderToString and hydrateRoot. Provider and local identifiers preserve punctuation, so prefixes such as app.one- and appone- remain distinct.
                React 17 assigns its scope after hydration because it does not provide useId.
            </p>
            <p>
                Aura and the theme helpers are available from both @mantle-ui/react and @mantle-ui/react/themes. The root and subpath imports share the provider context and imperative theme state. A custom prefix changes token variable names;
                component CSS and canvas charts follow it automatically. Chart uses scoped tokens for its default palette, axes, labels, grid and tooltip, preserves caller-supplied data and options, and refreshes when its theme changes.
            </p>
            <DocSectionCode code={code} hideStackBlitz />
        </>
    );
}
