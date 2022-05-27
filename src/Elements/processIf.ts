import type { IProcess } from "./IProcess.js";
import { evaluate, parseArgs } from "./helpers.js";
import { process } from "../process.js";

/**
 * ```html
 * <if condition="Boolean(Math.round(Math.random()))">
 *   <p>true</p>
 * </if>
 * <else>
 *   <p>false</p>
 * </else>
 * ```
 */
export const processIf: IProcess = async(el, debug: boolean) => {
  const args = parseArgs(el, ["condition"]);

  if (debug) {
    console.debug("Arguments", args);
  }

  const elseEl = el.nextElementSibling;

  const evalCond = await evaluate(args.condition)
  if (debug) {
    console.debug("Evaluated to", evalCond);
  }

  if (evalCond) {
    await process(el, debug);

    if (elseEl) {
      elseEl.remove();
    }

    el.outerHTML = el.innerHTML;
  } else if (elseEl && elseEl.tagName === "ELSE") {
    await process(el, debug);

    el.outerHTML = elseEl.innerHTML;

    elseEl.remove();
  } else {
    el.remove();
  }
};
