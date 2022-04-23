import type { IProcess } from "./IProcess";
import { varInsert } from "./processHelpers";

/**
 * ```html
 * <define var="i" value="1">
 * ```
 */
export const processDefine: IProcess = (el, variables) => {
  const varName = el.getAttribute("var");
  if (!varName) {
    throw new Error('Missing "var" attribute');
  }

  const varString = el.getAttribute("value");
  if (!varString) {
    throw new Error('Missing "value" attribute');
  }

  let varValue: any = undefined;

  try {
    varValue = JSON.parse(varString);
  } catch {
    varValue = varString;
  }

  variables.set(varName, varValue);

  return Promise.resolve(varInsert(el.innerHTML, variables));
};
