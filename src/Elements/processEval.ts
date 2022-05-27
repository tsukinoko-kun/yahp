import type { IProcess } from "./IProcess.js";
import { evaluate } from "./helpers.js";

/**
 * ```html
 * <script eval>
 *   const r = Math.random() * 100;
 *   return r.toFixed(2);
 * </script>
 * ```
 */
export const processEval: IProcess = async(el, debug: boolean) => {
  if (!el.hasAttribute("eval")) {
    return;
  }

  const value = await evaluate((el as HTMLScriptElement).text, false);

  if (debug) {
    console.debug("Evaluated to", value);
  }

  if (typeof value === "object") {
    el.outerHTML = JSON.stringify(value, null, 2);
  } else {
    el.outerHTML = String(value);
  }
};
