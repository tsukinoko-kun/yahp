import type { IProcess } from "./IProcess.js";
import { backup, parseArgs, restore, set } from "./helpers.js";
import { process } from "../process.js";
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
 *  <import var="{ Octokit }" from="@octokit/rest">
 *    ...
 *  </import>
 * ```
 */
export const processImport: IProcess = async(el, debug: boolean) => {
  const args = parseArgs(el, ["var", "from"]);

  if (debug) {
    console.debug({ args });
  }

  if (args.from.startsWith(".")) {
    args.from = resolve(args.from);
  }

  const temp = backup();

  const mod = await loadModule(args.from);

  if (mod.default) {
    set(args.var, { ...mod.default, ...mod });
  } else {
    set(args.var, mod);
  }

  await process(el, debug);
  restore(temp);

  el.outerHTML = el.innerHTML;
};
