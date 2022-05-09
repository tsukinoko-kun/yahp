import type { IProcess } from "./IProcess";
import { evaluate, parseArgs, set } from "./helpers";

/**
 * ```html
 * <for var="item" of="[1,2,3]">
 *  <div>{{item}}</div>
 * </for>
 * ```
 */
export const processFor: IProcess = async (el, debug: boolean) => {
  const args = parseArgs(el, "var", "of");

  if (debug) {
    console.debug({ args });
  }

  const iter = await evaluate(args.of);

  if (debug) {
    console.debug({ value: iter });
  }

  for (const item of iter) {
    set(args.var, item);
  }

  set(args.var, iter);

  el.outerHTML = el.innerHTML;
};
