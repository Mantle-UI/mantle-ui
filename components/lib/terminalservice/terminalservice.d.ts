/**
 *
 * Terminal is a text based user interface.
 *
 * [Live Demo](https://www.primereact.org/terminal/)
 *
 * @module terminalservice
 *
 */

/**
 * Custom terminal service options.
 */
export interface TerminalServiceOptions {
    /**
     * Method to attach an event listener to a specific action.
     * @param {'command' | 'response' | 'clear'} action - Custom listener.
     * @param {*} fn - Custom listener.
     */
    on(action: 'command' | 'response' | 'clear', fn: any): void;
    /**
     * Method to emit an event for a specific action.
     * @param {'command' | 'response' | 'clear'} action - Custom listener.
     * @param {*} params - Custom listener.
     */
    emit(action: 'command' | 'response' | 'clear', params?: any): void;
    /**
     * Method to detach an event listener from a specific action.
     * @param {'command' | 'response' | 'clear'} action - Custom listener.
     * @param {*} fn - Custom listener.
     */
    off(action: 'command' | 'response' | 'clear', fn: any): void;
}

/**
 * **MantleUI - TerminalService**
 *
 * _Terminal is a text based user interface._
 *
 * [Live Demo](https://www.primereact.org/terminal/)
 * --- ---
 * ![MantleUI](/images/mantle-ui-logo.png)
 *
 * @group Component
 */
export declare const TerminalService: TerminalServiceOptions;
