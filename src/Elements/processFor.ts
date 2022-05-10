import type { IProcess } from "./IProcess";
import { evaluate, get, parseArgs, set } from "./helpers";
import { process } from "../process";
import { StringBuilder } from "@frank-mayer/magic";

/**
 * ```html
 * <for var="item" of="[1,2,3]">
 *  <div>{{item}}</div>
 * </for>
 * ```
 */
export const processFor: IProcess = async(el, debug: boolean) => {
  const args = parseArgs(el, "var", "of");

  if (debug) {
    console.debug({ args });
  }

  const iter = await evaluate(args.of);

  if (debug) {
    console.debug("iterator", iter);
  }

  if (!iter || typeof iter[Symbol.iterator] !== "function") {
    console.error(iter, "is not iterable");
    throw new Error(`${iter} is not iterable`);
  }

  const temp = get(args.var);
  const html = new StringBuilder();

  const tempHtml = el.innerHTML;
  for (const item of iter as Iterable<unknown>) {
    if (el.innerHTML !== tempHtml) {
      el.innerHTML = tempHtml;
    }

    set(args.var, item);
    await process(el, debug);
    html.appendLine(el.innerHTML);
  }

  set(args.var, temp);

  el.outerHTML = html.toString();
};
