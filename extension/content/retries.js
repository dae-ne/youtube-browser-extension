/**
 * The default initial interval in milliseconds for recurring tasks. After each
 * retry, the interval is multiplied by the `INTERVAL_MULTIPLIER` constant.
 *
 * @constant
 * @type {number}
 * @default
 */
const INITIAL_INTERVAL_MS = 10;

/**
 * The multiplier for the interval in milliseconds for recurring tasks.
 * It's used to increase the interval after each retry.
 *
 * @constant
 * @type {number}
 * @default
 */
const INTERVAL_MULTIPLIER = 2;

/**
 * The maximum interval in milliseconds for recurring tasks.
 *
 * @constant
 * @type {number}
 * @default
 */
const MAX_INTERVAL_MS = 1000;

/**
 * The maximum number of retries for recurring tasks.
 *
 * @constant
 * @type {number}
 * @default
 */
const MAX_NUMBER_OF_RETRIES = 20;

/**
 * Handles the retry logic for a callback function. It retries the callback
 * function with an increasing interval between retries.
 *
 * @param {Function} callback - The callback function to retry.
 * @param {Object} options - The options to configure the retry logic.
 * @param {number} options.intervalMs - The interval in milliseconds.
 * @param {number} options.intervalMultiplayer - The multiplier for the interval.
 * @param {number} options.maxIntervalMs - The maximum interval in milliseconds.
 * @param {number} options.maxRetries - The maximum number of retries.
 * @param {number} retries - The retry count.
 */
export function handleRetry(callback, options = {}, retries = 0) {
  const {
    intervalMs = INITIAL_INTERVAL_MS,
    intervalMultiplayer = INTERVAL_MULTIPLIER,
    maxIntervalMs = MAX_INTERVAL_MS,
    maxRetries = MAX_NUMBER_OF_RETRIES,
  } = options;

  if (retries >= maxRetries) {
    return;
  }

  const newIntervalMs = intervalMs * intervalMultiplayer;

  const newOptions = {
    ...options,
    intervalMs: newIntervalMs > maxIntervalMs
      ? maxIntervalMs
      : newIntervalMs
  };

  setTimeout(() => {
    const { status, params } = callback();

    if (status === "fail") {
      handleRetry(() => callback(params), newOptions, ++retries);
    }
  }, intervalMs);
}
