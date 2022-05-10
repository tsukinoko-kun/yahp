import { yahp } from "..";
import fs from "fs";

const input = fs.readFileSync("./__test__/test.yahp", "utf8");
yahp(input).then((output) => {
  fs.writeFileSync("./__test__/output.html", output);
});
