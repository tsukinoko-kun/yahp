import { yahp } from "..";
import fs from "fs";

const input = fs.readFileSync("./__test__/test.html", "utf8");
yahp(input, true).then((output) => {
  fs.writeFileSync("./__test__/output.html", output);
});
