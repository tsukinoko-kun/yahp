import fetch from "node-fetch";
import type { IProcess } from "./IProcess";
import { evaluate, get, parseArgs, set } from "./helpers";
import { process } from "../process";

/**
 * ```html
 *  <fetch var="dog" as="json" from="this.dogImgUrl">
 *    ...
 *  </fetch>
 * ```
 *
 * ```html
 *  <fetch var="dog" as="text" from="this.dogImgUrl">
 *    ...
 *  </fetch>
 * ```
 */
export const processFetch: IProcess = async(el, debug: boolean) => {
  const args = parseArgs(el, "var", "as", "from");

  if (debug) {
    console.debug({ args });
  }

  const resp = await fetch(await evaluate(args.from));

  const value: any = args.as === "json" ? await resp.json() : await resp.text();

  if (debug) {
    console.debug({ value });
  }

  const temp = get(args.var);
  set(args.var, value);
  await process(el, debug);
  set(args.var, temp);

  el.outerHTML = el.innerHTML;
};
