<script lang="ts">
  import { ShortsActionButton } from 'ui/shorts';
  import { IoLogoYouTube } from 'ui/icons';

  export let overlayDark = false;
  export let onClick: () => void;
</script>

<ShortsActionButton
  id="yte-shorts-to-video-button"
  overlayDark={overlayDark}
  onClick={onClick}
>
  <IoLogoYouTube />
</ShortsActionButton>
