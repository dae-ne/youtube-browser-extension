/**
 * The default initial interval in milliseconds for recurring tasks. After each
 * retry, the interval is multiplied by the `INTERVAL_MULTIPLIER` constant.
 *
 * @constant
 * @type {number}
 * @default
 */
export const INITIAL_INTERVAL_MS = 10;

/**
 * The multiplier for the interval in milliseconds for recurring tasks.
 * It's used to increase the interval after each retry.
 *
 * @constant
 * @type {number}
 * @default
 */
export const INTERVAL_MULTIPLIER = 2;

/**
 * The maximum interval in milliseconds for recurring tasks.
 *
 * @constant
 * @type {number}
 * @default
 */
export const MAX_INTERVAL_MS = 1000;

/**
 * The maximum number of retries for recurring tasks.
 *
 * @constant
 * @type {number}
 * @default
 */
export const MAX_NUMBER_OF_RETRIES = 20;
