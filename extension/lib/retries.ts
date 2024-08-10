import { type Result } from 'result';

/**
 * The default initial interval in milliseconds for recurring tasks. After each retry, the interval
 * is multiplied by the `INTERVAL_MULTIPLIER` constant.
 */
const DEFAULT_INITIAL_INTERVAL_MS = 50;

/**
 * The default multiplier for the interval in milliseconds for recurring tasks. It's used to
 * increase the interval after each retry.
 */
const DEFAULT_INTERVAL_MULTIPLIER = 2;

/**
 * The default maximum interval in milliseconds for recurring tasks.
 */
const DEFAULT_MAX_INTERVAL_MS = 1000;

/**
 * The default maximum number of retries for recurring tasks.
 */
const DEFAULT_MAX_NUMBER_OF_RETRIES = 20;

/**
 * The callback function type.
 */
export type Callback = {
  (params: object): Result;
};

/**
 * The options for the retry logic.
 */
export type RetryOptions = {
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
 * @param callbackParameters - The parameters to pass to the callback function.
 * @param options - The options to configure the retry logic.
 * @param retries - The retry count.
 */
export function handleRetries(
  callback: Callback,
  callbackParameters: object = {},
  options: RetryOptions = {},
  retries = 0
): void {
  const {
    intervalMs = DEFAULT_INITIAL_INTERVAL_MS,
    intervalMultiplayer = DEFAULT_INTERVAL_MULTIPLIER,
    maxIntervalMs = DEFAULT_MAX_INTERVAL_MS,
    maxRetries = DEFAULT_MAX_NUMBER_OF_RETRIES
  } = options;

  const { status, params } = callback(callbackParameters);

  if (status === 'success' || retries >= maxRetries) {
    return;
  }

  const newIntervalMs = intervalMs * intervalMultiplayer;

  const newOptions = {
    ...options,
    intervalMs: newIntervalMs > maxIntervalMs ? maxIntervalMs : newIntervalMs
  };

  setTimeout(() => {
    handleRetries(callback, params, newOptions, retries + 1);
  }, intervalMs);
}
