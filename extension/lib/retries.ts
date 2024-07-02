/**
 * The default initial interval in milliseconds for recurring tasks. After each retry, the interval
 * is multiplied by the `INTERVAL_MULTIPLIER` constant.
 */
const INITIAL_INTERVAL_MS = 10;

/**
 * The multiplier for the interval in milliseconds for recurring tasks. It's used to increase the
 * interval after each retry.
 */
const INTERVAL_MULTIPLIER = 2;

/**
 * The maximum interval in milliseconds for recurring tasks.
 */
const MAX_INTERVAL_MS = 1000;

/**
 * The maximum number of retries for recurring tasks.
 */
const MAX_NUMBER_OF_RETRIES = 20;

/**
 * The callback function type.
 */
type Callback = {
  (params: object): { status: string; params: object };
};

/**
 * The options for the retry logic.
 */
type RetryOptions = {
  intervalMs?: number;
  intervalMultiplayer?: number;
  maxIntervalMs?: number;
  maxRetries?: number;
};

/**
 * Handles the retry logic for a callback function. It retries the callback function with
 * an increasing interval between retries.
 *
 * @param callback - The callback function to retry.
 * @param options - The options to configure the retry logic.
 * @param retries - The retry count.
 */
export function handleRetries(callback: Callback, options: RetryOptions = {}, retries = 0) {
  const {
    intervalMs = INITIAL_INTERVAL_MS,
    intervalMultiplayer = INTERVAL_MULTIPLIER,
    maxIntervalMs = MAX_INTERVAL_MS,
    maxRetries = MAX_NUMBER_OF_RETRIES
  } = options;

  const { status, params } = callback({});

  if (status === 'success' || retries >= maxRetries) {
    return;
  }

  const newIntervalMs = intervalMs * intervalMultiplayer;

  const newOptions = {
    ...options,
    intervalMs: newIntervalMs > maxIntervalMs ? maxIntervalMs : newIntervalMs
  };

  setTimeout(() => {
    handleRetries(() => callback(params), newOptions, ++retries);
  }, intervalMs);
}
