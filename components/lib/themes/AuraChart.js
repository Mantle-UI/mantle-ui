/** Canvas renderer defaults are read from these aliases by the Chart component. */
export const auraChartComponents = {
    chart: {
        root: { background: 'transparent', color: '{text.color}', borderRadius: '{borderRadius.md}', padding: '0' },
        renderer: {
            textColor: '{text.color}',
            mutedColor: '{text.mutedColor}',
            gridColor: '{surface.border}',
            borderColor: '{surface.border}',
            backgroundColor: '{surface.card}',
            primaryColor: '{primary.color}',
            secondaryColor: '{surface.500}',
            successColor: '{green.500}',
            infoColor: '{sky.500}',
            warningColor: '{orange.500}',
            dangerColor: '{red.500}',
            helpColor: '{purple.500}',
            tooltipBackground: '{surface.overlay}',
            tooltipColor: '{text.color}',
            tooltipBorderColor: '{surface.border}',
            tooltipBorderWidth: '1'
        }
    }
};

const kebab = (value) => value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

/** Stable internal aliases let a renderer follow any configured token prefix. */
export const auraChartCss = ({ prefix = 'mantle' } = {}) => `.p-chart {
    background: var(--${prefix}-chart-root-background);
    color: var(--${prefix}-chart-root-color);
    border-radius: var(--${prefix}-chart-root-border-radius);
    padding: var(--${prefix}-chart-root-padding);
${Object.keys(auraChartComponents.chart.renderer)
    .map((key) => `    --mantle-chart-theme-${kebab(key)}: var(--${prefix}-chart-renderer-${kebab(key)});`)
    .join('\n')}
}
`;
