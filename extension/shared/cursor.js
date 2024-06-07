(() => {
  'use strict';

  const FLASHLIGHT_HIDDEN_CLASS = 'yte-flashlight-hidden';

  const container = document.querySelector('.yte-flashlight-container');
  container.classList.add(FLASHLIGHT_HIDDEN_CLASS);

  document.addEventListener('mousemove', (e) => {
    const style = getComputedStyle(document.documentElement);
    const sizeAsString = style.getPropertyValue('--flashlight-size');
    const size = parseInt(sizeAsString.slice(0, -2), 10);

    const getFlashlightPosition = (mousePosition, size) => `${mousePosition - size / 2}px`;

    document.documentElement.style.setProperty('--flashlight-y', getFlashlightPosition(e.pageY, size));
    document.documentElement.style.setProperty('--flashlight-x', getFlashlightPosition(e.pageX, size));
  });

  container.addEventListener('mouseleave', () => {
    container.classList.add(FLASHLIGHT_HIDDEN_CLASS);
  });

  container.addEventListener('mouseenter', () => {
    container.classList.remove(FLASHLIGHT_HIDDEN_CLASS);
  });
})();
