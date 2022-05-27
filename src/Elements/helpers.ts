import { describe, Enumerable } from "@frank-mayer/magic";

export const selfClosingTags = new Set([
  "AREA",
  "BASE",
  "BR",
  "COL",
  "EMBED",
  "HR",
  "IMG",
  "INPUT",
  "LINK",
  "META",
  "PARAM",
  "SOURCE",
  "TRACK",
  "WBR",
]);

const domThis = {} as { [key: string]: any };

export const getDomThis = (): Readonly<typeof domThis> => domThis;

export const AsyncFunction: <T = any>(
  ...args: Array<string>
// eslint-disable-next-line no-shadow
) => (...args: Array<any>) => Promise<T> = Object.getPrototypeOf(
  // eslint-disable-next-line no-empty-function, @typescript-eslint/no-empty-function
  async function() {}
).constructor;

// eslint-disable-next-line no-unused-vars
export const parseArgs = <M extends string, O extends string, T extends { [key in M]: string} & {[key in O]?: string }>(
  el: Element,
  mandatoryParameters: Array<M>,
  optionalParameters: Array<O> = new Array<O>(),
): T => {
  const result = {} as T;

  for (const arg of mandatoryParameters) {
    if (el.hasAttribute(arg)) {
      const value = el.getAttribute(arg)!.trim();
      if (value.length > 0) {
        result[arg] = value as T[M];
      } else {
        throw new Error(`${arg} is empty in ${describe(el)}`);
      }
    } else {
      throw new Error(`Missing attribute ${arg} in ${describe(el)}`);
    }
  }

  for (const arg of optionalParameters) {
    if (el.hasAttribute(arg)) {
      const value = el.getAttribute(arg)!.trim();
      if (value.length > 0) {
        result[arg] = value as T[O];
      }
    }
  }

  return result;
};

// async function evalInContext(x: string) {
//   return eval(x);
// }

export const evaluate = (x: string, statement = true) =>
  statement
    ? AsyncFunction(`return (${x})`).call(domThis)
    : AsyncFunction(x).call(domThis);

const variableNameRegEx = /^[a-zßöäü$][0-9a-zßöäü$]*$/iu;
export const set = (key: string, value: any) => {
  if (key.startsWith("{") && key.endsWith("}")) {
    const subKeys = Enumerable.from(key.slice(1, -1).split(","))
      .select((x) => x.trim())
      .where((x) => x.length > 0);

    for (const subKey of subKeys) {
      if (variableNameRegEx.test(subKey)) {
        domThis[subKey] = value[subKey];
      } else {
        throw new Error(`Invalid variable name ${subKey}`);
      }
    }
  } else {
    if (variableNameRegEx.test(key)) {
      domThis[key] = value;
    } else {
      throw new Error(`Invalid variable name ${key}`);
    }
  }
};

export const get = (key: string) => {
  if (key.startsWith("{") && key.endsWith("}")) {
    const subKeys = Enumerable.from(key.slice(1, -1).split(","))
      .select((x) => x.trim())
      .where((x) => x.length > 0);

    const result = {} as { [key: string]: any };
    for (const subKey of subKeys) {
      if (variableNameRegEx.test(subKey)) {
        result[subKey] = domThis[subKey];
      }
    }
    return result;
  } else {
    if (variableNameRegEx.test(key)) {
      return domThis[key];
    }

    throw new Error(`Invalid variable name ${key}`);
  }
};

