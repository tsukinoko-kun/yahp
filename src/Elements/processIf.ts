import type { IProcess } from "./IProcess";
import { varInsert } from "./processHelpers";

/**
 * ```html
 * <if condition="{{Boolean(Math.round(Math.random()))}}">
 *  <div>foobar</div>
 * </if>
 *
 * <if not condition="{{Boolean(Math.round(Math.random()))}}">
 *  <div>foobar</div>
 * </if>
 * ```
 */
export const processIf: IProcess = (el, variables, debug: boolean) => {
  const conditionString = el.getAttribute("condition");
  if (!conditionString) {
    throw new Error('Missing "condition" attribute');
  }

  const conditionValue = Boolean(JSON.parse(conditionString));

  if (el.hasAttribute("not") ? !conditionValue : conditionValue) {
    if (debug) {
      console.debug(`if ${conditionString}: true`);
    }
    return Promise.resolve(varInsert(el.innerHTML, variables));
  } else {
    if (debug) {
      console.debug(`if ${conditionString}: false`);
    }
    return Promise.resolve("");
  }
};
