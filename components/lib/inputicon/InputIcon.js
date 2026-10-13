import React, { useContext, useRef } from 'react';
import { useHandleStyle } from '../componentbase/ComponentBase';
import { useMergeProps } from '../hooks/Hooks';
import { MantleContext } from '../api/Api';
import { InputIconBase } from './InputIconBase';
import { classNames } from '../utils/Utils';

export const InputIcon = React.memo(
    React.forwardRef((inProps, ref) => {
        const elementRef = useRef(ref);
        const mergeProps = useMergeProps();
        const context = useContext(MantleContext);
        const props = InputIconBase.getProps(inProps, context);

        const { ptm, cx, isUnstyled } = InputIconBase.setMetaData({
            props,
            ...props.__parentMetadata,
            context: {
                iconPosition: props.iconPosition
            }
        });

        useHandleStyle(InputIconBase.css.styles, isUnstyled, { name: 'inputicon', styled: true });

        const rootProps = mergeProps(
            ptm('root'),
            {
                className: classNames(props.className, cx('root'))
            },
            InputIconBase.getOtherProps(props)
        );

        return (
            <>
                <span {...rootProps} ref={elementRef}>
                    {props.children}
                </span>
            </>
        );
    })
);

InputIcon.displayName = 'InputIcon';
