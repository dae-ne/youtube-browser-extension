/**
 * Finds the video element and sets the loop property.
 *
 * @returns The status of the function and the parameters.
 */
export function loopVideo() {
  const video = document.querySelector('video');

  if (!video) {
    return { status: 'fail', params: {} };
  }

  video.loop = true;
  return { status: 'success', params: {} };
}
