import fetch from "node-fetch";
import type { IProcess } from "./IProcess";
import { varInsert } from "./processHelpers";

/**
 * ```html
 *  <fetch json var="dog" from="https://dog.ceo/api/breeds/image/random">
 *   <img src="{{dog.message}}" />
 *  </fetch>
 * ```
 */
export const processFetch: IProcess = async (el, variables, debug: boolean) => {
  const varName = el.getAttribute("var");
  if (!varName) {
    throw new Error('Missing "var" attribute');
  }

  const from = el.getAttribute("from");
  if (!from) {
    throw new Error('Missing "from" attribute');
  }

  console.debug("processFetch", from);

  const response = await fetch(from);

  if (el.hasAttribute("json")) {
    const json = await response.json();
    console.debug("processFetch", json);
    if (debug) {
      console.debug(`define ${varName} = `, json);
    }
    variables.set(varName, json);
  } else {
    const text = await response.text();
    console.debug("processFetch", text);
    if (debug) {
      console.debug(`define ${varName} = ${text}`);
    }
    variables.set(varName, text);
  }

  return varInsert(el.innerHTML, variables);
};
