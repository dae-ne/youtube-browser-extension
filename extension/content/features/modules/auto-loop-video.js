/**
 * Finds the video element and sets the loop property.
 *
 * @param {boolean} loop - The value to set the loop property to.
 */
export function loopVideo(loop = true) {
  const video = document.querySelector('video');

  if (!video) {
    return;
  }

  video.loop = loop;
}
