import * as React from 'react';
import { MantleContext } from '../api/Api';
import { useHandleStyle } from '../componentbase/ComponentBase';
import { useMergeProps } from '../hooks/Hooks';
import { classNames } from '../utils/Utils';
import { ChartBase } from './ChartBase';

// GitHub #3059 wrapper if loaded by script tag
const ChartJS = (function () {
    try {
        return Chart;
    } catch {
        return null;
    }
})();

const rendererTokenNames = [
    'textColor',
    'mutedColor',
    'gridColor',
    'borderColor',
    'backgroundColor',
    'primaryColor',
    'secondaryColor',
    'successColor',
    'infoColor',
    'warningColor',
    'dangerColor',
    'helpColor',
    'tooltipBackground',
    'tooltipColor',
    'tooltipBorderColor',
    'tooltipBorderWidth'
];
const datasetColorFields = ['backgroundColor', 'borderColor'];
const isPlainObject = (value) => value && typeof value === 'object' && (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null);

const cloneValue = (value) => {
    if (Array.isArray(value)) {
        return value.map(cloneValue);
    }

    if (isPlainObject(value)) {
        return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, cloneValue(entry)]));
    }

    return value;
};

// Chart options contain scriptable functions and plugin instances. Clone only
// plain objects/arrays and preserve explicit null, false and function values.
const mergeDefaults = (defaults, value) => {
    if (value === undefined) {
        return cloneValue(defaults);
    }

    if (!isPlainObject(defaults) || !isPlainObject(value)) {
        return cloneValue(value);
    }

    return Object.fromEntries(Object.keys({ ...defaults, ...value }).map((key) => [key, mergeDefaults(defaults[key], value[key])]));
};

const getPath = (object, path) => path.reduce((value, key) => value?.[key], object);

const hasOverride = (object, path) => {
    let value = object;

    for (const key of path) {
        if (value === undefined) {
            return false;
        }

        if (!isPlainObject(value)) {
            return true;
        }

        value = value[key];
    }

    return value !== undefined;
};

const setPath = (object, path, value) => {
    const parent = path.slice(0, -1).reduce((current, key) => {
        if (!isPlainObject(current[key])) {
            current[key] = {};
        }

        return current[key];
    }, object);

    parent[path[path.length - 1]] = cloneValue(value);
};

const deletePath = (object, path) => {
    const parent = getPath(object, path.slice(0, -1));

    if (parent) {
        delete parent[path[path.length - 1]];
    }
};

const flattenDefaults = (object, path = [], output = new Map()) => {
    Object.entries(object).forEach(([key, value]) => {
        const nextPath = [...path, key];

        if (isPlainObject(value)) {
            flattenDefaults(value, nextPath, output);
        } else {
            output.set(JSON.stringify(nextPath), { path: nextPath, value });
        }
    });

    return output;
};

const equalColor = (first, second) => (Array.isArray(first) && Array.isArray(second) ? first.length === second.length && first.every((value, index) => value === second[index]) : first === second);

const readRendererTheme = (root) => {
    const view = root?.ownerDocument.defaultView;

    if (!view?.getComputedStyle) {
        return null;
    }

    const style = view.getComputedStyle(root);
    const values = Object.fromEntries(rendererTokenNames.map((name) => [name, style.getPropertyValue(`--mantle-chart-theme-${name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`).trim()]));

    if (!values.textColor) {
        return null;
    }

    // Resolve modern CSS color expressions (including color-mix and inherited
    // variables) into canvas colors without introducing a layout wrapper.
    const probe = root.ownerDocument.createElement('span');

    probe.style.display = 'none';
    probe.setAttribute('aria-hidden', 'true');
    root.appendChild(probe);

    let colorContext;
    let attemptedContext = false;

    const normalizeColor = (value) => {
        // Chart.js's hover/animation parser accepts RGB but cannot parse modern
        // browser serialization. Read the same sRGB pixels the chart will draw.
        if (!/^(?:color|color-mix|lab|lch|oklab|oklch|hwb|light-dark)\(/i.test(value)) {
            return value;
        }

        try {
            if (!attemptedContext) {
                const canvas = root.ownerDocument.createElement('canvas');

                canvas.width = 1;
                canvas.height = 1;
                attemptedContext = true;
                colorContext = canvas.getContext('2d', { colorSpace: 'srgb', willReadFrequently: true });
            }

            if (!colorContext) {
                return value;
            }

            colorContext.clearRect(0, 0, 1, 1);
            colorContext.fillStyle = '#010203';
            colorContext.fillStyle = value;

            if (colorContext.fillStyle === '#010203') {
                colorContext.fillStyle = '#040506';
                colorContext.fillStyle = value;

                if (colorContext.fillStyle === '#040506') {
                    return value;
                }
            }

            colorContext.fillRect(0, 0, 1, 1);

            const [red, green, blue, alpha] = colorContext.getImageData(0, 0, 1, 1).data;

            return alpha === 255 ? `rgb(${red}, ${green}, ${blue})` : `rgba(${red}, ${green}, ${blue}, ${alpha / 255})`;
        } catch {
            // Retain the browser color if canvas access is unavailable.
            return value;
        }
    };

    try {
        rendererTokenNames
            .filter((name) => name !== 'tooltipBorderWidth')
            .forEach((name) => {
                if (values[name]) {
                    probe.style.color = '';
                    probe.style.color = values[name];
                    values[name] = normalizeColor(view.getComputedStyle(probe).color);
                }
            });
    } finally {
        probe.remove();
    }

    values.tooltipBorderWidth = Number.parseFloat(values.tooltipBorderWidth) || 0;

    return values;
};

const getScaleIds = (props) => {
    const scales = props.options?.scales;
    const ids = new Set(isPlainObject(scales) ? Object.keys(scales) : []);
    const types = new Set([props.type, ...(props.data?.datasets || []).map((dataset) => dataset.type)].filter(Boolean));
    const cartesian = ['bar', 'line', 'scatter', 'bubble'].some((type) => types.has(type));
    const radial = ['radar', 'polarArea'].some((type) => types.has(type));

    if (cartesian) {
        ['x', 'y'].forEach((axis) => {
            const datasetIds = (props.data?.datasets || []).map((dataset) => dataset[`${axis}AxisID`]).filter(Boolean);

            datasetIds.forEach((id) => ids.add(id));

            if (!datasetIds.length && !Array.from(ids).some((id) => (scales?.[id]?.axis || id[0]) === axis)) {
                ids.add(axis);
            }
        });
    }

    if (radial && !Array.from(ids).some((id) => (scales?.[id]?.axis || id[0]) === 'r')) {
        ids.add('r');
    }

    return Array.from(ids);
};

const getRendererDefaults = (props, theme) => {
    if (!theme) {
        return {};
    }

    const textColor = props.options?.color ?? theme.textColor;
    const mutedColor = props.options?.color ?? (theme.mutedColor || theme.textColor);
    const borderColor = props.options?.borderColor ?? theme.borderColor;
    const gridColor = props.options?.borderColor ?? theme.gridColor;

    return {
        color: textColor,
        borderColor,
        backgroundColor: theme.primaryColor || theme.textColor,
        plugins: {
            legend: { labels: { color: textColor } },
            title: { color: textColor },
            subtitle: { color: mutedColor },
            tooltip: {
                backgroundColor: theme.tooltipBackground || theme.backgroundColor,
                titleColor: theme.tooltipColor || theme.textColor,
                bodyColor: theme.tooltipColor || theme.textColor,
                footerColor: theme.tooltipColor || theme.textColor,
                borderColor: theme.tooltipBorderColor || theme.borderColor,
                borderWidth: theme.tooltipBorderWidth
            }
        },
        scales: Object.fromEntries(
            getScaleIds(props).map((id) => [
                id,
                {
                    grid: { color: gridColor, tickColor: gridColor },
                    border: { color: borderColor },
                    ticks: { color: mutedColor, backdropColor: theme.backgroundColor },
                    title: { color: textColor },
                    angleLines: { color: gridColor },
                    pointLabels: { color: mutedColor }
                }
            ])
        )
    };
};

const canThemeDatasetColor = (props, dataset, field) => {
    const type = dataset.type || props.type;
    const elements = type === 'bar' ? ['bar'] : ['pie', 'doughnut', 'polarArea'].includes(type) ? ['arc'] : ['line', 'radar'].includes(type) ? ['line', 'point'] : ['point'];
    const options = props.options;

    return dataset[field] === undefined && options?.[field] === undefined && options?.datasets?.[type]?.[field] === undefined && elements.every((element) => options?.elements?.[element]?.[field] === undefined);
};

const getDatasetDefaults = (props, theme) => {
    const defaults = new Map();

    if (!theme) {
        return defaults;
    }

    const palette = ['primaryColor', 'secondaryColor', 'successColor', 'infoColor', 'warningColor', 'dangerColor', 'helpColor'].map((name) => theme[name]).filter(Boolean);

    if (!palette.length) {
        palette.push(theme.textColor);
    }

    (props.data?.datasets || []).forEach((dataset, index) => {
        const type = dataset.type || props.type;
        const perPoint = ['pie', 'doughnut', 'polarArea'].includes(type);
        const background = perPoint ? (dataset.data || []).map((_, point) => palette[(index + point) % palette.length]) : palette[index % palette.length];

        datasetColorFields.forEach((field) => {
            if (canThemeDatasetColor(props, dataset, field)) {
                defaults.set(`${index}.${field}`, { index, field, value: field === 'borderColor' && perPoint ? theme.backgroundColor || background : background });
            }
        });
    });

    return defaults;
};

const createConfiguration = (props, theme) => {
    const defaults = getRendererDefaults(props, theme);
    const data = cloneValue(props.data);
    const datasetDefaults = getDatasetDefaults(props, theme);

    datasetDefaults.forEach(({ index, field, value }) => {
        data.datasets[index][field] = cloneValue(value);
    });

    return {
        configuration: { type: props.type, data, options: theme ? mergeDefaults(defaults, props.options ?? {}) : cloneValue(props.options), plugins: props.plugins },
        optionDefaults: new Map(Array.from(flattenDefaults(defaults)).filter(([, entry]) => !hasOverride(props.options ?? {}, entry.path))),
        datasetDefaults
    };
};

const snapshotDatasetDefaults = (props, chart, defaults = new Map(), manualColors = new Set()) => {
    (chart.data?.datasets || []).forEach((dataset, index) => {
        datasetColorFields.forEach((field) => {
            const key = `${index}.${field}`;

            if (!manualColors.has(key) && canThemeDatasetColor(props, props.data?.datasets?.[index] || dataset, field)) {
                defaults.set(key, { index, field, value: cloneValue(dataset[field]) });
            }
        });
    });

    return defaults;
};

const updateRendererTheme = (chart, props, theme, state) => {
    const nextOptions = new Map(Array.from(flattenDefaults(getRendererDefaults(props, theme))).filter(([, entry]) => !hasOverride(props.options ?? {}, entry.path)));
    const currentOptions = chart.config.options;
    const ownedOptions = new Map();
    let changed = false;

    state.optionDefaults.forEach(({ path, value }, key) => {
        if (!nextOptions.has(key) && equalColor(getPath(currentOptions, path), value)) {
            deletePath(currentOptions, path);
            changed = true;
        }
    });

    nextOptions.forEach(({ path, value }, key) => {
        const previous = state.optionDefaults.get(key);
        const current = getPath(currentOptions, path);

        if ((previous && equalColor(current, previous.value)) || (!previous && current === undefined)) {
            setPath(currentOptions, path, value);
            ownedOptions.set(key, { path, value });
            changed = changed || !equalColor(current, value);
        }
    });

    const nextDatasets = getDatasetDefaults(props, theme);
    const ownedDatasets = new Map();

    new Set([...state.datasetDefaults.keys(), ...nextDatasets.keys()]).forEach((key) => {
        const previous = state.datasetDefaults.get(key);
        const next = nextDatasets.get(key);
        const { index, field } = next || previous;
        const dataset = chart.data?.datasets?.[index];

        if (!dataset || state.manualColors.has(key)) {
            return;
        }

        const current = dataset[field];

        if ((previous && equalColor(current, previous.value)) || (!previous && current === undefined)) {
            if (next) {
                dataset[field] = cloneValue(next.value);
                ownedDatasets.set(key, next);
            } else {
                delete dataset[field];
            }

            changed = changed || !equalColor(current, next?.value);
        } else {
            state.manualColors.add(key);
        }
    });

    state.optionDefaults = ownedOptions;
    state.datasetDefaults = ownedDatasets;

    if (changed) {
        // The normal public update path refreshes shared element options as well
        // as scales, and keeps the caller's animation configuration intact.
        chart.update();
    }

    // Chart.js's Colors plugin may supply its ordinary fallback palette when
    // token theming is removed. Track those defaults for a later reactivation.
    snapshotDatasetDefaults(props, chart, state.datasetDefaults, state.manualColors);
};

const getParentElement = (element) => element.parentElement || element.getRootNode()?.host;
const containsStylesheet = (node) => node.nodeType === 1 && (node.matches('style, link[rel="stylesheet"]') || node.querySelector('style, link[rel="stylesheet"]'));

const MantleUIChart = React.memo(
    React.forwardRef((inProps, ref) => {
        const mergeProps = useMergeProps();
        const context = React.useContext(MantleContext);
        const props = ChartBase.getProps(inProps, context);

        const { ptm, cx, sx, isUnstyled } = ChartBase.setMetaData({
            props
        });

        useHandleStyle(ChartBase.css.styles, isUnstyled, { name: 'chart' });
        const elementRef = React.useRef(null);
        const chartRef = React.useRef(null);
        const canvasRef = React.useRef(null);
        const propsRef = React.useRef(props);
        const themeStateRef = React.useRef(null);
        const themeSignatureRef = React.useRef('');
        const synchronizeThemeRef = React.useRef(() => {});
        const unstyled = isUnstyled();

        propsRef.current = props;

        React.useImperativeHandle(ref, () => ({
            props,
            getCanvas: () => canvasRef.current,
            getChart: () => chartRef.current,
            getBase64Image: () => chartRef.current?.toBase64Image(),
            getElement: () => elementRef.current,
            generateLegend: () => chartRef.current?.generateLegend?.(),
            refresh: () => {
                synchronizeThemeRef.current();

                return chartRef.current?.update();
            }
        }));

        React.useEffect(() => {
            let cancelled = false;
            let instance;
            const chartProps = propsRef.current;

            const createChart = (Constructor) => {
                if (cancelled || !canvasRef.current) {
                    return;
                }

                const theme = unstyled ? null : readRendererTheme(elementRef.current);
                const { configuration, optionDefaults, datasetDefaults } = createConfiguration(chartProps, theme);

                instance = new Constructor(canvasRef.current, configuration);
                chartRef.current = instance;
                themeSignatureRef.current = JSON.stringify(theme);
                themeStateRef.current = { optionDefaults, datasetDefaults, manualColors: new Set() };
                snapshotDatasetDefaults(chartProps, instance, datasetDefaults);
            };

            if (ChartJS) {
                createChart(ChartJS);
            } else {
                import('chart.js/auto').then((module) => createChart(module.default || module));
            }

            return () => {
                cancelled = true;
                instance?.destroy();

                if (chartRef.current === instance) {
                    chartRef.current = null;
                    themeStateRef.current = null;
                }
            };
        }, [props.data, props.options, props.plugins, props.type, unstyled]);

        React.useEffect(() => {
            const root = elementRef.current;

            if (unstyled || !root) {
                synchronizeThemeRef.current = () => {};

                return;
            }

            const document = root.ownerDocument;
            const view = document.defaultView;

            const synchronize = () => {
                const theme = readRendererTheme(root);
                const signature = JSON.stringify(theme);

                if (signature !== themeSignatureRef.current) {
                    themeSignatureRef.current = signature;

                    if (chartRef.current && themeStateRef.current) {
                        updateRendererTheme(chartRef.current, propsRef.current, theme, themeStateRef.current);
                    }
                }
            };

            const observer = view.MutationObserver
                ? new view.MutationObserver((records) => {
                      const ancestors = new Set();

                      for (let element = root; element; element = getParentElement(element)) {
                          ancestors.add(element);
                      }

                      if (
                          records.some(
                              (record) =>
                                  (record.type === 'attributes' && ancestors.has(record.target)) ||
                                  record.target.nodeName === 'STYLE' ||
                                  record.target.parentElement?.nodeName === 'STYLE' ||
                                  Array.from(record.addedNodes).some((node) => containsStylesheet(node) || node.contains(root)) ||
                                  Array.from(record.removedNodes).some((node) => containsStylesheet(node) || node.contains(root))
                          )
                      ) {
                          synchronize();
                          observeShadowRoots();
                      }
                  })
                : null;
            const observationOptions = { attributes: true, characterData: true, childList: true, subtree: true };

            const observeShadowRoots = () => {
                for (let element = root; element; element = getParentElement(element)) {
                    const tree = element.getRootNode();

                    if (tree !== document) {
                        observer?.observe(tree, observationOptions);
                    }
                }
            };

            const onStylesheetLoad = (event) => {
                if (event.target?.nodeName === 'LINK') {
                    synchronize();
                }
            };

            const mediaQuery = view.matchMedia?.('(prefers-color-scheme: dark)');

            synchronizeThemeRef.current = synchronize;
            synchronize();
            observer?.observe(document.documentElement, observationOptions);
            observeShadowRoots();
            document.addEventListener('load', onStylesheetLoad, true);

            if (mediaQuery?.addEventListener) {
                mediaQuery.addEventListener('change', synchronize);
            } else {
                mediaQuery?.addListener?.(synchronize);
            }

            return () => {
                synchronizeThemeRef.current = () => {};

                observer?.disconnect();
                document.removeEventListener('load', onStylesheetLoad, true);

                if (mediaQuery?.removeEventListener) {
                    mediaQuery.removeEventListener('change', synchronize);
                } else {
                    mediaQuery?.removeListener?.(synchronize);
                }
            };
        }, [unstyled]);

        const title = props.options && props.options.plugins && props.options.plugins.title && props.options.plugins.title.text;
        const ariaLabel = props.ariaLabel || title;
        const rootProps = mergeProps(
            ptm('root'),
            {
                id: props.id,
                ref: elementRef,
                style: sx('root'),
                className: classNames(props.className, cx('root'))
            },
            ChartBase.getOtherProps(props)
        );
        const canvasProps = mergeProps(
            {
                ref: canvasRef,
                width: props.width,
                height: props.height,
                role: 'img',
                'aria-label': ariaLabel
            },
            ptm('canvas')
        );

        return (
            <div {...rootProps}>
                <canvas {...canvasProps} />
            </div>
        );
    })
);

MantleUIChart.displayName = 'Chart';

export { MantleUIChart as Chart };
