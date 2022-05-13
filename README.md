# yahp

Yet another HTML preprocessor (for Node)

## Quickstart Guide

```bash
yarn add -D @frank-mayer/yahp
```

```bash
npm i @frank-mayer/yahp
```

```typescript
import { yahp } from "@frank-mayer/yahp";
import fs from "fs";

const input: string = fs.readFileSync("./src/index.html", "utf8");
const output: string = await yahp(input);
fs.writeFileSync("./dist/index.html", output);
```

## Variables

All variables are immutable within its creating tag but are available after the scope was closed.

Variables can only be overwritten outside the crating tag.

```html
<define var="foo" value="'foo bar'">
  <!-- variable foo is available here with the value 'foo bar' -->
  <!-- variable foo can NOT be overwritten -->
</define>

<!-- variable foo is still available here with the value 'foo bar'  -->
<!-- variable foo CAN be overwritten here -->
```

## Features

### Expression

Use double curly braces to write JavaScript expressions.

If an expression equals to `undefined`, it will not be rendered.

Expressions can **not** use async/await.

```html
<span
  style="color:{{'#'+Math.floor(Math.random()*0xffffff).toString(16).padStart(6,'0')}}"
>
  Random Color
</span>
```

```html
<span style="color:#c8c760">Random Color</span>
```

### For

The `<for>` Tag is a JavaScript for of loop.

```html
<ul>
  <for var="item" of="[1,2,3]">
    <li>{{item}}</li>
  </for>
</ul>
```

```html
<ul>
  <li>1</li>
  <li>2</li>
  <li>3</li>
</ul>
```

### Define

The `<define>` Tag defines a variable.

```html
<define var="arr" value="[1,2,3]">
  <ul>
    <for var="item" of="{{arr}}">
      <li>{{item}}</li>
    </for>
  </ul>
</define>
```

You can also await if the value returns a `Promise`

```html
<define var="arr" await value="fetch('https://github.com')"></define>
```

### If

Use the `if` Tag to check if a condition is truthy or falsy.

```html
<define var="b" value="{{Boolean(Math.round(Math.random()))}}">
  <if condition="{{b}}">
    <div>true</div>
  </if>
  <if not condition="{{b}}">
    <div>false</div>
  </if>
</define>
```

### Fetch

The `<fetch>` Tag allows fetching resources across the network.

If you want the fetch response to be interpreted as JSON, use the `json` switch attribute.

```html
<fetch json var="dog" url="https://dog.ceo/api/breeds/image/random">
  <img src="{{dog.message}}" />
</fetch>
```

### Import

The `<import>` Tag allows to import Modules dynamically.

```html
<import var="{join}" from="path">{{join("a",'b',`c`)}}</import>
```

```html
a/b/c
```
