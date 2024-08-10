declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.svelte' {
  import { ComponentType } from 'svelte';
  const component: ComponentType;
  export default component;
}
