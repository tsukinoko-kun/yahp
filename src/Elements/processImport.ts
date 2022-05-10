import type { IProcess } from "./IProcess";
import { get, parseArgs, set } from "./helpers";
import { process } from "../process";
import { resolve } from "path";

const loadModule = (id: string): Promise<any> => {
  // eslint-disable-next-line no-undef
  if ("require" in globalThis) {
    return Function(`return Promise.resolve(require("${id}"))`)();
  } else {
    return Function(`return import("${id}")`)();
  }
};

/**
 * ```html
 *  <require var="{ Octokit }" from="@octokit/rest">
 *
 *  </require>
 * ```
 */
export const processImport: IProcess = async(el, debug: boolean) => {
  const args = parseArgs(el, "var", "from");

  if (debug) {
    console.debug({ args });
  }

  if (args.from.startsWith(".")) {
    args.from = resolve(args.from);
  }

  const temp = get(args.var);

  set(args.var, await loadModule(args.from));

  await process(el, debug);

  set(args.var, temp);

  el.outerHTML = el.innerHTML;
};
