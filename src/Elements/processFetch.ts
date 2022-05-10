import fetch from "node-fetch";
import type { IProcess } from "./IProcess";
import { parseArgs, set } from "./helpers";

/**
 * ```html
 *  <fetch var="dog" as="json" from="https://dog.ceo/api/breeds/image/random">
 *   <img src="{{dog.message}}" />
 *  </fetch>
 * ```
 *
 * ```html
 *  <fetch var="dog" as="text" from="https://dog.ceo/api/breeds/image/random">
 *   <pre>{{dog}}</pre>
 *  </fetch>
 * ```
 */
export const processFetch: IProcess = async(el, debug: boolean) => {
  const args = parseArgs(el, "var", "as", "from");

  if (debug) {
    console.debug({ args });
  }

  const resp = await fetch(args.from);

  const value: any = args.as === "json" ? await resp.json() : await resp.text();

  if (debug) {
    console.debug({ value });
  }

  set(args.var, value);

  el.outerHTML = el.innerHTML;
};
