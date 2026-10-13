const surfaceTokens = (overrides = {}) => ({
    background: '{surface.card}',
    borderColor: '{surface.border}',
    borderWidth: '1px',
    borderRadius: '{formField.borderRadius}',
    color: '{text.color}',
    ...overrides
});

export const auraContainerComponents = {
    accordion: {
        root: {
            background: '{surface.card}',
            borderColor: '{surface.border}',
            borderRadius: '{formField.borderRadius}',
            color: '{text.color}',
            gap: '0.25rem',
            disabledOpacity: '{disabledOpacity}',
            transitionDuration: '{transitionDuration}'
        },
        header: {
            background: '{accordion.root.background}',
            color: '{accordion.root.color}',
            borderColor: '{accordion.root.borderColor}',
            borderRadius: '{accordion.root.borderRadius}',
            hoverBackground: 'color-mix(in srgb, {text.color}, transparent 96%)',
            hoverColor: '{text.color}',
            activeBackground: '{accordion.root.background}',
            activeColor: '{primary.color}',
            activeHoverBackground: 'color-mix(in srgb, {primary.color}, transparent 94%)',
            activeHoverColor: '{primary.hoverColor}',
            padding: '1.25rem',
            gap: '0.5rem',
            fontWeight: '600',
            focusShadow: '0 0 0 {focusRing.width} {focusRing.color}'
        },
        icon: {
            color: '{text.mutedColor}',
            activeColor: '{primary.color}'
        },
        content: {
            background: '{accordion.root.background}',
            borderColor: '{accordion.root.borderColor}',
            borderRadius: '{accordion.root.borderRadius}',
            color: '{accordion.root.color}',
            padding: '1.25rem'
        }
    },
    card: {
        root: surfaceTokens({ shadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }),
        header: {
            background: '{card.root.background}',
            color: '{card.root.color}',
            borderRadius: '{card.root.borderRadius}'
        },
        body: {
            padding: '1.25rem'
        },
        title: {
            color: '{card.root.color}',
            fontSize: '1.5rem',
            fontWeight: '600',
            marginBottom: '0.5rem'
        },
        subtitle: {
            color: '{text.mutedColor}',
            fontSize: '1rem',
            fontWeight: '400',
            marginBottom: '0.5rem'
        },
        content: {
            color: '{card.root.color}',
            paddingY: '1.25rem'
        },
        footer: {
            color: '{card.root.color}',
            paddingTop: '1.25rem'
        }
    },
    divider: {
        root: {
            borderColor: '{surface.border}',
            borderWidth: '1px',
            horizontalMargin: '1rem 0',
            verticalMargin: '0 1rem'
        },
        content: {
            background: '{surface.card}',
            color: '{text.color}',
            horizontalPadding: '0 0.5rem',
            verticalPadding: '0.5rem 0'
        }
    },
    fieldset: {
        root: surfaceTokens({ padding: '0 1rem 1rem', transitionDuration: '{transitionDuration}' }),
        legend: {
            background: '{fieldset.root.background}',
            borderColor: '{fieldset.root.borderColor}',
            borderRadius: '{fieldset.root.borderRadius}',
            color: '{fieldset.root.color}',
            hoverBackground: 'color-mix(in srgb, {text.color}, transparent 96%)',
            hoverColor: '{text.color}',
            expandedBackground: '{fieldset.root.background}',
            expandedColor: '{fieldset.root.color}',
            padding: '0.75rem',
            gap: '0.5rem',
            fontWeight: '600',
            focusShadow: '0 0 0 {focusRing.width} {focusRing.color}'
        },
        icon: {
            color: '{text.mutedColor}',
            expandedColor: '{primary.color}'
        },
        content: {
            color: '{fieldset.root.color}',
            padding: '1rem 0 0'
        }
    },
    panel: {
        root: surfaceTokens(),
        header: {
            background: '{panel.root.background}',
            borderColor: '{panel.root.borderColor}',
            color: '{panel.root.color}',
            borderRadius: '{panel.root.borderRadius}',
            padding: '1.25rem',
            gap: '1rem'
        },
        title: {
            color: '{panel.header.color}',
            fontWeight: '600'
        },
        icons: {
            gap: '0.5rem'
        },
        toggler: {
            background: 'transparent',
            color: '{text.mutedColor}',
            hoverBackground: 'color-mix(in srgb, {text.color}, transparent 94%)',
            hoverColor: '{text.color}',
            expandedColor: '{primary.color}',
            borderRadius: '50%',
            size: '2rem',
            disabledOpacity: '{disabledOpacity}',
            focusShadow: '0 0 0 {focusRing.width} {focusRing.color}',
            transitionDuration: '{transitionDuration}'
        },
        content: {
            background: '{panel.root.background}',
            color: '{panel.root.color}',
            padding: '1.25rem'
        },
        footer: {
            background: '{panel.root.background}',
            borderColor: '{panel.root.borderColor}',
            color: '{panel.root.color}',
            padding: '1.25rem'
        }
    },
    scrollpanel: {
        root: {
            background: '{surface.card}',
            color: '{text.color}',
            borderRadius: '{formField.borderRadius}'
        },
        wrapper: {
            borderRadius: '{scrollpanel.root.borderRadius}'
        },
        content: {
            color: '{scrollpanel.root.color}'
        },
        bar: {
            background: 'color-mix(in srgb, {text.color}, transparent 70%)',
            hoverBackground: 'color-mix(in srgb, {text.color}, transparent 50%)',
            activeBackground: '{primary.color}',
            borderRadius: '{formField.borderRadius}',
            opacity: '0',
            hoverOpacity: '1',
            activeOpacity: '1',
            focusShadow: '0 0 0 {focusRing.width} {focusRing.color}',
            transitionDuration: '{transitionDuration}'
        }
    },
    splitter: {
        root: surfaceTokens(),
        panel: {
            background: '{splitter.root.background}',
            color: '{splitter.root.color}'
        },
        gutter: {
            background: '{surface.ground}',
            hoverBackground: 'color-mix(in srgb, {text.color}, transparent 94%)',
            activeBackground: 'color-mix(in srgb, {primary.color}, transparent 90%)',
            transitionDuration: '{transitionDuration}'
        },
        handle: {
            background: '{text.mutedColor}',
            hoverBackground: '{primary.color}',
            activeBackground: '{primary.hoverColor}',
            focusBackground: '{primary.color}',
            borderRadius: '{formField.borderRadius}',
            length: '24px',
            focusShadow: '0 0 0 {focusRing.width} {focusRing.color}'
        }
    },
    tabview: {
        root: {
            color: '{text.color}',
            borderRadius: '{formField.borderRadius}'
        },
        nav: {
            background: '{surface.card}',
            borderColor: '{surface.border}',
            borderWidth: '2px',
            padding: '0',
            gap: '0'
        },
        header: {
            background: 'transparent',
            borderColor: 'transparent',
            borderRadius: '{tabview.root.borderRadius}',
            color: '{text.mutedColor}',
            hoverBackground: 'color-mix(in srgb, {text.color}, transparent 96%)',
            hoverColor: '{text.color}',
            selectedBackground: 'transparent',
            selectedBorderColor: '{primary.color}',
            selectedColor: '{primary.color}',
            padding: '1.25rem',
            gap: '0.5rem',
            fontWeight: '600',
            disabledOpacity: '{disabledOpacity}',
            focusShadow: '0 0 0 {focusRing.width} {focusRing.color}',
            transitionDuration: '{transitionDuration}'
        },
        closeIcon: {
            color: '{text.mutedColor}',
            hoverColor: '{text.color}',
            focusShadow: '0 0 0 {focusRing.width} {focusRing.color}'
        },
        inkbar: {
            background: '{primary.color}',
            height: '2px',
            transitionDuration: '{transitionDuration}'
        },
        panels: {
            background: '{surface.card}',
            color: '{tabview.root.color}',
            borderRadius: '{tabview.root.borderRadius}',
            padding: '1.25rem'
        },
        navButton: {
            background: '{surface.card}',
            color: '{text.mutedColor}',
            hoverBackground: 'color-mix(in srgb, {text.color}, transparent 94%)',
            hoverColor: '{primary.color}',
            width: '3rem',
            focusShadow: '0 0 0 {focusRing.width} {focusRing.color}'
        }
    },
    toolbar: {
        root: surfaceTokens({ padding: '1.25rem', gap: '0.5rem' }),
        start: { gap: '0.5rem' },
        center: { gap: '0.5rem' },
        end: { gap: '0.5rem' }
    }
};

const surfaceCss = ({ prefix, component, selector }) => `
${selector} {
    background: var(--${prefix}-${component}-root-background);
    border: var(--${prefix}-${component}-root-border-width) solid var(--${prefix}-${component}-root-border-color);
    border-radius: var(--${prefix}-${component}-root-border-radius);
    color: var(--${prefix}-${component}-root-color);
}
`;

/** Flat skin rules leave resize, scroll and active-tab geometry to the components. */
export const auraContainerCss = ({ prefix = 'mantle' } = {}) => `
.p-accordion {
    color: var(--${prefix}-accordion-root-color);
}

.p-accordion > .p-accordion-tab + .p-accordion-tab {
    margin-top: var(--${prefix}-accordion-root-gap);
}

.p-accordion > .p-accordion-tab > .p-accordion-header > .p-accordion-header-link {
    background: var(--${prefix}-accordion-header-background);
    border: 1px solid var(--${prefix}-accordion-header-border-color);
    border-radius: var(--${prefix}-accordion-header-border-radius);
    color: var(--${prefix}-accordion-header-color);
    font-weight: var(--${prefix}-accordion-header-font-weight);
    gap: var(--${prefix}-accordion-header-gap);
    padding: var(--${prefix}-accordion-header-padding);
    transition: background var(--${prefix}-accordion-root-transition-duration), color var(--${prefix}-accordion-root-transition-duration), box-shadow var(--${prefix}-accordion-root-transition-duration);
}

.p-accordion > .p-accordion-tab > .p-accordion-header:not(.p-disabled) > .p-accordion-header-link:hover {
    background: var(--${prefix}-accordion-header-hover-background);
    color: var(--${prefix}-accordion-header-hover-color);
}

.p-accordion > .p-accordion-tab > .p-accordion-header.p-highlight > .p-accordion-header-link {
    background: var(--${prefix}-accordion-header-active-background);
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    color: var(--${prefix}-accordion-header-active-color);
}

.p-accordion > .p-accordion-tab > .p-accordion-header.p-highlight:not(.p-disabled) > .p-accordion-header-link:hover {
    background: var(--${prefix}-accordion-header-active-hover-background);
    color: var(--${prefix}-accordion-header-active-hover-color);
}

.p-accordion > .p-accordion-tab > .p-accordion-header:not(.p-disabled) > .p-accordion-header-link:focus-visible {
    box-shadow: var(--${prefix}-accordion-header-focus-shadow);
    outline: 0;
}

.p-accordion > .p-accordion-tab > .p-accordion-header.p-disabled {
    opacity: var(--${prefix}-accordion-root-disabled-opacity);
    pointer-events: none;
}

.p-accordion > .p-accordion-tab > .p-accordion-header .p-accordion-toggle-icon {
    color: var(--${prefix}-accordion-icon-color);
}

.p-accordion > .p-accordion-tab > .p-accordion-header.p-highlight .p-accordion-toggle-icon {
    color: var(--${prefix}-accordion-icon-active-color);
}

.p-accordion > .p-accordion-tab > .p-toggleable-content > .p-accordion-content {
    background: var(--${prefix}-accordion-content-background);
    border: 1px solid var(--${prefix}-accordion-content-border-color);
    border-top: 0;
    border-radius: 0 0 var(--${prefix}-accordion-content-border-radius) var(--${prefix}-accordion-content-border-radius);
    color: var(--${prefix}-accordion-content-color);
    padding: var(--${prefix}-accordion-content-padding);
}

${surfaceCss({ prefix, component: 'card', selector: '.p-card' })}

.p-card {
    box-shadow: var(--${prefix}-card-root-shadow);
}

.p-card > .p-card-header {
    background: var(--${prefix}-card-header-background);
    border-radius: var(--${prefix}-card-header-border-radius) var(--${prefix}-card-header-border-radius) 0 0;
    color: var(--${prefix}-card-header-color);
}

.p-card > .p-card-header > img {
    border-top-left-radius: inherit;
    border-top-right-radius: inherit;
}

.p-card > .p-card-body {
    padding: var(--${prefix}-card-body-padding);
}

.p-card > .p-card-body > .p-card-title {
    color: var(--${prefix}-card-title-color);
    font-size: var(--${prefix}-card-title-font-size);
    font-weight: var(--${prefix}-card-title-font-weight);
    margin-bottom: var(--${prefix}-card-title-margin-bottom);
}

.p-card > .p-card-body > .p-card-subtitle {
    color: var(--${prefix}-card-subtitle-color);
    font-size: var(--${prefix}-card-subtitle-font-size);
    font-weight: var(--${prefix}-card-subtitle-font-weight);
    margin-bottom: var(--${prefix}-card-subtitle-margin-bottom);
}

.p-card > .p-card-body > .p-card-content {
    color: var(--${prefix}-card-content-color);
    padding: var(--${prefix}-card-content-padding-y) 0;
}

.p-card > .p-card-body > .p-card-footer {
    color: var(--${prefix}-card-footer-color);
    padding-top: var(--${prefix}-card-footer-padding-top);
}

.p-divider.p-divider-horizontal {
    margin: var(--${prefix}-divider-root-horizontal-margin);
}

.p-divider.p-divider-vertical {
    margin: var(--${prefix}-divider-root-vertical-margin);
}

.p-divider.p-divider-horizontal::before {
    border-top-width: var(--${prefix}-divider-root-border-width);
    border-top-color: var(--${prefix}-divider-root-border-color);
}

.p-divider.p-divider-vertical::before {
    border-left-width: var(--${prefix}-divider-root-border-width);
    border-left-color: var(--${prefix}-divider-root-border-color);
}

.p-divider.p-divider-horizontal.p-divider-solid::before { border-top-style: solid; }
.p-divider.p-divider-horizontal.p-divider-dashed::before { border-top-style: dashed; }
.p-divider.p-divider-horizontal.p-divider-dotted::before { border-top-style: dotted; }
.p-divider.p-divider-vertical.p-divider-solid::before { border-left-style: solid; }
.p-divider.p-divider-vertical.p-divider-dashed::before { border-left-style: dashed; }
.p-divider.p-divider-vertical.p-divider-dotted::before { border-left-style: dotted; }

.p-divider > .p-divider-content {
    background: var(--${prefix}-divider-content-background);
    color: var(--${prefix}-divider-content-color);
}

.p-divider.p-divider-horizontal > .p-divider-content {
    padding: var(--${prefix}-divider-content-horizontal-padding);
}

.p-divider.p-divider-vertical > .p-divider-content {
    padding: var(--${prefix}-divider-content-vertical-padding);
}

.p-divider > .p-divider-content:empty {
    background: transparent;
    padding: 0;
}

${surfaceCss({ prefix, component: 'fieldset', selector: '.p-fieldset' })}

.p-fieldset {
    padding: var(--${prefix}-fieldset-root-padding);
}

.p-fieldset > .p-fieldset-legend {
    background: var(--${prefix}-fieldset-legend-background);
    border: 1px solid var(--${prefix}-fieldset-legend-border-color);
    border-radius: var(--${prefix}-fieldset-legend-border-radius);
    color: var(--${prefix}-fieldset-legend-color);
    font-weight: var(--${prefix}-fieldset-legend-font-weight);
    padding: 0;
}

.p-fieldset > .p-fieldset-legend > a,
.p-fieldset > .p-fieldset-legend > .p-fieldset-legend-text {
    border-radius: inherit;
    color: inherit;
    gap: var(--${prefix}-fieldset-legend-gap);
    padding: var(--${prefix}-fieldset-legend-padding);
    transition: background var(--${prefix}-fieldset-root-transition-duration), color var(--${prefix}-fieldset-root-transition-duration), box-shadow var(--${prefix}-fieldset-root-transition-duration);
}

.p-fieldset.p-fieldset-toggleable > .p-fieldset-legend > a[aria-expanded="true"] {
    background: var(--${prefix}-fieldset-legend-expanded-background);
    color: var(--${prefix}-fieldset-legend-expanded-color);
}

.p-fieldset.p-fieldset-toggleable > .p-fieldset-legend > a:hover {
    background: var(--${prefix}-fieldset-legend-hover-background);
    color: var(--${prefix}-fieldset-legend-hover-color);
}

.p-fieldset.p-fieldset-toggleable > .p-fieldset-legend > a[aria-expanded="true"]:hover {
    background: var(--${prefix}-fieldset-legend-hover-background);
    color: var(--${prefix}-fieldset-legend-hover-color);
}

.p-fieldset.p-fieldset-toggleable > .p-fieldset-legend > a:focus-visible {
    box-shadow: var(--${prefix}-fieldset-legend-focus-shadow);
    outline: 0;
}

.p-fieldset > .p-fieldset-legend .p-fieldset-toggler {
    color: var(--${prefix}-fieldset-icon-color);
}

.p-fieldset > .p-fieldset-legend > a[aria-expanded="true"] .p-fieldset-toggler {
    color: var(--${prefix}-fieldset-icon-expanded-color);
}

.p-fieldset > .p-toggleable-content > .p-fieldset-content {
    color: var(--${prefix}-fieldset-content-color);
    padding: var(--${prefix}-fieldset-content-padding);
}

${surfaceCss({ prefix, component: 'panel', selector: '.p-panel' })}

.p-panel > .p-panel-header {
    background: var(--${prefix}-panel-header-background);
    border-bottom: 1px solid var(--${prefix}-panel-header-border-color);
    border-radius: var(--${prefix}-panel-header-border-radius) var(--${prefix}-panel-header-border-radius) 0 0;
    color: var(--${prefix}-panel-header-color);
    gap: var(--${prefix}-panel-header-gap);
    padding: var(--${prefix}-panel-header-padding);
}

.p-panel > .p-panel-header > .p-panel-title {
    color: var(--${prefix}-panel-title-color);
    font-weight: var(--${prefix}-panel-title-font-weight);
}

.p-panel > .p-panel-header > .p-panel-icons {
    display: inline-flex;
    align-items: center;
    gap: var(--${prefix}-panel-icons-gap);
}

.p-panel .p-panel-toggler.p-panel-header-icon {
    background: var(--${prefix}-panel-toggler-background);
    border: 0;
    border-radius: var(--${prefix}-panel-toggler-border-radius);
    color: var(--${prefix}-panel-toggler-color);
    height: var(--${prefix}-panel-toggler-size);
    width: var(--${prefix}-panel-toggler-size);
    padding: 0;
    transition: background var(--${prefix}-panel-toggler-transition-duration), color var(--${prefix}-panel-toggler-transition-duration), box-shadow var(--${prefix}-panel-toggler-transition-duration);
}

.p-panel .p-panel-toggler.p-panel-header-icon[aria-expanded="true"] {
    color: var(--${prefix}-panel-toggler-expanded-color);
}

.p-panel .p-panel-toggler.p-panel-header-icon:enabled:hover,
.p-panel .p-panel-toggler.p-panel-header-icon[aria-expanded="true"]:enabled:hover {
    background: var(--${prefix}-panel-toggler-hover-background);
    color: var(--${prefix}-panel-toggler-hover-color);
}

.p-panel .p-panel-toggler.p-panel-header-icon:enabled:focus-visible {
    box-shadow: var(--${prefix}-panel-toggler-focus-shadow);
    outline: 0;
}

.p-panel .p-panel-toggler.p-panel-header-icon:disabled {
    opacity: var(--${prefix}-panel-toggler-disabled-opacity);
}

.p-panel > .p-toggleable-content > .p-panel-content {
    background: var(--${prefix}-panel-content-background);
    color: var(--${prefix}-panel-content-color);
    padding: var(--${prefix}-panel-content-padding);
}

.p-panel > .p-toggleable-content:last-child > .p-panel-content {
    border-bottom-left-radius: var(--${prefix}-panel-root-border-radius);
    border-bottom-right-radius: var(--${prefix}-panel-root-border-radius);
}

.p-panel > .p-panel-footer {
    background: var(--${prefix}-panel-footer-background);
    border-top: 1px solid var(--${prefix}-panel-footer-border-color);
    border-radius: 0 0 var(--${prefix}-panel-root-border-radius) var(--${prefix}-panel-root-border-radius);
    color: var(--${prefix}-panel-footer-color);
    padding: var(--${prefix}-panel-footer-padding);
}

.p-scrollpanel {
    background: var(--${prefix}-scrollpanel-root-background);
    border-radius: var(--${prefix}-scrollpanel-root-border-radius);
    color: var(--${prefix}-scrollpanel-root-color);
}

.p-scrollpanel > .p-scrollpanel-wrapper {
    border-radius: var(--${prefix}-scrollpanel-wrapper-border-radius);
}

.p-scrollpanel > .p-scrollpanel-wrapper > .p-scrollpanel-content {
    color: var(--${prefix}-scrollpanel-content-color);
}

.p-scrollpanel > .p-scrollpanel-bar {
    background: var(--${prefix}-scrollpanel-bar-background);
    border-radius: var(--${prefix}-scrollpanel-bar-border-radius);
    opacity: var(--${prefix}-scrollpanel-bar-opacity);
    transition: opacity var(--${prefix}-scrollpanel-bar-transition-duration) linear, background var(--${prefix}-scrollpanel-bar-transition-duration), box-shadow var(--${prefix}-scrollpanel-bar-transition-duration);
}

.p-scrollpanel:hover > .p-scrollpanel-bar,
.p-scrollpanel:focus-within > .p-scrollpanel-bar {
    opacity: var(--${prefix}-scrollpanel-bar-hover-opacity);
}

.p-scrollpanel > .p-scrollpanel-bar:hover {
    background: var(--${prefix}-scrollpanel-bar-hover-background);
}

.p-scrollpanel > .p-scrollpanel-bar.p-scrollpanel-grabbed,
.p-scrollpanel > .p-scrollpanel-bar:active {
    background: var(--${prefix}-scrollpanel-bar-active-background);
    opacity: var(--${prefix}-scrollpanel-bar-active-opacity);
}

.p-scrollpanel > .p-scrollpanel-bar:focus-visible {
    box-shadow: var(--${prefix}-scrollpanel-bar-focus-shadow);
    opacity: var(--${prefix}-scrollpanel-bar-active-opacity);
    outline: 0;
}

${surfaceCss({ prefix, component: 'splitter', selector: '.p-splitter' })}

.p-splitter > .p-splitter-panel {
    background: var(--${prefix}-splitter-panel-background);
    color: var(--${prefix}-splitter-panel-color);
}

.p-splitter-panel .p-splitter {
    border: 0;
}

.p-splitter > .p-splitter-gutter {
    background: var(--${prefix}-splitter-gutter-background);
    transition: background var(--${prefix}-splitter-gutter-transition-duration);
}

.p-splitter > .p-splitter-gutter:hover {
    background: var(--${prefix}-splitter-gutter-hover-background);
}

.p-splitter > .p-splitter-gutter.p-splitter-gutter-resizing,
.p-splitter > .p-splitter-gutter[data-p-splitter-gutter-resizing="true"] {
    background: var(--${prefix}-splitter-gutter-active-background);
}

.p-splitter > .p-splitter-gutter > .p-splitter-gutter-handle {
    background: var(--${prefix}-splitter-handle-background);
    border-radius: var(--${prefix}-splitter-handle-border-radius);
}

.p-splitter > .p-splitter-gutter:hover > .p-splitter-gutter-handle {
    background: var(--${prefix}-splitter-handle-hover-background);
}

.p-splitter > .p-splitter-gutter.p-splitter-gutter-resizing > .p-splitter-gutter-handle,
.p-splitter > .p-splitter-gutter[data-p-splitter-gutter-resizing="true"] > .p-splitter-gutter-handle {
    background: var(--${prefix}-splitter-handle-active-background);
}

.p-splitter > .p-splitter-gutter > .p-splitter-gutter-handle:focus-visible {
    background: var(--${prefix}-splitter-handle-focus-background);
    box-shadow: var(--${prefix}-splitter-handle-focus-shadow);
    outline: 0;
}

.p-splitter.p-splitter-horizontal > .p-splitter-gutter > .p-splitter-gutter-handle {
    height: var(--${prefix}-splitter-handle-length);
}

.p-splitter.p-splitter-vertical > .p-splitter-gutter > .p-splitter-gutter-handle {
    width: var(--${prefix}-splitter-handle-length);
}

.p-tabview {
    color: var(--${prefix}-tabview-root-color);
}

.p-tabview > .p-tabview-nav-container {
    position: relative;
}

.p-tabview > .p-tabview-nav-container > .p-tabview-nav-content {
    overflow: hidden;
}

.p-tabview.p-tabview-scrollable > .p-tabview-nav-container > .p-tabview-nav-content {
    overflow-x: auto;
    scrollbar-width: none;
}

.p-tabview.p-tabview-scrollable > .p-tabview-nav-container > .p-tabview-nav-content::-webkit-scrollbar {
    display: none;
}

.p-tabview .p-tabview-nav {
    background: var(--${prefix}-tabview-nav-background);
    border: 0;
    border-bottom: var(--${prefix}-tabview-nav-border-width) solid var(--${prefix}-tabview-nav-border-color);
    border-radius: var(--${prefix}-tabview-root-border-radius) var(--${prefix}-tabview-root-border-radius) 0 0;
    display: flex;
    flex-wrap: wrap;
    gap: var(--${prefix}-tabview-nav-gap);
    list-style: none;
    margin: 0;
    padding: var(--${prefix}-tabview-nav-padding);
    position: relative;
}

.p-tabview.p-tabview-scrollable .p-tabview-nav {
    flex-wrap: nowrap;
}

.p-tabview .p-tabview-nav > li > .p-tabview-nav-link {
    background: var(--${prefix}-tabview-header-background);
    border: 0 solid var(--${prefix}-tabview-header-border-color);
    border-bottom-width: var(--${prefix}-tabview-nav-border-width);
    border-radius: var(--${prefix}-tabview-header-border-radius) var(--${prefix}-tabview-header-border-radius) 0 0;
    color: var(--${prefix}-tabview-header-color);
    cursor: pointer;
    display: flex;
    align-items: center;
    font-weight: var(--${prefix}-tabview-header-font-weight);
    gap: var(--${prefix}-tabview-header-gap);
    margin-bottom: calc(-1 * var(--${prefix}-tabview-nav-border-width));
    padding: var(--${prefix}-tabview-header-padding);
    text-decoration: none;
    white-space: nowrap;
    transition: background var(--${prefix}-tabview-header-transition-duration), color var(--${prefix}-tabview-header-transition-duration), box-shadow var(--${prefix}-tabview-header-transition-duration);
}

.p-tabview .p-tabview-nav > li:not(.p-disabled) > .p-tabview-nav-link:hover {
    background: var(--${prefix}-tabview-header-hover-background);
    color: var(--${prefix}-tabview-header-hover-color);
}

.p-tabview .p-tabview-nav > li.p-highlight > .p-tabview-nav-link,
.p-tabview .p-tabview-nav > li > .p-tabview-nav-link[aria-selected="true"],
.p-tabview .p-tabview-nav > li.p-highlight:not(.p-disabled) > .p-tabview-nav-link:hover {
    background: var(--${prefix}-tabview-header-selected-background);
    border-color: var(--${prefix}-tabview-header-selected-border-color);
    color: var(--${prefix}-tabview-header-selected-color);
}

.p-tabview .p-tabview-nav > li:not(.p-disabled) > .p-tabview-nav-link:focus-visible {
    box-shadow: var(--${prefix}-tabview-header-focus-shadow);
    outline: 0;
}

.p-tabview .p-tabview-nav > li.p-disabled {
    opacity: var(--${prefix}-tabview-header-disabled-opacity);
    pointer-events: none;
}

.p-tabview .p-tabview-nav-link > .p-tabview-close {
    color: var(--${prefix}-tabview-close-icon-color);
}

.p-tabview .p-tabview-nav > li:not(.p-disabled) .p-tabview-close:hover {
    color: var(--${prefix}-tabview-close-icon-hover-color);
}

.p-tabview .p-tabview-nav > li:not(.p-disabled) .p-tabview-close:focus-visible {
    box-shadow: var(--${prefix}-tabview-close-icon-focus-shadow);
    outline: 0;
}

.p-tabview .p-tabview-nav > .p-tabview-ink-bar {
    background: var(--${prefix}-tabview-inkbar-background);
    bottom: 0;
    height: var(--${prefix}-tabview-inkbar-height);
    position: absolute;
    pointer-events: none;
    transition: left var(--${prefix}-tabview-inkbar-transition-duration), width var(--${prefix}-tabview-inkbar-transition-duration);
}

.p-tabview > .p-tabview-panels {
    background: var(--${prefix}-tabview-panels-background);
    border-radius: 0 0 var(--${prefix}-tabview-panels-border-radius) var(--${prefix}-tabview-panels-border-radius);
    color: var(--${prefix}-tabview-panels-color);
    padding: var(--${prefix}-tabview-panels-padding);
}

.p-tabview > .p-tabview-panels > .p-tabview-panel.p-hidden {
    display: none;
}

.p-tabview > .p-tabview-nav-container > .p-tabview-nav-btn {
    background: var(--${prefix}-tabview-nav-button-background);
    border: 0;
    color: var(--${prefix}-tabview-nav-button-color);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 0;
    position: absolute;
    top: 0;
    width: var(--${prefix}-tabview-nav-button-width);
    z-index: 1;
}

.p-tabview > .p-tabview-nav-container > .p-tabview-nav-prev { left: 0; }
.p-tabview > .p-tabview-nav-container > .p-tabview-nav-next { right: 0; }

.p-tabview > .p-tabview-nav-container > .p-tabview-nav-btn:enabled:hover {
    background: var(--${prefix}-tabview-nav-button-hover-background);
    color: var(--${prefix}-tabview-nav-button-hover-color);
}

.p-tabview > .p-tabview-nav-container > .p-tabview-nav-btn:enabled:focus-visible {
    box-shadow: var(--${prefix}-tabview-nav-button-focus-shadow);
    outline: 0;
}

${surfaceCss({ prefix, component: 'toolbar', selector: '.p-toolbar' })}

.p-toolbar {
    gap: var(--${prefix}-toolbar-root-gap);
    padding: var(--${prefix}-toolbar-root-padding);
}

.p-toolbar > .p-toolbar-group-start,
.p-toolbar > .p-toolbar-group-left {
    gap: var(--${prefix}-toolbar-start-gap);
}

.p-toolbar > .p-toolbar-group-center {
    gap: var(--${prefix}-toolbar-center-gap);
}

.p-toolbar > .p-toolbar-group-end,
.p-toolbar > .p-toolbar-group-right {
    gap: var(--${prefix}-toolbar-end-gap);
}
`;
