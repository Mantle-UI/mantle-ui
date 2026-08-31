/**
 * Aura-inspired foundation preset for Mantle's legacy component DOM.
 *
 * This intentionally contains no component selectors. Components consume the
 * semantic and component tokens through the accompanying Aura CSS bridge.
 */
export const Aura = {
    primitive: {
        borderRadius: {
            sm: '4px',
            md: '6px',
            lg: '8px',
            xl: '12px'
        },
        emerald: {
            50: '#ecfdf5',
            100: '#d1fae5',
            200: '#a7f3d0',
            300: '#6ee7b7',
            400: '#34d399',
            500: '#10b981',
            600: '#059669',
            700: '#047857',
            800: '#065f46',
            900: '#064e3b',
            950: '#022c22'
        },
        slate: {
            0: '#ffffff',
            50: '#f8fafc',
            100: '#f1f5f9',
            200: '#e2e8f0',
            300: '#cbd5e1',
            400: '#94a3b8',
            500: '#64748b',
            600: '#475569',
            700: '#334155',
            800: '#1e293b',
            900: '#0f172a',
            950: '#020617'
        },
        zinc: {
            0: '#ffffff',
            100: '#f4f4f5',
            200: '#e4e4e7',
            300: '#d4d4d8',
            400: '#a1a1aa',
            500: '#71717a',
            600: '#52525b',
            700: '#3f3f46',
            800: '#27272a',
            900: '#18181b',
            950: '#09090b'
        }
    },
    semantic: {
        transitionDuration: '0.2s',
        focusRing: {
            width: '1px',
            style: 'solid',
            color: '{primary.color}',
            offset: '2px'
        },
        primary: {
            50: '{emerald.50}',
            100: '{emerald.100}',
            200: '{emerald.200}',
            300: '{emerald.300}',
            400: '{emerald.400}',
            500: '{emerald.500}',
            600: '{emerald.600}',
            700: '{emerald.700}'
        },
        formField: {
            paddingX: '0.75rem',
            paddingY: '0.5rem',
            borderRadius: '{borderRadius.md}',
            transitionDuration: '{transitionDuration}'
        },
        colorScheme: {
            light: {
                surface: {
                    0: '{slate.0}',
                    50: '{slate.50}',
                    100: '{slate.100}',
                    200: '{slate.200}',
                    300: '{slate.300}',
                    400: '{slate.400}',
                    500: '{slate.500}',
                    700: '{slate.700}'
                },
                primary: {
                    color: '{primary.500}',
                    contrastColor: '#ffffff',
                    hoverColor: '{primary.600}',
                    activeColor: '{primary.700}'
                },
                text: {
                    color: '{surface.700}',
                    mutedColor: '{surface.500}'
                },
                formField: {
                    background: '{surface.0}',
                    borderColor: '{surface.300}',
                    hoverBorderColor: '{surface.400}',
                    focusBorderColor: '{primary.color}',
                    color: '{surface.700}',
                    placeholderColor: '{surface.500}'
                }
            },
            dark: {
                surface: {
                    0: '{zinc.0}',
                    100: '{zinc.100}',
                    200: '{zinc.200}',
                    300: '{zinc.300}',
                    400: '{zinc.400}',
                    500: '{zinc.500}',
                    700: '{zinc.700}',
                    800: '{zinc.800}',
                    900: '{zinc.900}',
                    950: '{zinc.950}'
                },
                primary: {
                    color: '{primary.400}',
                    contrastColor: '{surface.900}',
                    hoverColor: '{primary.300}',
                    activeColor: '{primary.200}'
                },
                text: {
                    color: '{surface.0}',
                    mutedColor: '{surface.400}'
                },
                formField: {
                    background: '{surface.950}',
                    borderColor: '{surface.600}',
                    hoverBorderColor: '{surface.500}',
                    focusBorderColor: '{primary.color}',
                    color: '{surface.0}',
                    placeholderColor: '{surface.400}'
                }
            }
        }
    },
    components: {
        button: {
            root: {
                background: '{primary.color}',
                hoverBackground: '{primary.hoverColor}',
                activeBackground: '{primary.activeColor}',
                color: '{primary.contrastColor}',
                borderRadius: '{borderRadius.md}',
                paddingX: '1.25rem',
                paddingY: '0.75rem'
            }
        },
        inputtext: {
            root: {
                background: '{formField.background}',
                borderColor: '{formField.borderColor}',
                borderRadius: '{formField.borderRadius}'
            }
        }
    },
    css: ({ prefix = 'mantle' } = {}) => `
.p-button {
    background: var(--${prefix}-button-root-background);
    border: 1px solid var(--${prefix}-button-root-background);
    border-radius: var(--${prefix}-button-root-border-radius);
    color: var(--${prefix}-button-root-color);
    padding: var(--${prefix}-button-root-padding-y) var(--${prefix}-button-root-padding-x);
    transition: background var(--${prefix}-transition-duration), border-color var(--${prefix}-transition-duration);
}

.p-button:not(:disabled):hover {
    background: var(--${prefix}-button-root-hover-background);
    border-color: var(--${prefix}-button-root-hover-background);
}

.p-button:not(:disabled):active {
    background: var(--${prefix}-button-root-active-background);
    border-color: var(--${prefix}-button-root-active-background);
}

.p-inputtext {
    background: var(--${prefix}-inputtext-root-background);
    border: 1px solid var(--${prefix}-inputtext-root-border-color);
    border-radius: var(--${prefix}-inputtext-root-border-radius);
    color: var(--${prefix}-form-field-color);
    padding: var(--${prefix}-form-field-padding-y) var(--${prefix}-form-field-padding-x);
    transition: border-color var(--${prefix}-transition-duration);
}

.p-inputtext:hover {
    border-color: var(--${prefix}-form-field-hover-border-color);
}

.p-inputtext:enabled:focus {
    border-color: var(--${prefix}-form-field-focus-border-color);
    box-shadow: 0 0 0 1px var(--${prefix}-form-field-focus-border-color);
    outline: 0;
}

.p-inputtext::placeholder {
    color: var(--${prefix}-form-field-placeholder-color);
}
`
};
