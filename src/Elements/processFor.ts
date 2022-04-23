import { StringBuilder } from "@frank-mayer/magic";
import type { IProcess } from "./IProcess";
import { varInsert } from "./processHelpers";

/**
 * ```html
 * <for var="item" of="[1,2,3]">
 *  <div>{{item}}</div>
 * </for>
 * ```
 */
export const processFor: IProcess = (el, variables) => {
  const varName = el.getAttribute("var");
  if (!varName) {
    throw new Error('Missing "var" attribute');
  }

  const ofString = el.getAttribute("of");
  if (!ofString) {
    throw new Error('Missing "of" attribute');
  }
  const ofValue = JSON.parse(ofString);

  if (!Array.isArray(ofValue)) {
    throw new Error(`"of" attribute must be an array: ${el.outerHTML}`);
  }

  const newHtml = new StringBuilder();

  for (const item of ofValue) {
    variables.set(varName, item);
    newHtml.append(varInsert(el.innerHTML, variables));
  }

  return Promise.resolve(newHtml.toString());
};
