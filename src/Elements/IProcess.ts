export type IProcess = (
  el: HTMLElement,
  variables: Map<string, any>,
  debug: boolean
) => Promise<string>;
