import * as React from 'react';
import { MeterGroup } from '../../components/lib/metergroup/MeterGroup';
import { OrganizationChart } from '../../components/lib/organizationchart/OrganizationChart';
import { ScrollTop } from '../../components/lib/scrolltop/ScrollTop';
import { SpeedDial } from '../../components/lib/speeddial/SpeedDial';
import { Stepper } from '../../components/lib/stepper/Stepper';
import { StepperPanel } from '../../components/lib/stepperpanel/StepperPanel';

const field = (name, render, selector, path, extra = {}) => ({ name, render, selector, path, property: 'backgroundColor', group: 'advanced', ...extra });
const node = { label: 'Root', expanded: true, children: [{ label: 'Child' }] };

export const advancedSkinCases = [
    field('metergroup-meter', () => <MeterGroup values={[{ label: 'Used', value: 25 }]} />, '.p-metergroup-meter', 'metergroup.meter.background'),
    field(
        'organizationchart-selected',
        () => <OrganizationChart value={[node]} selectionMode="single" selection={node} nodeTemplate={(item) => item.label} />,
        '.p-organizationchart-node-content.p-highlight',
        'organizationchart.node.selectedBackground'
    ),
    field('organizationchart-hover', () => <OrganizationChart value={[node]} selectionMode="single" nodeTemplate={(item) => item.label} />, '.p-organizationchart-node-content', 'organizationchart.node.hoverBackground', { pseudo: ['hover'] }),
    field('speeddial-button', () => <SpeedDial model={[{ label: 'One', icon: 'pi pi-check' }]} />, '.p-speeddial-button', 'speeddial.button.background'),
    field('speeddial-mask', () => <SpeedDial mask visible model={[{ label: 'One', icon: 'pi pi-check' }]} />, '.p-speeddial-mask', 'speeddial.mask.background'),
    field('speeddial-opened', () => <SpeedDial visible model={[{ label: 'One', icon: 'pi pi-check' }]} />, '.p-speeddial-button', 'speeddial.button.openedBackground'),
    field(
        'stepper-active',
        () => (
            <Stepper>
                <StepperPanel header="One">Content</StepperPanel>
                <StepperPanel header="Two">Content</StepperPanel>
            </Stepper>
        ),
        '.p-highlight .p-stepper-number',
        'stepper.number.activeBackground'
    ),
    field(
        'stepper-disabled',
        () => (
            <Stepper linear>
                <StepperPanel header="One">Content</StepperPanel>
                <StepperPanel header="Two">Content</StepperPanel>
            </Stepper>
        ),
        '.p-stepper-header.p-disabled',
        'stepper.header.disabledOpacity',
        { property: 'opacity', value: '0.31', updated: '0.47' }
    ),
    field(
        'scrolltop',
        () => (
            <div data-scroll-parent="" style={{ height: '60px', overflow: 'auto' }}>
                <div style={{ height: '200px' }}>Content</div>
                <ScrollTop target="parent" threshold={0} transitionOptions={{ timeout: 0 }} />
            </div>
        ),
        '.p-scrolltop',
        'scrolltop.root.background',
        {
            prepare: (container) => {
                const parent = container.querySelector('[data-scroll-parent]');

                parent.scrollTop = 10;
                parent.dispatchEvent(new Event('scroll'));
            }
        }
    )
];
