<script lang="ts">
  import { ShortsActionButton } from 'ui';
  import { IoLogoYouTube } from 'ui/icons';

  export let overlayDark = false;
  export let onClick: () => void;
</script>

<ShortsActionButton
  id="yte-shorts-to-video-button"
  ariaLabel="Shorts to video"
  overlayDark={overlayDark}
  onClick={onClick}
>
  <IoLogoYouTube />
</ShortsActionButton>
