import { describe, Enumerable } from "@frank-mayer/magic";
import type { IProcess } from "./Elements/IProcess";

declare const processMap: ReadonlyMap<string, IProcess>;

export const process = async (rootEl: Element, debug: boolean = false) => {
  const selector = Enumerable.from(processMap)
    .select((x) => x[0])
    .join(",");

  let el: HTMLElement | null;
  while ((el = rootEl.querySelector(selector))) {
    if (debug) {
      console.debug(`Processing ${describe(el)}`);
    }

    const fun = processMap.get(el.tagName)!;
    await fun(el, debug);
  }
};
