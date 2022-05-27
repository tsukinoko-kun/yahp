import fetch from "node-fetch";
import type { IProcess } from "./IProcess.js";
import { backup, evaluate, parseArgs, restore, set } from "./helpers.js";
import { process } from "../process.js";

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
  const args = parseArgs(el, ["var", "from"], ["as"]);

  if (debug) {
    console.debug("Arguments", args);
  }

  const res = await fetch(await evaluate(args.from));

  const value: any = await (async() => {
    switch (args.as) {
    case "json":
      return res.json();
    case "text":
      return res.text();
    case "dataURL": {
      const type = res.headers.get("content-type");
      const buffer = Buffer.from(await res.arrayBuffer());
      return `data:${type};base64,${buffer.toString("base64")}`;
    }
    default:
      return res;
    }
  })()

  if (debug) {
    console.debug("Evaluated to", value);
  }

  const temp = backup();
  set(args.var, value);
  await process(el, debug);
  restore(temp);

  el.outerHTML = el.innerHTML;
};
