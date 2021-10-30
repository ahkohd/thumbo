const fetch = require("isomorphic-fetch");
const { writeFileSync, mkdirSync, existsSync } = require("fs");
const exec = require("child_process").exec;
const join = require("path").join;
const dirname = require("path").dirname;

const wasmBgUrl = "https://unpkg.com/thumbo-core/pkg/thumbo_core_bg.js";

(async () => {
  const bgScript = await (await fetch(wasmBgUrl)).text();
  const __dirname = dirname(__filename);
  const distDir = join(__dirname, "../dist");

  if (!existsSync(distDir)) {
    mkdirSync(distDir);
  }

  writeFileSync(join(distDir, "thumboWorkerBg.js"), bgScript);

  exec(
    `jscodeshift -t ${join(__dirname, "mod.js")} ${join(
      distDir,
      "thumboWorkerBg.js"
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
