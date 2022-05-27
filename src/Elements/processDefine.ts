import type { IProcess } from "./IProcess.js";
import { backup, evaluate, parseArgs, restore, set } from "./helpers.js";
import { process } from "../process.js";

/**
 * ```html
 * <define var="i" value="42">
 *   ...
 * </define>
 * ```
 */
export const processDefine: IProcess = async(el, debug: boolean) => {
  const args = parseArgs(el, ["var", "value"]);

  if (debug) {
    console.debug("Arguments", args);
  }

  const value = await evaluate(args.value);

  if (debug) {
    console.debug("Evaluated to", value);
  }

  const temp = backup();
  set(args.var, value);
  await process(el, debug);
  restore(temp);

  el.outerHTML = el.innerHTML;
};
