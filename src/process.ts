import { describe } from "@frank-mayer/magic";
import type { IProcess } from "./Elements/IProcess.js";

declare const processMap: ReadonlyMap<string, IProcess>;
declare const selector: string;

export const process = async(rootEl: Element, debug = false) => {

  let el: HTMLElement | null;
  while ((el = rootEl.querySelector(selector))) {
    if (debug) {
      console.debug(`Processing ${describe(el)}`);
      // console.debug("var", getDomThis());
    }

    const fun = processMap.get(el.tagName)!;
    await fun(el, debug);
  }
};
