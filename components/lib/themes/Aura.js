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
        green: {
            500: '#22c55e',
            600: '#16a34a',
            700: '#15803d',
            800: '#166534',
            950: '#052e16'
        },
        sky: {
            500: '#0ea5e9',
            600: '#0284c7',
            700: '#0369a1',
            800: '#075985',
            950: '#082f49'
        },
        orange: {
            500: '#f97316',
            600: '#ea580c',
            700: '#c2410c',
            800: '#9a3412',
            950: '#431407'
        },
        red: {
            500: '#ef4444',
            600: '#dc2626',
            700: '#b91c1c',
            800: '#991b1b',
            950: '#450a0a'
        },
        purple: {
            500: '#a855f7',
            600: '#9333ea',
            700: '#7e22ce',
            800: '#6b21a8',
            950: '#3b0764'
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
            50: '#fafafa',
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
        disabledOpacity: '0.6',
        colorScheme: {
            light: {
                overlay: {
                    background: '{surface.0}',
                    borderColor: '{surface.200}',
                    color: '{text.color}'
                },
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
                    filledBackground: '{surface.100}',
                    borderColor: '{surface.300}',
                    hoverBorderColor: '{surface.400}',
                    focusBorderColor: '{primary.color}',
                    color: '{surface.700}',
                    placeholderColor: '{surface.500}'
                }
            },
            dark: {
                overlay: {
                    background: '{surface.900}',
                    borderColor: '{surface.700}',
                    color: '{text.color}'
                },
                surface: {
                    0: '{zinc.0}',
                    50: '{zinc.50}',
                    100: '{zinc.100}',
                    200: '{zinc.200}',
                    300: '{zinc.300}',
                    400: '{zinc.400}',
                    500: '{zinc.500}',
                    600: '{zinc.600}',
                    700: '{zinc.700}',
                    800: '{zinc.800}',
                    900: '{zinc.900}',
                    950: '{zinc.950}'
                },
                primary: {
                    color: '{primary.400}',
                    contrastColor: '{surface.900}',
                    hoverColor: '{primary.500}',
                    activeColor: '{primary.600}'
                },
                text: {
                    color: '{surface.0}',
                    mutedColor: '{surface.400}'
                },
                formField: {
                    background: '{surface.950}',
                    filledBackground: '{surface.800}',
                    borderColor: '{zinc.600}',
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
            },
            secondary: {
                background: '{slate.700}',
                hoverBackground: '{slate.800}',
                activeBackground: '{slate.900}',
                color: '#ffffff'
            },
            success: {
                background: '{green.500}',
                hoverBackground: '{green.700}',
                activeBackground: '{green.800}',
                color: '{green.950}'
            },
            info: {
                background: '{sky.500}',
                hoverBackground: '{sky.700}',
                activeBackground: '{sky.800}',
                color: '{sky.950}'
            },
            warning: {
                background: '{orange.500}',
                hoverBackground: '{orange.700}',
                activeBackground: '{orange.800}',
                color: '{orange.950}'
            },
            danger: {
                background: '{red.500}',
                hoverBackground: '{red.700}',
                activeBackground: '{red.800}',
                color: '{red.950}'
            },
            help: {
                background: '{purple.500}',
                hoverBackground: '{purple.700}',
                activeBackground: '{purple.800}',
                color: '{purple.950}'
            }
        },
        inputtext: {
            root: {
                background: '{formField.background}',
                borderColor: '{formField.borderColor}',
                borderRadius: '{formField.borderRadius}',
                color: '{formField.color}',
                paddingX: '{formField.paddingX}',
                paddingY: '{formField.paddingY}',
                hoverBorderColor: '{formField.hoverBorderColor}',
                focusBorderColor: '{formField.focusBorderColor}',
                placeholderColor: '{formField.placeholderColor}',
                filledBackground: '{formField.filledBackground}',
                invalidBorderColor: '{red.500}',
                disabledOpacity: '{disabledOpacity}'
            }
        },
        checkbox: {
            root: {
                width: '1.375rem',
                height: '1.375rem',
                borderRadius: '{borderRadius.md}',
                background: '{formField.background}',
                borderColor: '{formField.borderColor}',
                color: '{formField.color}',
                hoverBorderColor: '{primary.color}',
                checkedBackground: '{primary.color}',
                checkedBorderColor: '{primary.color}',
                checkedColor: '{primary.contrastColor}',
                checkedHoverBackground: '{primary.hoverColor}',
                checkedHoverBorderColor: '{primary.hoverColor}',
                focusBorderColor: '{formField.focusBorderColor}',
                invalidBorderColor: '{red.500}'
            }
        },
        radiobutton: {
            root: {
                width: '1.375rem',
                height: '1.375rem',
                borderRadius: '50%',
                background: '{formField.background}',
                borderColor: '{formField.borderColor}',
                color: '{formField.color}',
                hoverBorderColor: '{primary.color}',
                checkedBackground: '{primary.color}',
                checkedBorderColor: '{primary.color}',
                checkedColor: '{primary.contrastColor}',
                checkedHoverBackground: '{primary.hoverColor}',
                checkedHoverBorderColor: '{primary.hoverColor}',
                focusBorderColor: '{formField.focusBorderColor}',
                invalidBorderColor: '{red.500}'
            }
        },
        inputswitch: {
            root: {
                width: '3rem',
                height: '1.75rem',
                borderRadius: '30px',
                background: '{surface.500}',
                hoverBackground: '{zinc.600}',
                checkedBackground: '{primary.color}',
                checkedHoverBackground: '{primary.hoverColor}',
                handleBackground: '{surface.0}',
                checkedHandleBackground: '{primary.contrastColor}',
                focusBorderColor: '{formField.focusBorderColor}',
                invalidBorderColor: '{red.500}'
            }
        },
        dropdown: {
            root: {
                background: '{formField.background}',
                borderColor: '{formField.borderColor}',
                borderRadius: '{formField.borderRadius}',
                color: '{formField.color}',
                hoverBorderColor: '{formField.hoverBorderColor}',
                focusBorderColor: '{formField.focusBorderColor}',
                filledBackground: '{formField.filledBackground}',
                invalidBorderColor: '{red.500}',
                disabledOpacity: '{disabledOpacity}'
            },
            label: {
                color: '{formField.color}',
                placeholderColor: '{formField.placeholderColor}'
            },
            trigger: {
                color: '{text.mutedColor}'
            },
            panel: {
                background: '{overlay.background}',
                borderColor: '{overlay.borderColor}',
                color: '{overlay.color}'
            },
            option: {
                color: '{overlay.color}',
                focusBackground: 'color-mix(in srgb, {overlay.color}, transparent 94%)',
                selectedBackground: 'color-mix(in srgb, {primary.color}, transparent 84%)',
                selectedFocusBackground: 'color-mix(in srgb, {primary.color}, transparent 76%)'
            }
        },
        selectButton: {
            button: {
                background: '{formField.background}',
                borderColor: '{formField.borderColor}',
                color: '{formField.color}',
                hoverBackground: '{surface.100}',
                hoverBorderColor: '{formField.hoverBorderColor}',
                selectedBackground: '{primary.color}',
                selectedBorderColor: '{primary.color}',
                selectedColor: '{primary.contrastColor}',
                selectedHoverBackground: '{primary.hoverColor}',
                selectedHoverBorderColor: '{primary.hoverColor}',
                focusBorderColor: '{formField.focusBorderColor}',
                invalidBorderColor: '{red.500}'
            }
        },
        toggleButton: {
            root: {
                background: '{formField.background}',
                borderColor: '{formField.borderColor}',
                color: '{formField.color}',
                hoverBackground: '{surface.100}',
                hoverBorderColor: '{formField.hoverBorderColor}',
                selectedBackground: '{primary.color}',
                selectedBorderColor: '{primary.color}',
                selectedColor: '{primary.contrastColor}',
                selectedHoverBackground: '{primary.hoverColor}',
                selectedHoverBorderColor: '{primary.hoverColor}',
                focusBorderColor: '{formField.focusBorderColor}',
                invalidBorderColor: '{red.500}'
            }
        }
    },
    css: ({ prefix = 'mantle', selector = ':root', colorScheme = 'light' } = {}) => {
        const surfaceCard = colorScheme === 'dark' ? '900' : '0';
        const surfaceGround = colorScheme === 'dark' ? '950' : '50';
        const surfaceBorder = colorScheme === 'dark' ? '700' : '200';

        return `
${selector} {
    --primary-color: var(--${prefix}-primary-color);
    --primary-color-text: var(--${prefix}-primary-contrast-color);
    --surface-ground: var(--${prefix}-surface-${surfaceGround});
    --surface-card: var(--${prefix}-surface-${surfaceCard});
    --surface-overlay: var(--${prefix}-surface-${surfaceCard});
    --surface-border: var(--${prefix}-surface-${surfaceBorder});
    --text-color: var(--${prefix}-text-color);
    --text-color-secondary: var(--${prefix}-text-muted-color);
    --border-radius: var(--${prefix}-form-field-border-radius);
}

.p-button:not(.p-button-text):not(.p-button-link):not(.p-button-outlined) {
    background: var(--${prefix}-button-root-background);
    border: 1px solid var(--${prefix}-button-root-background);
    border-radius: var(--${prefix}-button-root-border-radius);
    color: var(--${prefix}-button-root-color);
    padding: var(--${prefix}-button-root-padding-y) var(--${prefix}-button-root-padding-x);
    transition: background var(--${prefix}-transition-duration), border-color var(--${prefix}-transition-duration);
}

.p-button:not(.p-button-text):not(.p-button-link):not(.p-button-outlined):not(:disabled):hover {
    background: var(--${prefix}-button-root-hover-background);
    border-color: var(--${prefix}-button-root-hover-background);
}

.p-button:not(.p-button-text):not(.p-button-link):not(.p-button-outlined):not(:disabled):active {
    background: var(--${prefix}-button-root-active-background);
    border-color: var(--${prefix}-button-root-active-background);
}

.p-button.p-button-outlined,
.p-button.p-button-text,
.p-button.p-button-link {
    background: transparent;
    color: var(--${prefix}-primary-color);
}

.p-button.p-button-outlined {
    border-color: var(--${prefix}-primary-color);
}

.p-button.p-button-text,
.p-button.p-button-link {
    border-color: transparent;
}

.p-button.p-button-outlined:not(:disabled):hover,
.p-button.p-button-text:not(:disabled):hover,
.p-button.p-button-link:not(:disabled):hover {
    background: color-mix(in srgb, var(--${prefix}-primary-color), transparent 90%);
    border-color: var(--${prefix}-primary-color);
}

.p-button.p-button-secondary.p-button-text, .p-button.p-button-secondary.p-button-link, .p-button.p-button-secondary.p-button-outlined { color: var(--${prefix}-button-secondary-background); }
.p-button.p-button-success.p-button-text, .p-button.p-button-success.p-button-link, .p-button.p-button-success.p-button-outlined { color: var(--${prefix}-button-success-background); }
.p-button.p-button-info.p-button-text, .p-button.p-button-info.p-button-link, .p-button.p-button-info.p-button-outlined { color: var(--${prefix}-button-info-background); }
.p-button.p-button-warning.p-button-text, .p-button.p-button-warning.p-button-link, .p-button.p-button-warning.p-button-outlined { color: var(--${prefix}-button-warning-background); }
.p-button.p-button-danger.p-button-text, .p-button.p-button-danger.p-button-link, .p-button.p-button-danger.p-button-outlined { color: var(--${prefix}-button-danger-background); }
.p-button.p-button-help.p-button-text, .p-button.p-button-help.p-button-link, .p-button.p-button-help.p-button-outlined { color: var(--${prefix}-button-help-background); }

.p-button.p-button-secondary.p-button-outlined { border-color: var(--${prefix}-button-secondary-background); }
.p-button.p-button-success.p-button-outlined { border-color: var(--${prefix}-button-success-background); }
.p-button.p-button-info.p-button-outlined { border-color: var(--${prefix}-button-info-background); }
.p-button.p-button-warning.p-button-outlined { border-color: var(--${prefix}-button-warning-background); }
.p-button.p-button-danger.p-button-outlined { border-color: var(--${prefix}-button-danger-background); }
.p-button.p-button-help.p-button-outlined { border-color: var(--${prefix}-button-help-background); }

.p-button.p-button-secondary.p-button-text:not(:disabled):hover, .p-button.p-button-secondary.p-button-link:not(:disabled):hover, .p-button.p-button-secondary.p-button-outlined:not(:disabled):hover { background: color-mix(in srgb, var(--${prefix}-button-secondary-background), transparent 90%); border-color: var(--${prefix}-button-secondary-background); }
.p-button.p-button-success.p-button-text:not(:disabled):hover, .p-button.p-button-success.p-button-link:not(:disabled):hover, .p-button.p-button-success.p-button-outlined:not(:disabled):hover { background: color-mix(in srgb, var(--${prefix}-button-success-background), transparent 90%); border-color: var(--${prefix}-button-success-background); }
.p-button.p-button-info.p-button-text:not(:disabled):hover, .p-button.p-button-info.p-button-link:not(:disabled):hover, .p-button.p-button-info.p-button-outlined:not(:disabled):hover { background: color-mix(in srgb, var(--${prefix}-button-info-background), transparent 90%); border-color: var(--${prefix}-button-info-background); }
.p-button.p-button-warning.p-button-text:not(:disabled):hover, .p-button.p-button-warning.p-button-link:not(:disabled):hover, .p-button.p-button-warning.p-button-outlined:not(:disabled):hover { background: color-mix(in srgb, var(--${prefix}-button-warning-background), transparent 90%); border-color: var(--${prefix}-button-warning-background); }
.p-button.p-button-danger.p-button-text:not(:disabled):hover, .p-button.p-button-danger.p-button-link:not(:disabled):hover, .p-button.p-button-danger.p-button-outlined:not(:disabled):hover { background: color-mix(in srgb, var(--${prefix}-button-danger-background), transparent 90%); border-color: var(--${prefix}-button-danger-background); }
.p-button.p-button-help.p-button-text:not(:disabled):hover, .p-button.p-button-help.p-button-link:not(:disabled):hover, .p-button.p-button-help.p-button-outlined:not(:disabled):hover { background: color-mix(in srgb, var(--${prefix}-button-help-background), transparent 90%); border-color: var(--${prefix}-button-help-background); }

.p-button.p-button-secondary:not(.p-button-text):not(.p-button-link):not(.p-button-outlined),
.p-button.p-button-success:not(.p-button-text):not(.p-button-link):not(.p-button-outlined),
.p-button.p-button-info:not(.p-button-text):not(.p-button-link):not(.p-button-outlined),
.p-button.p-button-warning:not(.p-button-text):not(.p-button-link):not(.p-button-outlined),
.p-button.p-button-danger:not(.p-button-text):not(.p-button-link):not(.p-button-outlined),
.p-button.p-button-help:not(.p-button-text):not(.p-button-link):not(.p-button-outlined) {
    border-color: transparent;
}

.p-button.p-button-secondary:not(.p-button-text):not(.p-button-link):not(.p-button-outlined) {
    background: var(--${prefix}-button-secondary-background);
    color: var(--${prefix}-button-secondary-color);
}

.p-button.p-button-success:not(.p-button-text):not(.p-button-link):not(.p-button-outlined) {
    background: var(--${prefix}-button-success-background);
    color: var(--${prefix}-button-success-color);
}

.p-button.p-button-info:not(.p-button-text):not(.p-button-link):not(.p-button-outlined) {
    background: var(--${prefix}-button-info-background);
    color: var(--${prefix}-button-info-color);
}

.p-button.p-button-warning:not(.p-button-text):not(.p-button-link):not(.p-button-outlined) {
    background: var(--${prefix}-button-warning-background);
    color: var(--${prefix}-button-warning-color);
}

.p-button.p-button-danger:not(.p-button-text):not(.p-button-link):not(.p-button-outlined) {
    background: var(--${prefix}-button-danger-background);
    color: var(--${prefix}-button-danger-color);
}

.p-button.p-button-help:not(.p-button-text):not(.p-button-link):not(.p-button-outlined) {
    background: var(--${prefix}-button-help-background);
    color: var(--${prefix}-button-help-color);
}

.p-button.p-button-secondary:not(.p-button-text):not(.p-button-link):not(.p-button-outlined):not(:disabled):hover { background: var(--${prefix}-button-secondary-hover-background); border-color: var(--${prefix}-button-secondary-hover-background); }
.p-button.p-button-success:not(.p-button-text):not(.p-button-link):not(.p-button-outlined):not(:disabled):hover { background: var(--${prefix}-button-success-hover-background); border-color: var(--${prefix}-button-success-hover-background); }
.p-button.p-button-info:not(.p-button-text):not(.p-button-link):not(.p-button-outlined):not(:disabled):hover { background: var(--${prefix}-button-info-hover-background); border-color: var(--${prefix}-button-info-hover-background); }
.p-button.p-button-warning:not(.p-button-text):not(.p-button-link):not(.p-button-outlined):not(:disabled):hover { background: var(--${prefix}-button-warning-hover-background); border-color: var(--${prefix}-button-warning-hover-background); }
.p-button.p-button-danger:not(.p-button-text):not(.p-button-link):not(.p-button-outlined):not(:disabled):hover { background: var(--${prefix}-button-danger-hover-background); border-color: var(--${prefix}-button-danger-hover-background); }
.p-button.p-button-help:not(.p-button-text):not(.p-button-link):not(.p-button-outlined):not(:disabled):hover { background: var(--${prefix}-button-help-hover-background); border-color: var(--${prefix}-button-help-hover-background); }

.p-button.p-button-secondary:not(.p-button-text):not(.p-button-link):not(.p-button-outlined):not(:disabled):active { background: var(--${prefix}-button-secondary-active-background); border-color: var(--${prefix}-button-secondary-active-background); }
.p-button.p-button-success:not(.p-button-text):not(.p-button-link):not(.p-button-outlined):not(:disabled):active { background: var(--${prefix}-button-success-active-background); border-color: var(--${prefix}-button-success-active-background); }
.p-button.p-button-info:not(.p-button-text):not(.p-button-link):not(.p-button-outlined):not(:disabled):active { background: var(--${prefix}-button-info-active-background); border-color: var(--${prefix}-button-info-active-background); }
.p-button.p-button-warning:not(.p-button-text):not(.p-button-link):not(.p-button-outlined):not(:disabled):active { background: var(--${prefix}-button-warning-active-background); border-color: var(--${prefix}-button-warning-active-background); }
.p-button.p-button-danger:not(.p-button-text):not(.p-button-link):not(.p-button-outlined):not(:disabled):active { background: var(--${prefix}-button-danger-active-background); border-color: var(--${prefix}-button-danger-active-background); }
.p-button.p-button-help:not(.p-button-text):not(.p-button-link):not(.p-button-outlined):not(:disabled):active { background: var(--${prefix}-button-help-active-background); border-color: var(--${prefix}-button-help-active-background); }

.p-selectbutton.p-button-group.p-component > .p-button:not(.p-highlight) {
    background: var(--${prefix}-select-button-button-background);
    border-color: var(--${prefix}-select-button-button-border-color);
    color: var(--${prefix}-select-button-button-color);
}

.p-togglebutton.p-component:not(.p-highlight) .p-button {
    background: var(--${prefix}-toggle-button-root-background);
    border-color: var(--${prefix}-toggle-button-root-border-color);
    color: var(--${prefix}-toggle-button-root-color);
}

.p-selectbutton.p-button-group.p-component > .p-button:not(.p-disabled):not(.p-highlight):hover {
    background: var(--${prefix}-select-button-button-hover-background);
    border-color: var(--${prefix}-select-button-button-hover-border-color);
}

.p-togglebutton.p-component:not(.p-disabled):has(.p-togglebutton-input:hover):not(.p-highlight) .p-button {
    background: var(--${prefix}-toggle-button-root-hover-background);
    border-color: var(--${prefix}-toggle-button-root-hover-border-color);
}

.p-selectbutton.p-button-group.p-component > .p-button.p-highlight {
    background: var(--${prefix}-select-button-button-selected-background);
    border-color: var(--${prefix}-select-button-button-selected-border-color);
    color: var(--${prefix}-select-button-button-selected-color);
}

.p-togglebutton.p-component.p-highlight .p-button {
    background: var(--${prefix}-toggle-button-root-selected-background);
    border-color: var(--${prefix}-toggle-button-root-selected-border-color);
    color: var(--${prefix}-toggle-button-root-selected-color);
}

.p-selectbutton.p-button-group.p-component > .p-button.p-highlight:not(.p-disabled):hover {
    background: var(--${prefix}-select-button-button-selected-hover-background);
    border-color: var(--${prefix}-select-button-button-selected-hover-border-color);
}

.p-togglebutton.p-component:not(.p-disabled):has(.p-togglebutton-input:hover).p-highlight .p-button {
    background: var(--${prefix}-toggle-button-root-selected-hover-background);
    border-color: var(--${prefix}-toggle-button-root-selected-hover-border-color);
}

.p-selectbutton.p-button-group.p-component > .p-button.p-focus {
    border-color: var(--${prefix}-select-button-button-focus-border-color);
    box-shadow: 0 0 0 1px var(--${prefix}-select-button-button-focus-border-color);
    outline: 0;
}

.p-togglebutton.p-component:not(.p-disabled):has(.p-togglebutton-input:focus-visible) .p-button {
    border-color: var(--${prefix}-toggle-button-root-focus-border-color);
    box-shadow: 0 0 0 1px var(--${prefix}-toggle-button-root-focus-border-color);
    outline: 0;
}

.p-selectbutton.p-invalid > .p-button {
    border-color: var(--${prefix}-select-button-button-invalid-border-color);
}

.p-togglebutton.p-invalid > .p-button {
    border-color: var(--${prefix}-toggle-button-root-invalid-border-color);
}

.p-inputtext {
    background: var(--${prefix}-inputtext-root-background);
    border: 1px solid var(--${prefix}-inputtext-root-border-color);
    border-radius: var(--${prefix}-inputtext-root-border-radius);
    color: var(--${prefix}-inputtext-root-color);
    padding: var(--${prefix}-inputtext-root-padding-y) var(--${prefix}-inputtext-root-padding-x);
    transition: border-color var(--${prefix}-transition-duration);
}

.p-inputtext:enabled:hover {
    border-color: var(--${prefix}-inputtext-root-hover-border-color);
}

.p-inputtext:enabled:focus {
    border-color: var(--${prefix}-inputtext-root-focus-border-color);
    box-shadow: 0 0 0 1px var(--${prefix}-inputtext-root-focus-border-color);
    outline: 0;
}

.p-inputtext::placeholder {
    color: var(--${prefix}-inputtext-root-placeholder-color);
}

.p-inputtext.p-invalid,
.p-inputtext.p-invalid:enabled:hover,
.p-inputtext.p-invalid:enabled:focus {
    border-color: var(--${prefix}-inputtext-root-invalid-border-color);
}

.p-inputtext.p-variant-filled,
.p-input-filled .p-inputtext {
    background: var(--${prefix}-inputtext-root-filled-background);
}

.p-inputtext:disabled,
.p-inputtext.p-disabled {
    opacity: var(--${prefix}-inputtext-root-disabled-opacity);
}

.p-dropdown {
    background: var(--${prefix}-dropdown-root-background);
    border: 1px solid var(--${prefix}-dropdown-root-border-color);
    border-radius: var(--${prefix}-dropdown-root-border-radius);
    color: var(--${prefix}-dropdown-root-color);
}

.p-dropdown:not(.p-disabled):hover {
    border-color: var(--${prefix}-dropdown-root-hover-border-color);
}

.p-dropdown:not(.p-disabled).p-focus {
    border-color: var(--${prefix}-dropdown-root-focus-border-color);
    box-shadow: 0 0 0 1px var(--${prefix}-dropdown-root-focus-border-color);
    outline: 0;
}

.p-dropdown.p-variant-filled {
    background: var(--${prefix}-dropdown-root-filled-background);
}

.p-dropdown.p-invalid {
    border-color: var(--${prefix}-dropdown-root-invalid-border-color);
}

.p-dropdown.p-disabled {
    opacity: var(--${prefix}-dropdown-root-disabled-opacity);
}

.p-dropdown .p-dropdown-label {
    color: var(--${prefix}-dropdown-label-color);
}

.p-dropdown .p-dropdown-label.p-placeholder {
    color: var(--${prefix}-dropdown-label-placeholder-color);
}

.p-dropdown .p-dropdown-trigger,
.p-dropdown .p-dropdown-clear-icon,
.p-dropdown-panel .p-dropdown-filter-icon {
    color: var(--${prefix}-dropdown-trigger-color);
}

.p-dropdown-panel {
    background: var(--${prefix}-dropdown-panel-background);
    border-color: var(--${prefix}-dropdown-panel-border-color);
    color: var(--${prefix}-dropdown-panel-color);
}

.p-dropdown-panel .p-dropdown-header {
    background: var(--${prefix}-dropdown-panel-background);
    border-color: var(--${prefix}-dropdown-panel-border-color);
    color: var(--${prefix}-dropdown-panel-color);
}

.p-dropdown-panel .p-dropdown-items .p-dropdown-item,
.p-dropdown-panel .p-dropdown-items .p-dropdown-empty-message {
    color: var(--${prefix}-dropdown-option-color);
}

.p-dropdown-panel .p-dropdown-items .p-dropdown-item:not(.p-highlight):not(.p-disabled).p-focus {
    background: var(--${prefix}-dropdown-option-focus-background);
    color: var(--${prefix}-dropdown-option-color);
}

.p-dropdown-panel .p-dropdown-items .p-dropdown-item.p-highlight {
    background: var(--${prefix}-dropdown-option-selected-background);
    color: var(--${prefix}-dropdown-option-color);
}

.p-dropdown-panel .p-dropdown-items .p-dropdown-item.p-highlight.p-focus {
    background: var(--${prefix}-dropdown-option-selected-focus-background);
}

.p-checkbox .p-checkbox-box {
    background: var(--${prefix}-checkbox-root-background);
    border: 2px solid var(--${prefix}-checkbox-root-border-color);
    color: var(--${prefix}-checkbox-root-color);
    height: var(--${prefix}-checkbox-root-height);
    transition: background var(--${prefix}-transition-duration), border-color var(--${prefix}-transition-duration), box-shadow var(--${prefix}-transition-duration);
    width: var(--${prefix}-checkbox-root-width);
    border-radius: var(--${prefix}-checkbox-root-border-radius);
}

.p-radiobutton .p-radiobutton-box {
    background: var(--${prefix}-radiobutton-root-background);
    border: 2px solid var(--${prefix}-radiobutton-root-border-color);
    color: var(--${prefix}-radiobutton-root-color);
    border-radius: var(--${prefix}-radiobutton-root-border-radius);
    height: var(--${prefix}-radiobutton-root-height);
    transition: background var(--${prefix}-transition-duration), border-color var(--${prefix}-transition-duration), box-shadow var(--${prefix}-transition-duration);
    width: var(--${prefix}-radiobutton-root-width);
}

.p-checkbox.p-highlight .p-checkbox-box {
    background: var(--${prefix}-checkbox-root-checked-background);
    border-color: var(--${prefix}-checkbox-root-checked-border-color);
    color: var(--${prefix}-checkbox-root-checked-color);
}

.p-radiobutton.p-highlight .p-radiobutton-box {
    background: var(--${prefix}-radiobutton-root-checked-background);
    border-color: var(--${prefix}-radiobutton-root-checked-border-color);
    color: var(--${prefix}-radiobutton-root-checked-color);
}

.p-checkbox:not(.p-disabled):has(.p-checkbox-input:hover):not(.p-highlight) .p-checkbox-box {
    border-color: var(--${prefix}-checkbox-root-hover-border-color);
}

.p-checkbox:not(.p-disabled):has(.p-checkbox-input:hover).p-highlight .p-checkbox-box {
    background: var(--${prefix}-checkbox-root-checked-hover-background);
    border-color: var(--${prefix}-checkbox-root-checked-hover-border-color);
}

.p-radiobutton:not(.p-disabled):has(.p-radiobutton-input:hover):not(.p-highlight) .p-radiobutton-box {
    border-color: var(--${prefix}-radiobutton-root-hover-border-color);
}

.p-radiobutton:not(.p-disabled):has(.p-radiobutton-input:hover).p-highlight .p-radiobutton-box {
    background: var(--${prefix}-radiobutton-root-checked-hover-background);
    border-color: var(--${prefix}-radiobutton-root-checked-hover-border-color);
}

.p-checkbox:not(.p-disabled):has(.p-checkbox-input:focus-visible) .p-checkbox-box {
    border-color: var(--${prefix}-checkbox-root-focus-border-color);
    box-shadow: 0 0 0 1px var(--${prefix}-checkbox-root-focus-border-color);
    outline: 0;
}

.p-radiobutton:not(.p-disabled):has(.p-radiobutton-input:focus-visible) .p-radiobutton-box {
    border-color: var(--${prefix}-radiobutton-root-focus-border-color);
    box-shadow: 0 0 0 1px var(--${prefix}-radiobutton-root-focus-border-color);
    outline: 0;
}

.p-checkbox.p-invalid .p-checkbox-box { border-color: var(--${prefix}-checkbox-root-invalid-border-color); }
.p-radiobutton.p-invalid .p-radiobutton-box { border-color: var(--${prefix}-radiobutton-root-invalid-border-color); }

.p-checkbox.p-disabled,
.p-radiobutton.p-disabled,
.p-inputswitch.p-disabled {
    opacity: var(--${prefix}-disabled-opacity);
}

.p-inputswitch {
    height: var(--${prefix}-inputswitch-root-height);
    width: var(--${prefix}-inputswitch-root-width);
}

.p-inputswitch .p-inputswitch-slider {
    background: var(--${prefix}-inputswitch-root-background);
    border-radius: var(--${prefix}-inputswitch-root-border-radius);
    transition: background var(--${prefix}-transition-duration), box-shadow var(--${prefix}-transition-duration);
}

.p-inputswitch .p-inputswitch-slider:before {
    background: var(--${prefix}-inputswitch-root-handle-background);
}

.p-inputswitch.p-highlight .p-inputswitch-slider {
    background: var(--${prefix}-inputswitch-root-checked-background);
}

.p-inputswitch.p-highlight .p-inputswitch-slider:before {
    background: var(--${prefix}-inputswitch-root-checked-handle-background);
}

.p-inputswitch:not(.p-disabled):has(.p-inputswitch-input:hover):not(.p-highlight) .p-inputswitch-slider {
    background: var(--${prefix}-inputswitch-root-hover-background);
}

.p-inputswitch:not(.p-disabled):has(.p-inputswitch-input:hover).p-highlight .p-inputswitch-slider {
    background: var(--${prefix}-inputswitch-root-checked-hover-background);
}

.p-inputswitch:not(.p-disabled):has(.p-inputswitch-input:focus-visible) .p-inputswitch-slider {
    border-color: var(--${prefix}-inputswitch-root-focus-border-color);
    box-shadow: 0 0 0 1px var(--${prefix}-inputswitch-root-focus-border-color);
    outline: 0;
}

.p-inputswitch.p-invalid .p-inputswitch-slider { border-color: var(--${prefix}-inputswitch-root-invalid-border-color); }
`;
    }
};
