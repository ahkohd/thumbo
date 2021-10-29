const fetch = require("isomorphic-fetch");
const writeFileSync = require("fs").writeFileSync;
const exec = require("child_process").exec;
const join = require("path").join;

const wasmBgUrl = "https://unpkg.com/thumbo-core/pkg/thumbo_core_bg.js";

(async () => {
  const bgScript = await (await fetch(wasmBgUrl)).text();

  writeFileSync("../dist/thumboWorkerBg.js", bgScript);
  const cwd = process.cwd();

  exec(
    `jscodeshift -t ${cwd}/mod.js ${join(
      cwd,
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
