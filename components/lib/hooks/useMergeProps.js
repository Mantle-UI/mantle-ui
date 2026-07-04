import { useContext } from 'react';
import { MantleContext } from '../api/Api';
import { mergeProps } from '../utils/Utils';

/**
 * Hook to merge properties including custom merge function for things like Tailwind merge.
 */
export const useMergeProps = () => {
    const context = useContext(MantleContext);

    return (...props) => {
        return mergeProps(props, context?.ptOptions);
    };
};
