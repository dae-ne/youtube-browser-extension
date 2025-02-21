<script lang="ts">
  export let id: string | undefined = undefined;
  export let ariaLabel: string | undefined = undefined;
  export let overlayDark = false;
  export let onClick: (() => void) | undefined = undefined;

  let isMouseDown = false;

  function handleMouseDown() {
    isMouseDown = true;
  }

  function handleMouseUp() {
    isMouseDown = false;
  }
</script>

<div id={id} class="button-container ytd-reel-player-overlay-renderer">
  <div class="ytd-reel-player-overlay-renderer">
    <label
      class="yt-spec-button-shape-with-label"
      class:yt-spec-button-shape-with-label--is-overlay={overlayDark}
      class:yt-spec-touch-feedback-shape--down={isMouseDown}
    >
      <button
        class="yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-l yt-spec-button-shape-next--icon-button"
        class:yt-spec-button-shape-next--overlay-dark={overlayDark}
        aria-label={ariaLabel}
        on:click={onClick}
        on:mousedown={handleMouseDown}
        on:mouseup={handleMouseUp}
        on:mouseleave={handleMouseUp}
      >
        <div class="yt-spec-button-shape-next__icon" aria-hidden="true">
          <slot />
        </div>
        <div style="border-radius: inherit;">
          <div
            class="yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response"
            class:yt-spec-touch-feedback-shape--overlay-touch-response-inverse={overlayDark}
          >
            <div class="yt-spec-touch-feedback-shape__stroke"></div>
            <div class="yt-spec-touch-feedback-shape__fill"></div>
          </div>
        </div>
      </button>
    </label>
  </div>
</div>
