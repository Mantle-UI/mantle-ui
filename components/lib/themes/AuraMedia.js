const focusRingTokens = () => ({
    width: '{focusRing.width}',
    style: '{focusRing.style}',
    color: '{focusRing.color}',
    offset: '{focusRing.offset}'
});

const surfaceTokens = () => ({
    background: '{overlay.background}',
    color: '{overlay.color}',
    borderColor: '{overlay.borderColor}',
    borderRadius: '{borderRadius.md}'
});

const actionTokens = (overrides = {}) => ({
    background: 'transparent',
    color: '{text.mutedColor}',
    hoverBackground: 'color-mix(in srgb, {primary.color}, transparent 92%)',
    hoverColor: '{primary.color}',
    activeBackground: 'color-mix(in srgb, {primary.color}, transparent 84%)',
    activeColor: '{primary.color}',
    borderRadius: '50%',
    size: '2.5rem',
    iconSize: '1rem',
    disabledOpacity: '{disabledOpacity}',
    transitionDuration: '{transitionDuration}',
    focusRing: focusRingTokens(),
    ...overrides
});

const indicatorTokens = () => ({
    background: '{surface.300}',
    hoverBackground: '{surface.400}',
    activeBackground: '{primary.color}',
    activeHoverBackground: '{primary.hoverColor}',
    width: '2rem',
    height: '0.5rem',
    borderRadius: '{borderRadius.sm}',
    transitionDuration: '{transitionDuration}',
    focusRing: focusRingTokens()
});

const maskTokens = () => ({
    background: 'rgba(0, 0, 0, 0.9)',
    color: '{surface.0}',
    transitionDuration: '{transitionDuration}'
});

/** Media component tokens target the existing DOM and leave media transforms to the components. */
export const auraMediaComponents = {
    avatar: {
        root: {
            background: 'color-mix(in srgb, {primary.color}, transparent 88%)',
            color: '{text.color}',
            borderColor: 'transparent',
            borderWidth: '0',
            borderRadius: '{borderRadius.md}',
            width: '2rem',
            height: '2rem',
            fontSize: '1rem',
            fontWeight: '500',
            hoverBackground: 'color-mix(in srgb, {primary.color}, transparent 80%)',
            transitionDuration: '{transitionDuration}',
            focusRing: focusRingTokens()
        },
        icon: { size: '1rem', color: 'inherit' },
        label: { color: 'inherit' },
        image: { background: 'transparent', objectFit: 'cover' },
        circle: { borderRadius: '50%' },
        large: { width: '3rem', height: '3rem', fontSize: '1.5rem', iconSize: '1.5rem' },
        xlarge: { width: '4rem', height: '4rem', fontSize: '2rem', iconSize: '2rem' }
    },
    avatargroup: {
        root: { gap: '0', padding: '0' },
        avatar: { borderColor: '{surface.card}', borderWidth: '2px', overlap: '-1rem', largeOverlap: '-1.5rem', xlargeOverlap: '-2rem' }
    },
    carousel: {
        root: { color: '{text.color}' },
        header: { background: 'transparent', color: '{text.color}', padding: '1rem' },
        footer: { background: 'transparent', color: '{text.color}', padding: '1rem' },
        content: { padding: '0', gap: '0.5rem' },
        item: { padding: '0' },
        navigator: actionTokens(),
        indicators: { padding: '1rem', gap: '0.5rem' },
        indicator: indicatorTokens()
    },
    galleria: {
        root: surfaceTokens(),
        header: { background: '{galleria.root.background}', color: '{galleria.root.color}', padding: '1rem' },
        footer: { background: '{galleria.root.background}', color: '{galleria.root.color}', padding: '1rem' },
        itemNavigator: actionTokens({ color: '{surface.0}', hoverBackground: 'rgba(255, 255, 255, 0.15)', hoverColor: '{surface.0}', activeBackground: 'rgba(255, 255, 255, 0.25)', activeColor: '{surface.0}', size: '3rem', iconSize: '1.5rem' }),
        closeButton: actionTokens({ color: '{surface.0}', hoverBackground: 'rgba(255, 255, 255, 0.15)', hoverColor: '{surface.0}', activeBackground: 'rgba(255, 255, 255, 0.25)', activeColor: '{surface.0}', size: '3rem', iconSize: '1.5rem' }),
        caption: { background: 'rgba(0, 0, 0, 0.65)', color: '{surface.0}', padding: '1rem' },
        thumbnailContainer: { background: '{overlay.background}', color: '{overlay.color}', padding: '1rem', gap: '0.5rem' },
        thumbnail: { opacity: '0.5', hoverOpacity: '1', selectedOpacity: '1', borderRadius: '{borderRadius.sm}', transitionDuration: '{transitionDuration}', focusRing: focusRingTokens() },
        thumbnailNavigator: actionTokens(),
        indicators: { background: 'transparent', onItemBackground: 'rgba(0, 0, 0, 0.4)', padding: '1rem', gap: '0.5rem' },
        indicator: { ...indicatorTokens(), width: '1rem', height: '1rem', borderRadius: '50%' },
        mask: maskTokens()
    },
    image: {
        root: { borderRadius: '{borderRadius.md}' },
        indicator: { background: 'rgba(0, 0, 0, 0.5)', color: '{surface.0}', iconSize: '1.5rem', transitionDuration: '{transitionDuration}', focusRing: focusRingTokens() },
        preview: { borderRadius: '{borderRadius.md}' },
        toolbar: { background: 'transparent', padding: '1rem', gap: '0.5rem' },
        action: actionTokens({ color: '{surface.0}', hoverBackground: 'rgba(255, 255, 255, 0.15)', hoverColor: '{surface.0}', activeBackground: 'rgba(255, 255, 255, 0.25)', activeColor: '{surface.0}', iconSize: '1.5rem' }),
        mask: maskTokens()
    },
    timeline: {
        root: { color: '{text.color}' },
        event: { minHeight: '70px' },
        marker: { background: '{surface.card}', color: '{primary.color}', borderColor: '{primary.color}', borderWidth: '2px', borderRadius: '50%', size: '1rem' },
        connector: { color: '{surface.border}', size: '2px' },
        content: { color: '{text.color}', padding: '0 1rem', horizontalPadding: '1rem 0' },
        opposite: { color: '{text.mutedColor}', padding: '0 1rem', horizontalPadding: '1rem 0' }
    },
    inplace: {
        root: { color: '{text.color}' },
        display: {
            background: 'transparent',
            color: '{text.color}',
            hoverBackground: 'color-mix(in srgb, {primary.color}, transparent 92%)',
            hoverColor: '{primary.color}',
            activeBackground: 'color-mix(in srgb, {primary.color}, transparent 84%)',
            activeColor: '{primary.color}',
            borderRadius: '{borderRadius.md}',
            padding: '0.75rem',
            disabledOpacity: '{disabledOpacity}',
            transitionDuration: '{transitionDuration}',
            focusRing: focusRingTokens()
        },
        content: { background: 'transparent', color: '{text.color}', padding: '0' },
        closeButton: actionTokens({
            background: '{button.root.background}',
            color: '{button.root.color}',
            hoverBackground: '{button.root.hoverBackground}',
            hoverColor: '{button.root.color}',
            activeBackground: '{button.root.activeBackground}',
            activeColor: '{button.root.color}',
            borderRadius: '{button.root.borderRadius}',
            size: '{button.root.iconOnlyWidth}'
        }),
        closeButtonMargin: '0.25rem'
    },
    terminal: {
        root: {
            ...surfaceTokens(),
            padding: '1.25rem',
            fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace',
            fontSize: '1rem',
            lineHeight: '1.5',
            focusBorderColor: '{primary.color}',
            transitionDuration: '{transitionDuration}',
            focusRing: focusRingTokens()
        },
        welcomeMessage: { color: '{text.color}', margin: '0 0 1rem' },
        content: { color: '{text.color}', margin: '0 0 0.5rem' },
        prompt: { color: '{primary.color}', fontWeight: '600' },
        command: { color: '{text.color}' },
        response: { color: '{text.mutedColor}', margin: '0.25rem 0 0.75rem' },
        input: { background: 'transparent', color: '{text.color}', caretColor: '{primary.color}', placeholderColor: '{text.mutedColor}', padding: '0' }
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

const contentCss = (selector, name, variable) => rule(selector, `    background: ${variable(`${name}.background`)};\n    color: ${variable(`${name}.color`)};\n    padding: ${variable(`${name}.padding`)};`);

const surfaceCss = (selector, name, variable) =>
    rule(selector, `    background: ${variable(`${name}.background`)};\n    color: ${variable(`${name}.color`)};\n    border: 1px solid ${variable(`${name}.borderColor`)};\n    border-radius: ${variable(`${name}.borderRadius`)};`);

const actionCss = ({ selectors, name, iconSelectors, variable }) => {
    const enabled = selectors.map((selector) => `${selector}:enabled:not(.p-disabled)`);

    return [
        rule(
            selectors,
            `    background: ${variable(`${name}.background`)};\n    color: ${variable(`${name}.color`)};\n    border: 0;\n    padding: 0;\n    border-radius: ${variable(`${name}.borderRadius`)};\n    width: ${variable(`${name}.size`)};\n    height: ${variable(`${name}.size`)};\n    transition: background ${variable(`${name}.transitionDuration`)}, color ${variable(`${name}.transitionDuration`)};`
        ),
        rule(
            enabled.map((selector) => `${selector}:hover`),
            `    background: ${variable(`${name}.hoverBackground`)};\n    color: ${variable(`${name}.hoverColor`)};`
        ),
        rule(
            enabled.map((selector) => `${selector}:active`),
            `    background: ${variable(`${name}.activeBackground`)};\n    color: ${variable(`${name}.activeColor`)};`
        ),
        rule(
            enabled.map((selector) => `${selector}:focus-visible`),
            focusCss(name, variable)
        ),
        rule(
            selectors.map((selector) => `${selector}:disabled`),
            `    opacity: ${variable(`${name}.disabledOpacity`)};`
        ),
        rule(iconSelectors, `    width: ${variable(`${name}.iconSize`)};\n    height: ${variable(`${name}.iconSize`)};\n    font-size: ${variable(`${name}.iconSize`)};\n    color: inherit;`)
    ].join('\n');
};

const indicatorsCss = ({ name, variable }) => {
    const root = `.p-${name}`;
    const indicator = `${root} .p-${name}-indicator`;
    const button = `${indicator} > button`;

    return [
        rule(`${root} .p-${name}-indicators`, `    padding: ${variable(`${name}.indicators.padding`)};\n    gap: ${variable(`${name}.indicators.gap`)};`),
        rule(
            button,
            `    background: ${variable(`${name}.indicator.background`)};\n    width: ${variable(`${name}.indicator.width`)};\n    height: ${variable(`${name}.indicator.height`)};\n    border-radius: ${variable(`${name}.indicator.borderRadius`)};\n    border: 0;\n    padding: 0;\n    transition: background ${variable(`${name}.indicator.transitionDuration`)};`
        ),
        rule(`${button}:hover`, `    background: ${variable(`${name}.indicator.hoverBackground`)};`),
        rule(`${indicator}.p-highlight > button`, `    background: ${variable(`${name}.indicator.activeBackground`)};`),
        rule(`${indicator}.p-highlight > button:hover`, `    background: ${variable(`${name}.indicator.activeHoverBackground`)};`),
        rule(`${button}:focus-visible`, focusCss(`${name}.indicator`, variable)),
        name === 'galleria' ? rule(`${indicator}:focus-visible`, focusCss(`${name}.indicator`, variable)) : ''
    ].join('\n');
};

const maskCss = (selector, name, variable) => rule(selector, `    background: ${variable(`${name}.mask.background`)};\n    color: ${variable(`${name}.mask.color`)};\n    transition-duration: ${variable(`${name}.mask.transitionDuration`)};`);

export const auraMediaCss = ({ prefix = 'mantle' } = {}) => {
    const variable = (path) => cssVariable(prefix, path);

    return [
        rule(
            '.p-avatar',
            `    box-sizing: border-box;\n    background: ${variable('avatar.root.background')};\n    color: ${variable('avatar.root.color')};\n    border: ${variable('avatar.root.borderWidth')} solid ${variable('avatar.root.borderColor')};\n    border-radius: ${variable('avatar.root.borderRadius')};\n    width: ${variable('avatar.root.width')};\n    height: ${variable('avatar.root.height')};\n    font-size: ${variable('avatar.root.fontSize')};\n    font-weight: ${variable('avatar.root.fontWeight')};\n    transition: background ${variable('avatar.root.transitionDuration')};`
        ),
        rule('.p-avatar .p-avatar-text', `    color: ${variable('avatar.label.color')};`),
        rule('.p-avatar .p-avatar-icon', `    color: ${variable('avatar.icon.color')};\n    width: ${variable('avatar.icon.size')};\n    height: ${variable('avatar.icon.size')};\n    font-size: ${variable('avatar.icon.size')};`),
        rule('.p-avatar.p-avatar-image', `    background: ${variable('avatar.image.background')};`),
        rule('.p-avatar > img', `    object-fit: ${variable('avatar.image.objectFit')};\n    border-radius: inherit;`),
        rule('.p-avatar.p-avatar-circle', `    border-radius: ${variable('avatar.circle.borderRadius')};`),
        rule('.p-avatar.p-avatar-circle > img', `    border-radius: inherit;`),
        ...['large', 'xlarge'].flatMap((size) => {
            const selector = `.p-avatar.p-avatar-${size === 'large' ? 'lg' : 'xl'}`;

            return [
                rule(selector, `    width: ${variable(`avatar.${size}.width`)};\n    height: ${variable(`avatar.${size}.height`)};\n    font-size: ${variable(`avatar.${size}.fontSize`)};`),
                rule(`${selector} .p-avatar-icon`, `    width: ${variable(`avatar.${size}.iconSize`)};\n    height: ${variable(`avatar.${size}.iconSize`)};\n    font-size: ${variable(`avatar.${size}.iconSize`)};`)
            ];
        }),
        rule('.p-avatar.p-avatar-clickable:not(.p-avatar-image):hover', `    background: ${variable('avatar.root.hoverBackground')};`),
        rule('.p-avatar.p-avatar-clickable:focus-visible', focusCss('avatar.root', variable)),
        rule('.p-avatar-group', `    gap: ${variable('avatargroup.root.gap')};\n    padding: ${variable('avatargroup.root.padding')};`),
        rule('.p-avatar-group .p-avatar', `    border-color: ${variable('avatargroup.avatar.borderColor')};\n    border-width: ${variable('avatargroup.avatar.borderWidth')};`),
        rule('.p-avatar-group .p-avatar + .p-avatar', `    margin-left: 0;\n    margin-inline-start: ${variable('avatargroup.avatar.overlap')};`),
        rule('.p-avatar-group .p-avatar + .p-avatar.p-avatar-lg', `    margin-inline-start: ${variable('avatargroup.avatar.largeOverlap')};`),
        rule('.p-avatar-group .p-avatar + .p-avatar.p-avatar-xl', `    margin-inline-start: ${variable('avatargroup.avatar.xlargeOverlap')};`),
        rule('.p-carousel', `    color: ${variable('carousel.root.color')};`),
        contentCss('.p-carousel .p-carousel-header', 'carousel.header', variable),
        contentCss('.p-carousel .p-carousel-footer', 'carousel.footer', variable),
        rule('.p-carousel .p-carousel-content', `    padding: ${variable('carousel.content.padding')};`),
        rule('.p-carousel .p-carousel-container', `    gap: ${variable('carousel.content.gap')};`),
        rule('.p-carousel .p-carousel-item', `    padding: ${variable('carousel.item.padding')};`),
        actionCss({ selectors: ['.p-carousel .p-carousel-prev', '.p-carousel .p-carousel-next'], name: 'carousel.navigator', iconSelectors: ['.p-carousel .p-carousel-prev-icon', '.p-carousel .p-carousel-next-icon'], variable }),
        indicatorsCss({ name: 'carousel', variable }),
        surfaceCss('.p-galleria', 'galleria.root', variable),
        contentCss('.p-galleria .p-galleria-header', 'galleria.header', variable),
        contentCss('.p-galleria .p-galleria-footer', 'galleria.footer', variable),
        actionCss({
            selectors: ['.p-galleria .p-galleria-item-prev', '.p-galleria .p-galleria-item-next'],
            name: 'galleria.itemNavigator',
            iconSelectors: ['.p-galleria .p-galleria-item-prev-icon', '.p-galleria .p-galleria-item-next-icon'],
            variable
        }),
        rule('.p-galleria-item-nav-onhover .p-galleria-item-wrapper:not(:hover) .p-galleria-item-nav:disabled', '    opacity: 0;'),
        rule('.p-galleria.p-galleria-enter-active .p-galleria-item-nav', '    opacity: 0;'),
        rule('.p-galleria .p-galleria-item-prev', `    border-start-start-radius: 0;\n    border-end-start-radius: 0;`),
        rule('.p-galleria .p-galleria-item-next', `    border-start-end-radius: 0;\n    border-end-end-radius: 0;`),
        actionCss({ selectors: ['.p-galleria .p-galleria-close'], name: 'galleria.closeButton', iconSelectors: ['.p-galleria .p-galleria-close-icon'], variable }),
        contentCss('.p-galleria .p-galleria-caption', 'galleria.caption', variable),
        contentCss('.p-galleria .p-galleria-thumbnail-container', 'galleria.thumbnailContainer', variable),
        rule('.p-galleria .p-galleria-thumbnail-container', `    gap: ${variable('galleria.thumbnailContainer.gap')};`),
        rule('.p-galleria .p-galleria-thumbnail-item', `    opacity: ${variable('galleria.thumbnail.opacity')};\n    transition: opacity ${variable('galleria.thumbnail.transitionDuration')};`),
        rule('.p-galleria .p-galleria-thumbnail-item:hover', `    opacity: ${variable('galleria.thumbnail.hoverOpacity')};`),
        rule(['.p-galleria .p-galleria-thumbnail-item-current', '.p-galleria .p-galleria-thumbnail-item:focus-within'], `    opacity: ${variable('galleria.thumbnail.selectedOpacity')};`),
        rule('.p-galleria .p-galleria-thumbnail-item-content', `    border-radius: ${variable('galleria.thumbnail.borderRadius')};`),
        rule('.p-galleria .p-galleria-thumbnail-item-content:focus-visible', focusCss('galleria.thumbnail', variable)),
        actionCss({
            selectors: ['.p-galleria .p-galleria-thumbnail-prev', '.p-galleria .p-galleria-thumbnail-next'],
            name: 'galleria.thumbnailNavigator',
            iconSelectors: ['.p-galleria .p-galleria-thumbnail-prev-icon', '.p-galleria .p-galleria-thumbnail-next-icon'],
            variable
        }),
        indicatorsCss({ name: 'galleria', variable }),
        rule('.p-galleria .p-galleria-indicators', `    background: ${variable('galleria.indicators.background')};`),
        rule('.p-galleria.p-galleria-indicator-onitem .p-galleria-indicators', `    background: ${variable('galleria.indicators.onItemBackground')};`),
        maskCss('.p-galleria-mask', 'galleria', variable),
        rule(['.p-image', '.p-image > img'], `    border-radius: ${variable('image.root.borderRadius')};`),
        rule(
            '.p-image > .p-image-preview-indicator',
            `    background: ${variable('image.indicator.background')};\n    color: ${variable('image.indicator.color')};\n    border-radius: inherit;\n    transition-duration: ${variable('image.indicator.transitionDuration')};`
        ),
        rule('.p-image > .p-image-preview-indicator:focus-visible', `    opacity: 1;\n${focusCss('image.indicator', variable)}`),
        rule('.p-image .p-image-preview-icon', `    width: ${variable('image.indicator.iconSize')};\n    height: ${variable('image.indicator.iconSize')};\n    font-size: ${variable('image.indicator.iconSize')};`),
        rule('.p-image-mask .p-image-preview', `    border-radius: ${variable('image.preview.borderRadius')};`),
        rule('.p-image-mask .p-image-toolbar', `    background: ${variable('image.toolbar.background')};\n    padding: ${variable('image.toolbar.padding')};\n    gap: ${variable('image.toolbar.gap')};`),
        actionCss({ selectors: ['.p-image-mask .p-image-action'], name: 'image.action', iconSelectors: ['.p-image-mask .p-image-action > svg', '.p-image-mask .p-image-action > .p-icon', '.p-image-mask .p-image-action > .pi'], variable }),
        maskCss('.p-image-mask', 'image', variable),
        rule('.p-timeline', `    color: ${variable('timeline.root.color')};`),
        rule('.p-timeline .p-timeline-event', `    min-height: ${variable('timeline.event.minHeight')};`),
        rule('.p-timeline .p-timeline-event:last-child', '    min-height: 0;'),
        rule(
            '.p-timeline .p-timeline-event-marker',
            `    box-sizing: border-box;\n    background: ${variable('timeline.marker.background')};\n    color: ${variable('timeline.marker.color')};\n    border: ${variable('timeline.marker.borderWidth')} solid ${variable('timeline.marker.borderColor')};\n    border-radius: ${variable('timeline.marker.borderRadius')};\n    width: ${variable('timeline.marker.size')};\n    height: ${variable('timeline.marker.size')};\n    flex-shrink: 0;`
        ),
        rule('.p-timeline .p-timeline-event-connector', `    background: ${variable('timeline.connector.color')};\n    width: ${variable('timeline.connector.size')};`),
        rule('.p-timeline.p-timeline-horizontal .p-timeline-event-connector', `    width: 100%;\n    height: ${variable('timeline.connector.size')};`),
        ...['content', 'opposite'].flatMap((part) => [
            rule(`.p-timeline .p-timeline-event-${part}`, `    color: ${variable(`timeline.${part}.color`)};\n    padding: ${variable(`timeline.${part}.padding`)};`),
            rule(`.p-timeline.p-timeline-horizontal .p-timeline-event-${part}`, `    padding: ${variable(`timeline.${part}.horizontalPadding`)};`)
        ]),
        rule('.p-inplace', `    color: ${variable('inplace.root.color')};`),
        rule(
            '.p-inplace .p-inplace-display',
            `    background: ${variable('inplace.display.background')};\n    color: ${variable('inplace.display.color')};\n    border-radius: ${variable('inplace.display.borderRadius')};\n    padding: ${variable('inplace.display.padding')};\n    transition: background ${variable('inplace.display.transitionDuration')}, color ${variable('inplace.display.transitionDuration')};`
        ),
        rule('.p-inplace .p-inplace-display:not(.p-disabled):hover', `    background: ${variable('inplace.display.hoverBackground')};\n    color: ${variable('inplace.display.hoverColor')};`),
        rule('.p-inplace .p-inplace-display:not(.p-disabled):active', `    background: ${variable('inplace.display.activeBackground')};\n    color: ${variable('inplace.display.activeColor')};`),
        rule('.p-inplace .p-inplace-display:not(.p-disabled):focus-visible', focusCss('inplace.display', variable)),
        rule('.p-inplace .p-inplace-display.p-disabled', `    opacity: ${variable('inplace.display.disabledOpacity')};`),
        contentCss('.p-inplace .p-inplace-content', 'inplace.content', variable),
        actionCss({ selectors: ['.p-inplace .p-inplace-content .p-inplace-content-close.p-button'], name: 'inplace.closeButton', iconSelectors: ['.p-inplace .p-inplace-content .p-inplace-content-close.p-button .p-button-icon'], variable }),
        rule('.p-inplace .p-inplace-content .p-inplace-content-close.p-button', `    margin-left: 0;\n    margin-inline-start: ${variable('inplace.closeButtonMargin')};`),
        surfaceCss('.p-terminal', 'terminal.root', variable),
        rule(
            '.p-terminal',
            `    padding: ${variable('terminal.root.padding')};\n    font-family: ${variable('terminal.root.fontFamily')};\n    font-size: ${variable('terminal.root.fontSize')};\n    line-height: ${variable('terminal.root.lineHeight')};\n    transition: border-color ${variable('terminal.root.transitionDuration')};`
        ),
        rule('.p-terminal:focus-within', `    border-color: ${variable('terminal.root.focusBorderColor')};\n${focusCss('terminal.root', variable)}`),
        rule('.p-terminal > [data-pc-section="welcomemessage"]', `    color: ${variable('terminal.welcomeMessage.color')};\n    margin: ${variable('terminal.welcomeMessage.margin')};`),
        rule('.p-terminal .p-terminal-content', `    color: ${variable('terminal.content.color')};\n    margin: ${variable('terminal.content.margin')};`),
        rule('.p-terminal .p-terminal-prompt', `    color: ${variable('terminal.prompt.color')};\n    font-weight: ${variable('terminal.prompt.fontWeight')};`),
        rule('.p-terminal .p-terminal-command', `    color: ${variable('terminal.command.color')};`),
        rule('.p-terminal .p-terminal-response', `    color: ${variable('terminal.response.color')};\n    margin: ${variable('terminal.response.margin')};`),
        rule(
            '.p-terminal .p-terminal-input',
            `    background: ${variable('terminal.input.background')};\n    color: ${variable('terminal.input.color')};\n    caret-color: ${variable('terminal.input.caretColor')};\n    padding: ${variable('terminal.input.padding')};\n    font-family: inherit;\n    font-size: inherit;\n    line-height: inherit;\n    box-shadow: none;\n    outline: 0;`
        ),
        rule('.p-terminal .p-terminal-input::placeholder', `    color: ${variable('terminal.input.placeholderColor')};`)
    ].join('\n');
};
