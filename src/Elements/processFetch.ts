import fetch from "node-fetch";
import type { IProcess } from "./IProcess";
import { varInsert } from "./processHelpers";

/**
 * ```html
 *  <fetch json var="dog" url="https://dog.ceo/api/breeds/image/random">
 *   <img src="{{dog.message}}" />
 *  </fetch>
 * ```
 */
export const processFetch: IProcess = async (el, variables) => {
  const varName = el.getAttribute("var");
  if (!varName) {
    throw new Error('Missing "var" attribute');
  }

  const url = el.getAttribute("url");
  if (!url) {
    throw new Error('Missing "url" attribute');
  }

  console.debug("processFetch", url);

  const response = await fetch(url);

  if (el.hasAttribute("json")) {
    const json = await response.json();
    console.debug("processFetch", json);
    variables.set(varName, json);
  } else {
    const text = await response.text();
    console.debug("processFetch", text);
    variables.set(varName, text);
  }

  return varInsert(el.innerHTML, variables);
};
