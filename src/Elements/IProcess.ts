export type IProcess = (
  el: HTMLElement,
  variables: Map<string, any>
) => Promise<string>;
