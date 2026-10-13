/**
 *
 * This module contains common options and types of components that use KeyFilter.
 *
 * @module keyfilter
 *
 */

/**
 * Defines the type of keyfilter property in components.
 *
 * @see {@link inputtext}
 * @see {@link password}
 * ...
 */
export type KeyFilterType = 'pint' | 'int' | 'pnum' | 'money' | 'num' | 'hex' | 'email' | 'alpha' | 'alphanum' | RegExp;

export declare const KeyFilter: {
    DEFAULT_MASKS: Record<Exclude<KeyFilterType, RegExp>, RegExp>;
    getRegex(keyfilter: KeyFilterType): RegExp;
    onBeforeInput(event: InputEvent, keyfilter: KeyFilterType, validateOnly?: boolean): void;
    onKeyPress(event: KeyboardEvent, keyfilter: KeyFilterType, validateOnly?: boolean): void;
    onPaste(event: ClipboardEvent, keyfilter: KeyFilterType, validateOnly?: boolean): void;
    validateKey(event: { preventDefault(): void }, key: string | null | undefined, keyfilter: KeyFilterType): void;
    validate(event: { target: { value: string } }, keyfilter: KeyFilterType): boolean;
};
