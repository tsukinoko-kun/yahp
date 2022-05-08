import type { IProcess } from "./IProcess";
import { AsyncFunction, varInsert } from "./processHelpers";

/**
 * ```html
 * <define var="i" value="1">
 * ```
 */
export const processDefine: IProcess = async (
  el,
  variables,
  debug: boolean
) => {
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
    varValue = await AsyncFunction(
      ...variables.keys(),
      `return await (${varString});`
    )(...variables.values());
  } catch {
    varValue = varString;
  }

  if (debug) {
    console.debug(`define ${varName} = `, varValue);
  }

  variables.set(varName, varValue);

  return varInsert(el.innerHTML, variables);
};
