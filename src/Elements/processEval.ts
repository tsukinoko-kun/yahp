import type { IProcess } from "./IProcess";
import { evaluate } from "./helpers";

/**
 * ```html
 * <script eval>
 *   const r = Math.random() * 100;
 *   r.toFixed(2);
 * </script>
 * ```
 */
export const processEval: IProcess = async (el, debug: boolean) => {
  if (!el.hasAttribute("eval")) {
    return;
  }

  const value = await evaluate((el as HTMLScriptElement).text);

  if (debug) {
    console.debug({ value });
  }

  if (typeof value === "object") {
    el.outerHTML = JSON.stringify(value, null, 2);
  } else {
    el.outerHTML = String(value);
  }
};
