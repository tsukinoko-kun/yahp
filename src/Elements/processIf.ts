import type { IProcess } from "./IProcess";
import { evaluate, parseArgs } from "./helpers";
import { process } from "../process";

/**
 * ```html
 * <if condition="Boolean(Math.round(Math.random()))">
 *  <p>true</p>
 * </if>
 * <else>
 *  <p>false</p>
 * </else>
 * ```
 */
export const processIf: IProcess = async (el, debug: boolean) => {
  const args = parseArgs(el, "condition");

  if (debug) {
    console.debug({ args });
  }

  const elseEl = el.nextElementSibling;

  if (await evaluate(args.condition)) {
    for (const childEl of Array.from(el.children)) {
      await process(childEl, debug);
    }

    if (elseEl) {
      elseEl.remove();
    }

    el.outerHTML = el.innerHTML;
  } else if (elseEl && elseEl.tagName === "ELSE") {
    for (const childEl of Array.from(elseEl.children)) {
      await process(childEl, debug);
    }

    el.outerHTML = elseEl.innerHTML;

    elseEl.remove();
  }
};
