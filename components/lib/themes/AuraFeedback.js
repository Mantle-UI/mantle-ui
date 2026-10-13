const focusRingTokens = () => ({
    width: '{focusRing.width}',
    style: '{focusRing.style}',
    color: '{focusRing.color}',
    offset: '{focusRing.offset}'
});

const filledSeverityTokens = () => ({
    success: { background: '{green.500}', color: '{green.950}' },
    info: { background: '{sky.500}', color: '{sky.950}' },
    warning: { background: '{orange.500}', color: '{orange.950}' },
    danger: { background: '{red.500}', color: '{red.950}' },
    secondary: { background: '{surface.100}', color: '{text.color}' },
    contrast: { background: '{text.color}', color: '{surface.overlay}' }
});

const noticeSeverityTokens = () => ({
    success: {
        background: 'color-mix(in srgb, {green.500} 12%, {surface.overlay})',
        borderColor: '{green.500}',
        color: '{green.700}',
        colorScheme: { dark: { color: '{green.500}' } }
    },
    info: {
        background: 'color-mix(in srgb, {sky.500} 12%, {surface.overlay})',
        borderColor: '{sky.500}',
        color: '{sky.700}',
        colorScheme: { dark: { color: '{sky.500}' } }
    },
    warn: {
        background: 'color-mix(in srgb, {orange.500} 12%, {surface.overlay})',
        borderColor: '{orange.500}',
        color: '{orange.700}',
        colorScheme: { dark: { color: '{orange.500}' } }
    },
    error: {
        background: 'color-mix(in srgb, {red.500} 12%, {surface.overlay})',
        borderColor: '{red.500}',
        color: '{red.700}',
        colorScheme: { dark: { color: '{red.500}' } }
    },
    secondary: { background: '{surface.100}', borderColor: '{surface.300}', color: '{text.color}' },
    contrast: { background: '{text.color}', borderColor: '{text.color}', color: '{surface.overlay}' }
});

const closeButtonTokens = () => ({
    background: 'transparent',
    color: 'inherit',
    hoverBackground: 'color-mix(in srgb, currentColor 10%, transparent)',
    hoverColor: 'inherit',
    activeBackground: 'color-mix(in srgb, currentColor 16%, transparent)',
    activeColor: 'inherit',
    size: '2rem',
    borderRadius: '50%',
    disabledOpacity: '{disabledOpacity}',
    transitionDuration: '{transitionDuration}',
    focusRing: focusRingTokens()
});

/** Feedback skins use the severity names exposed by each component's API. */
export const auraFeedbackComponents = {
    badge: {
        root: { background: '{primary.color}', color: '{primary.contrastColor}', borderRadius: '{borderRadius.xl}', fontSize: '0.75rem', fontWeight: '700', size: '1.5rem', padding: '0 0.5rem' },
        large: { fontSize: '1.125rem', size: '2.25rem' },
        xlarge: { fontSize: '1.5rem', size: '3rem' },
        dot: { size: '0.5rem', borderRadius: '50%' },
        noGutter: { borderRadius: '50%' },
        ...filledSeverityTokens()
    },
    chip: {
        root: { background: '{surface.100}', color: '{text.color}', borderRadius: '1.5rem', paddingX: '0.75rem', paddingY: '0', gap: '0.5rem' },
        label: { color: 'inherit', fontSize: '1rem', lineHeight: '1.5', marginY: '0.375rem' },
        icon: { color: 'inherit', size: '1rem' },
        image: { size: '2.25rem', borderRadius: '50%' },
        removeIcon: {
            background: 'transparent',
            color: 'inherit',
            hoverBackground: '{surface.200}',
            hoverColor: '{text.color}',
            activeBackground: '{surface.300}',
            activeColor: '{text.color}',
            size: '1rem',
            borderRadius: '{borderRadius.md}',
            transitionDuration: '{transitionDuration}',
            focusRing: focusRingTokens()
        }
    },
    message: {
        root: { borderRadius: '{borderRadius.md}', borderWidth: '1px', padding: '0.75rem', gap: '0.5rem' },
        icon: { color: 'inherit', size: '1rem' },
        text: { color: 'inherit', fontSize: '1rem', fontWeight: '500' },
        ...noticeSeverityTokens()
    },
    messages: {
        root: { borderRadius: '{borderRadius.md}', borderWidth: '0 0 0 6px', margin: '1rem 0' },
        wrapper: { padding: '1.25rem 1.75rem', gap: '0.5rem' },
        icon: { color: 'inherit', size: '1.5rem' },
        summary: { color: 'inherit', fontSize: '1rem', fontWeight: '700' },
        detail: { color: 'inherit', fontSize: '1rem' },
        closeButton: closeButtonTokens(),
        closeIcon: { color: 'inherit', size: '1rem' },
        ...noticeSeverityTokens()
    },
    toast: {
        root: { maxWidth: '25rem' },
        message: { borderRadius: '{borderRadius.md}', borderWidth: '0 0 0 6px', margin: '0 0 1rem', shadow: '0 2px 12px rgba(15, 23, 42, 0.12)' },
        content: { padding: '1rem', gap: '1rem' },
        icon: { color: 'inherit', size: '2rem' },
        summary: { color: 'inherit', fontSize: '1rem', fontWeight: '700' },
        detail: { color: 'inherit', fontSize: '1rem', margin: '0.5rem 0 0' },
        closeButton: closeButtonTokens(),
        closeIcon: { color: 'inherit', size: '1rem' },
        ...noticeSeverityTokens()
    },
    progressbar: {
        root: { background: '{surface.200}', borderRadius: '{borderRadius.md}', height: '1.5rem' },
        value: { background: '{primary.color}', borderRadius: '{progressbar.root.borderRadius}', indeterminateBackground: '{progressbar.value.background}' },
        label: { color: '{primary.contrastColor}', fontSize: '1rem', fontWeight: '500' }
    },
    progressspinner: {
        root: { size: '100px', margin: '0 auto' },
        circle: { color: '{primary.color}' }
    },
    skeleton: {
        root: { background: '{surface.200}', borderRadius: '{borderRadius.md}' },
        circle: { borderRadius: '50%' },
        wave: { background: 'linear-gradient(90deg, transparent, color-mix(in srgb, {surface.0} 40%, transparent), transparent)' }
    },
    tag: {
        root: { background: '{primary.color}', color: '{primary.contrastColor}', borderRadius: '{borderRadius.sm}', roundedBorderRadius: '10rem', fontSize: '0.75rem', fontWeight: '700', padding: '0.25rem 0.4rem', gap: '0.25rem' },
        icon: { color: 'inherit', size: '0.75rem' },
        label: { color: 'inherit' },
        ...filledSeverityTokens()
    }
};

const cssVariable = (prefix, path) =>
    `var(--${prefix}-${path
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replaceAll('.', '-')
        .toLowerCase()})`;

const rule = (selectors, declarations) => `${Array.isArray(selectors) ? selectors.join(',\n') : selectors} {\n${declarations}\n}\n`;

const focusCss = (name, variable) => `    outline: ${variable(`${name}.focusRing.width`)} ${variable(`${name}.focusRing.style`)} ${variable(`${name}.focusRing.color`)};
    outline-offset: ${variable(`${name}.focusRing.offset`)};
    box-shadow: none;`;

const iconCss = ({ selector, name, variable }) => rule(selector, `    color: ${variable(`${name}.color`)};\n    font-size: ${variable(`${name}.size`)};\n    width: ${variable(`${name}.size`)};\n    height: ${variable(`${name}.size`)};`);

const filledSeverityCss = ({ selector, className, name, variable }) =>
    ['success', 'info', 'warning', 'danger', 'secondary', 'contrast']
        .map((severity) => rule(`${selector}.${className}-${severity}`, `    background: ${variable(`${name}.${severity}.background`)};\n    color: ${variable(`${name}.${severity}.color`)};`))
        .join('\n');

const noticeSeverityCss = ({ selector, className, name, variable }) =>
    ['success', 'info', 'warn', 'error', 'secondary', 'contrast']
        .map((severity) =>
            rule(`${selector}.${className}-${severity}`, `    background: ${variable(`${name}.${severity}.background`)};\n    border-color: ${variable(`${name}.${severity}.borderColor`)};\n    color: ${variable(`${name}.${severity}.color`)};`)
        )
        .join('\n');

const closeButtonCss = ({ selector, iconSelector, name, variable }) => {
    const token = `${name}.closeButton`;

    return [
        rule(
            selector,
            `    background: ${variable(`${token}.background`)};
    border: 0;
    border-radius: ${variable(`${token}.borderRadius`)};
    color: ${variable(`${token}.color`)};
    width: ${variable(`${token}.size`)};
    height: ${variable(`${token}.size`)};
    padding: 0;
    transition: background ${variable(`${token}.transitionDuration`)}, color ${variable(`${token}.transitionDuration`)};`
        ),
        rule(`${selector}:enabled:hover`, `    background: ${variable(`${token}.hoverBackground`)};\n    color: ${variable(`${token}.hoverColor`)};`),
        rule(`${selector}:enabled:active`, `    background: ${variable(`${token}.activeBackground`)};\n    color: ${variable(`${token}.activeColor`)};`),
        rule(`${selector}:enabled:focus-visible`, focusCss(token, variable)),
        rule(`${selector}:disabled`, `    opacity: ${variable(`${token}.disabledOpacity`)};`),
        iconCss({ selector: iconSelector, name: `${name}.closeIcon`, variable })
    ].join('\n');
};

/** Flat CSS keeps provider scoping deterministic and leaves progress animation timing in the Base styles. */
export const auraFeedbackCss = ({ prefix = 'mantle' } = {}) => {
    const variable = (path) => cssVariable(prefix, path);

    return [
        rule(
            '.p-badge',
            `    background: ${variable('badge.root.background')};
    color: ${variable('badge.root.color')};
    border-radius: ${variable('badge.root.borderRadius')};
    font-size: ${variable('badge.root.fontSize')};
    font-weight: ${variable('badge.root.fontWeight')};
    min-width: ${variable('badge.root.size')};
    height: ${variable('badge.root.size')};
    line-height: ${variable('badge.root.size')};
    padding: ${variable('badge.root.padding')};`
        ),
        ...[
            ['large', 'lg'],
            ['xlarge', 'xl']
        ].map(([name, className]) =>
            rule(
                `.p-badge.p-badge-${className}`,
                `    font-size: ${variable(`badge.${name}.fontSize`)};\n    min-width: ${variable(`badge.${name}.size`)};\n    height: ${variable(`badge.${name}.size`)};\n    line-height: ${variable(`badge.${name}.size`)};`
            )
        ),
        rule('.p-badge.p-badge-no-gutter', `    border-radius: ${variable('badge.noGutter.borderRadius')};\n    padding: 0;`),
        rule('.p-badge.p-badge-dot', `    width: ${variable('badge.dot.size')};\n    min-width: ${variable('badge.dot.size')};\n    height: ${variable('badge.dot.size')};\n    border-radius: ${variable('badge.dot.borderRadius')};\n    padding: 0;`),
        filledSeverityCss({ selector: '.p-badge', className: 'p-badge', name: 'badge', variable }),
        rule(
            '.p-chip',
            `    background: ${variable('chip.root.background')};
    color: ${variable('chip.root.color')};
    border-radius: ${variable('chip.root.borderRadius')};
    padding: ${variable('chip.root.paddingY')} ${variable('chip.root.paddingX')};
    gap: ${variable('chip.root.gap')};`
        ),
        rule('.p-chip .p-chip-text', `    color: ${variable('chip.label.color')};\n    font-size: ${variable('chip.label.fontSize')};\n    line-height: ${variable('chip.label.lineHeight')};\n    margin-block: ${variable('chip.label.marginY')};`),
        iconCss({ selector: '.p-chip .p-chip-icon', name: 'chip.icon', variable }),
        rule(
            '.p-chip img',
            `    width: ${variable('chip.image.size')};\n    height: ${variable('chip.image.size')};\n    border-radius: ${variable('chip.image.borderRadius')};\n    margin-inline-start: calc(-1 * ${variable('chip.root.paddingX')});`
        ),
        iconCss({ selector: '.p-chip .p-chip-remove-icon', name: 'chip.removeIcon', variable }),
        rule(
            '.p-chip .p-chip-remove-icon',
            `    background: ${variable('chip.removeIcon.background')};\n    border-radius: ${variable('chip.removeIcon.borderRadius')};\n    transition: background ${variable('chip.removeIcon.transitionDuration')}, color ${variable('chip.removeIcon.transitionDuration')};`
        ),
        rule('.p-chip .p-chip-remove-icon:hover', `    background: ${variable('chip.removeIcon.hoverBackground')};\n    color: ${variable('chip.removeIcon.hoverColor')};`),
        rule('.p-chip .p-chip-remove-icon:active', `    background: ${variable('chip.removeIcon.activeBackground')};\n    color: ${variable('chip.removeIcon.activeColor')};`),
        rule('.p-chip .p-chip-remove-icon:focus-visible', focusCss('chip.removeIcon', variable)),
        rule(
            '.p-inline-message',
            `    border: solid transparent;
    border-width: ${variable('message.root.borderWidth')};
    border-radius: ${variable('message.root.borderRadius')};
    padding: ${variable('message.root.padding')};
    gap: ${variable('message.root.gap')};`
        ),
        rule('.p-inline-message.p-inline-message-icon-only', '    gap: 0;'),
        iconCss({ selector: '.p-inline-message .p-inline-message-icon', name: 'message.icon', variable }),
        rule('.p-inline-message .p-inline-message-text', `    color: ${variable('message.text.color')};\n    font-size: ${variable('message.text.fontSize')};\n    font-weight: ${variable('message.text.fontWeight')};`),
        noticeSeverityCss({ selector: '.p-inline-message', className: 'p-inline-message', name: 'message', variable }),
        rule('.p-message', `    border: solid transparent;\n    border-width: ${variable('messages.root.borderWidth')};\n    border-radius: ${variable('messages.root.borderRadius')};\n    margin: ${variable('messages.root.margin')};`),
        rule('.p-message.p-message-exit-active', '    margin: 0;'),
        rule('.p-message .p-message-wrapper', `    padding: ${variable('messages.wrapper.padding')};\n    gap: ${variable('messages.wrapper.gap')};`),
        iconCss({ selector: '.p-message .p-message-icon', name: 'messages.icon', variable }),
        rule('.p-message .p-message-summary', `    color: ${variable('messages.summary.color')};\n    font-size: ${variable('messages.summary.fontSize')};\n    font-weight: ${variable('messages.summary.fontWeight')};`),
        rule('.p-message .p-message-detail', `    color: ${variable('messages.detail.color')};\n    font-size: ${variable('messages.detail.fontSize')};`),
        closeButtonCss({ selector: '.p-message .p-message-close', iconSelector: '.p-message .p-message-close-icon', name: 'messages', variable }),
        noticeSeverityCss({ selector: '.p-message', className: 'p-message', name: 'messages', variable }),
        rule('.p-toast', `    max-width: ${variable('toast.root.maxWidth')};`),
        rule(
            '.p-toast .p-toast-message',
            `    border: solid transparent;
    border-width: ${variable('toast.message.borderWidth')};
    border-radius: ${variable('toast.message.borderRadius')};
    margin: ${variable('toast.message.margin')};
    box-shadow: ${variable('toast.message.shadow')};`
        ),
        rule('.p-toast .p-toast-message-content', `    padding: ${variable('toast.content.padding')};\n    gap: ${variable('toast.content.gap')};`),
        rule('.p-toast .p-toast-message.p-toast-message-exit-active', '    margin-bottom: 0;'),
        iconCss({ selector: '.p-toast .p-toast-message-icon', name: 'toast.icon', variable }),
        rule('.p-toast .p-toast-summary', `    color: ${variable('toast.summary.color')};\n    font-size: ${variable('toast.summary.fontSize')};\n    font-weight: ${variable('toast.summary.fontWeight')};`),
        rule('.p-toast .p-toast-detail', `    color: ${variable('toast.detail.color')};\n    font-size: ${variable('toast.detail.fontSize')};\n    margin: ${variable('toast.detail.margin')};`),
        closeButtonCss({ selector: '.p-toast .p-toast-icon-close', iconSelector: '.p-toast .p-toast-icon-close-icon', name: 'toast', variable }),
        noticeSeverityCss({ selector: '.p-toast .p-toast-message', className: 'p-toast-message', name: 'toast', variable }),
        rule('.p-progressbar', `    background: ${variable('progressbar.root.background')};\n    border: 0;\n    border-radius: ${variable('progressbar.root.borderRadius')};\n    height: ${variable('progressbar.root.height')};`),
        rule('.p-progressbar .p-progressbar-value', `    background-color: ${variable('progressbar.value.background')};\n    border-radius: ${variable('progressbar.value.borderRadius')};\n    margin: 0;`),
        rule('.p-progressbar.p-progressbar-indeterminate .p-progressbar-value', `    background-color: ${variable('progressbar.value.indeterminateBackground')};`),
        rule('.p-progressbar .p-progressbar-label', `    color: ${variable('progressbar.label.color')};\n    font-size: ${variable('progressbar.label.fontSize')};\n    font-weight: ${variable('progressbar.label.fontWeight')};`),
        rule('.p-progress-spinner', `    width: ${variable('progressspinner.root.size')};\n    height: ${variable('progressspinner.root.size')};\n    margin: ${variable('progressspinner.root.margin')};`),
        // The legacy color keyframes hardcode four colors. Important stroke lets
        // the theme own color while keeping the dash/rotation timing unchanged.
        rule('.p-progress-spinner .p-progress-spinner-circle', `    stroke: ${variable('progressspinner.circle.color')};\n    animation-name: p-progress-spinner-dash;`),
        rule('.p-skeleton', `    background: ${variable('skeleton.root.background')};\n    border-radius: ${variable('skeleton.root.borderRadius')};`),
        rule('.p-skeleton.p-skeleton-circle', `    border-radius: ${variable('skeleton.circle.borderRadius')};`),
        rule('.p-skeleton:after', `    background: ${variable('skeleton.wave.background')};`),
        rule(
            '.p-tag',
            `    background: ${variable('tag.root.background')};
    color: ${variable('tag.root.color')};
    border-radius: ${variable('tag.root.borderRadius')};
    font-size: ${variable('tag.root.fontSize')};
    font-weight: ${variable('tag.root.fontWeight')};
    padding: ${variable('tag.root.padding')};
    gap: ${variable('tag.root.gap')};`
        ),
        rule('.p-tag.p-tag-rounded', `    border-radius: ${variable('tag.root.roundedBorderRadius')};`),
        iconCss({ selector: '.p-tag .p-tag-icon', name: 'tag.icon', variable }),
        rule('.p-tag .p-tag-value', `    color: ${variable('tag.label.color')};`),
        filledSeverityCss({ selector: '.p-tag', className: 'p-tag', name: 'tag', variable })
    ].join('\n');
};
