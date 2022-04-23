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

const varInsertRegex = /\{\{([^}]+)\}\}/g;

export const varInsert = (html: string, variables: Map<string, any>) =>
  html.replace(varInsertRegex, (key) => {
    const expression = key.substring(2, key.length - 2);

    try {
      return Function(
        ...variables.keys(),
        `const val = (${expression}); return typeof val === "string" ? val : typeof val === "undefined" ? "" : JSON.stringify(val);`
      )(...variables.values());
    } catch {
      return key;
    }
  });
