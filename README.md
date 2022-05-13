# yahp

[![yarn 3](https://shields.io/badge/yarn-PnP-2C8EBB?logo=yarn)](https://yarnpkg.com/features/pnp)

Yet another HTML preprocessor (for Node)

## Quickstart Guide

```bash
yarn add -D @frank-mayer/yahp
```

```typescript
import { yahp } from "@frank-mayer/yahp";
import fs from "fs";

const input: string = fs.readFileSync("./src/index.yahp", "utf8");
const output: string = await yahp(input);
fs.writeFileSync("./dist/index.html", output);
```

## Features

### Define

Define block scoped variables.

```html
<define var="foo" value="42">
  <!-- variable foo is available here with the value 42 -->
  <define var="foo" value=' "abc" '>
    <!-- variable foo is available here with the value "abc" -->
  </define>
  <!-- variable foo is available here with the value 42 -->
</define>
<!-- variable foo is not available anymore  -->
```

### Eval

Run inline JavaScript Function. Return value is rendered if not undefined.

```html
<script eval>
  const r = Math.random() * 100;
  return r.toFixed(2);
</script>
```

### Fetch

Fetch content using http-get-request.

Parse response as JSON.

```html
<fetch var="dog" as="json" from="this.dogImgUrl">
  <!-- ... -->
</fetch>
```

Keep response as string.

```html
<fetch var="dog" as="text" from="this.dogImgUrl">
  <!-- ... -->
</fetch>
```

### For

Iterate using any iterable.

```html
<for var="item" of="[1,2,3]">
  <!-- ... -->
</for>
```

### If

Check if a condition is truthy or not.

Else block is not required.

```html
<if condition="Boolean(Math.round(Math.random()))">
  <!-- truthy -->
</if>
<else>
  <!-- falsy -->
</else>
```

### Import

Import a Module from npm or locally.

```html
<import var="{ Octokit }" from="@octokit/rest">
  <!-- ... -->
</import>
```
