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
export const processFor: IProcess = (el, variables, debug: boolean) => {
  const varName = el.getAttribute("var");
  if (!varName) {
    throw new Error('Missing "var" attribute');
  }

  const ofString = el.getAttribute("of");
  if (!ofString) {
    throw new Error('Missing "of" attribute');
  }
  const ofValue = JSON.parse(ofString);

  if (!ofValue[Symbol.iterator]) {
    throw new Error(
      `"of" attribute must be iterable: ${JSON.stringify(ofValue)}`
    );
  }

  const newHtml = new StringBuilder();

  let i = 0;
  for (const item of ofValue) {
    if (debug) {
      console.debug("loop iteration", i);
      console.debug(`define ${varName} = `, item);
    }

    variables.set(varName, item);
    newHtml.append(varInsert(el.innerHTML, variables));

    i++;
  }

  return Promise.resolve(newHtml.toString());
};
