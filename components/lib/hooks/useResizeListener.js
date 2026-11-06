import { useEventListener } from './useEventListener';

export const useResizeListener = ({ target = 'window', listener, when = true }) =>
    useEventListener({
        target,
        type: 'resize',
        listener,
        when
    });
