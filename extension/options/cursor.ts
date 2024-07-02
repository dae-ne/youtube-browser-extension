/**
 * This file contains the code for the flashlight cursor effect. The flashlight follows the mouse
 * cursor and slightly illuminates the area around it.
 */

(() => {
  /**
   * The class name for the flashlight container when the effect should not be visible.
   */
  const FLASHLIGHT_HIDDEN_CLASS = 'yte-flashlight-hidden';

  /**
   * The flashlight container element. The following flashlight effect is a pseudo element inside
   * this container.
   */
  const container = document.querySelector('.yte-flashlight-container') as HTMLElement;
  container.classList.add(FLASHLIGHT_HIDDEN_CLASS);

  /**
   * Updates the flashlight position based on the mouse cursor position.
   */
  document.addEventListener('mousemove', event => {
    const style = getComputedStyle(document.documentElement);
    const sizeAsString = style.getPropertyValue('--flashlight-size');
    const size = parseInt(sizeAsString.slice(0, -2), 10);

    const getFlashlightPosition = (mousePosition, size) => `${mousePosition - size / 2}px`;

    document.documentElement.style.setProperty(
      '--flashlight-y',
      getFlashlightPosition(event.pageY, size)
    );
    document.documentElement.style.setProperty(
      '--flashlight-x',
      getFlashlightPosition(event.pageX, size)
    );
  });

  /**
   * Hides the flashlight when the mouse cursor leaves the container.
   */
  container.addEventListener('mouseleave', () => {
    container.classList.add(FLASHLIGHT_HIDDEN_CLASS);
  });

  /**
   * Shows the flashlight when the mouse cursor enters the container.
   */
  container.addEventListener('mouseenter', () => {
    container.classList.remove(FLASHLIGHT_HIDDEN_CLASS);
  });
})();
