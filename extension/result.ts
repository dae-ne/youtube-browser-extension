/**
 * The result of a feature setup function.
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
