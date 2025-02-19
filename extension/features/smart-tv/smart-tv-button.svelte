<script lang="ts">
  import { IoTvOutline } from 'ui/icons';

  export let id: string | undefined = undefined;
  export let mini = false;
  export let onClick: (() => void) | undefined = undefined;
</script>

<div
  id={id}
  class:yte-guide-entry-container={!mini}
  class:ytd-guide-section-renderer={!mini}
  class:ytd-mini-guide-renderer={mini}
>
  <button
    id="endpoint"
    on:click={onClick}
    class="yt-simple-endpoint"
    class:yte-guide-entry={!mini}
    class:yte-mini-guide-entry={mini}
    class:ytd-guide-entry-renderer={!mini}
    class:ytd-mini-guide-entry-renderer={mini}
  >
    <div
      class="guide-icon ytd-guide-entry-renderer"
      class:ytd-guide-entry-renderer={!mini}
      class:ytd-mini-guide-entry-renderer={mini}
    >
      <span class="yt-icon-shape yt-icon yt-spec-icon-shape">
        <IoTvOutline width="24" height="24" />
      </span>
    </div>
    <span
      class="title"
      class:ytd-guide-entry-renderer={!mini}
      class:ytd-mini-guide-entry-renderer={mini}
    >
      Smart TV
    </span>
  </button>
</div>

<style>
  .yte-guide-entry-container {
    width: calc(100% - 12px);
  }

  button {
    background: transparent;
    color: inherit;
    border: none;
    font: inherit;
    cursor: pointer;
    outline: inherit;
    width: 100%;
  }

  .yte-guide-entry {
    padding: 0 12px;

    & .title {
      text-align: start;
    }
  }

  .yte-mini-guide-entry {
    padding: 16px 0 14px;
    outline: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
</style>
