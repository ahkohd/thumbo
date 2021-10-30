const fetch = require("isomorphic-fetch");
const { writeFileSync, mkdirSync, existsSync } = require("fs");
const exec = require("child_process").exec;
const join = require("path").join;
const dirname = require("path").dirname;

const wasmBgUrl = "https://unpkg.com/thumbo-core/pkg/thumbo_core_bg.js";

(async () => {
  const bgScript = await (await fetch(wasmBgUrl)).text();

  if (!existsSync("../dist")) {
    mkdirSync("../dist");
  }

  writeFileSync("../dist/thumboWorkerBg.js", bgScript);
  const __dirname = dirname(__filename);

  exec(
    `jscodeshift -t ${__dirname}/mod.js ${join(
      __dirname,
      "../",
      "dist/thumboWorkerBg.js"
    )}`,
    (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    }
  );
})();
