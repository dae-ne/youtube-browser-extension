(() => {
  const container = document.querySelector('.yte-flashlight-container');
  const flashlight = document.createElement('span');

  flashlight.classList.add('yte-flashlight', 'hidden');
  container.appendChild(flashlight);

  document.addEventListener('mousemove', (e) => {
    const width = flashlight.offsetWidth;
    const height = flashlight.offsetHeight;
    flashlight.style.top = `${e.pageY - height / 2}px`;
    flashlight.style.left = `${e.pageX - width / 2}px`;
  });

  container.addEventListener('mouseleave', () => {
    flashlight.classList.add('hidden');
  });

  container.addEventListener('mouseenter', () => {
    flashlight.classList.remove('hidden');
  });
})();
