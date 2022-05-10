import type { IProcess } from "./IProcess";
import { evaluate, get, parseArgs, set } from "./helpers";
import { process } from "../process";

/**
 * ```html
 * <define var="i" value="1">
 * ```
 */
export const processDefine: IProcess = async(el, debug: boolean) => {
  const args = parseArgs(el, "var", "value");

  if (debug) {
    console.debug({ args });
  }

  const value = await evaluate(args.value);

  if (debug) {
    console.debug({ value });
  }

  const temp = get(args.var);

  set(args.var, value);

  await process(el, debug);

  set(args.var, temp);

  el.outerHTML = el.innerHTML;
};
