/**
 * The result of a feature setup function.
 *
 * @remarks
 * The `params` object is not supposed to be used when triggering an action. It's rather for the
 * retries functionality to be able to pass additional information when firing the action again.
 * That behavior could be changed, but it requires changes in the action handler.
 */
export type Result = {
  status: 'success' | 'fail';
  params: object;
};

/**
 * Functions for simplifying the creation of feature setup results.
 */
export const results = {
  success: (params: object = {}): Result => ({ status: 'success', params }),
  fail: (params: object = {}): Result => ({ status: 'fail', params })
};
