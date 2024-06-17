/**
 * The interval in milliseconds for recurring tasks.
 *
 * @constant
 * @type {number}
 * @default
 */
const INTERVAL_MS = 200;

/**
 * Finds the video element and sets the loop property.
 *
 * @param {boolean} loop - The value to set the loop property to.
 */
export function loopVideo(loop = true) {
  const video = document.querySelector('video');

  if (!video) {
    setTimeout(() => loopVideo(loop), INTERVAL_MS);
    return;
  }

  video.loop = loop;
}
