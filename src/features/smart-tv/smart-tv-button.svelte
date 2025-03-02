<script lang="ts">
  import GuideButton from 'ui/guide-button.svelte';
  import { IoTvOutline } from 'ui/icons';

  export let id: string | undefined = undefined;
  export let mini = false;
  export let onClick: (() => void) | undefined = undefined;
</script>

<GuideButton id={id} mini={mini} onClick={onClick} label="Smart TV">
  <IoTvOutline width="24" height="24" />
</GuideButton>
