import * as React from 'react';
import { MantleContext } from '../api/Api';
import { useHandleStyle } from '../componentbase/ComponentBase';
import { StepperPanelBase } from './StepperPanelBase';

export const StepperPanel = React.memo(
    React.forwardRef((inProps, ref) => {
        const context = React.useContext(MantleContext);
        const props = StepperPanelBase.getProps(inProps, context);
        const { isUnstyled } = StepperPanelBase.setMetaData({
            props
        });

        useHandleStyle(StepperPanelBase.css.styles, isUnstyled, { name: 'StepperPanel' });

        return <span ref={ref}>{props.children}</span>;
    })
);

StepperPanel.displayName = 'StepperPanel';
