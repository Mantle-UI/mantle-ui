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
import { Aura, definePreset, updatePrimaryPalette } from '@mantle-ui/react/themes';

const MyAura = definePreset(Aura, {
    semantic: {
        primary: {
            500: '#8b5cf6',
            600: '#7c3aed',
            700: '#6d28d9'
        }
    }
});

// Updates the active preset and its injected CSS variables at runtime.
updatePrimaryPalette({ 500: '#0ea5e9', 600: '#0284c7', 700: '#0369a1' });
        `
    };

    return (
        <>
            <DocSectionText {...props}>
                <p>
                    Token presets are the modern styled-mode API. A preset defines primitive, semantic and component tokens, which Mantle resolves into CSS variables and injects once for the provider. Aura is the first experimental preset; its
                    component coverage expands over time while legacy CSS themes remain supported.
                </p>
            </DocSectionText>
            <DocSectionCode code={code} hideStackBlitz />
        </>
    );
}
