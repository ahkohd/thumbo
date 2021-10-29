const jsbeautifier = require("js-beautify").js;

export default (fileInfo, api) => {
  const j = api.jscodeshift;
  const source = j(fileInfo.source);

  // find and remove all import statements
  source.find(j.ImportDeclaration).remove();

  // find and remove exported ImageFormat enums
  source
    .find(j.ExportNamedDeclaration, {
      declaration: {
        type: "VariableDeclaration",
        declarations: [
          {
            type: "VariableDeclarator",
            id: {
              type: "Identifier",
              name: "ImageFormat",
            },
          },
        ],
      },
    })
    .remove();

  // find exported functions that there names do not start with __
  const exportedFunctions = source
    .find(j.ExportNamedDeclaration, {
      declaration: {
        type: "FunctionDeclaration",
      },
    })
    .filter(
      (path) =>
        !path.node.declaration.id.name.startsWith("__wbg") &&
        !path.node.declaration.id.name.startsWith("__wbindgen")
    )
    .nodes()
    .map((node) => node.declaration.id.name);

  // find exported function declarations, replace with normal function declarations.

  source
    .find(j.ExportNamedDeclaration, {
      declaration: {
        type: "FunctionDeclaration",
      },
    })
    .replaceWith((path) =>
      j.functionDeclaration(
        path.node.declaration.id,
        path.node.declaration.params,
        path.node.declaration.body
      )
    );

  // declare variable, wasm & wasmImports

  source
    .find(j.Program)
    .get("body", 0)
    .insertBefore(
      j.variableDeclaration("let", [
        j.variableDeclarator(j.identifier("wasm"), null),
        j.variableDeclarator(j.identifier("wasmImports"), null),
      ])
    );

  // find functions that there names start with __ and return their names

  const wasmImportFunctions = source
    .find(j.FunctionDeclaration)
    .filter(
      (path) =>
        path.node.id.name.startsWith("__wbg") ||
        path.node.id.name.startsWith("__wbindgen")
    )
    .nodes()
    .map((path) => path.id.name);

  // set wasmImports

  source
    .find(j.Declaration)
    .at(-1)
    .get()
    .insertAfter(
      j.expressionStatement(
        j.assignmentExpression(
          "=",
          j.identifier("wasmImports"),
          j.objectExpression([
            j.objectProperty(
              j.identifier(`"./thumbo_core_bg.js"`),
              j.objectExpression(
                wasmImportFunctions.map((functionName) =>
                  j.objectProperty(
                    j.identifier(functionName),
                    j.identifier(functionName)
                  )
                )
              )
            ),
          ])
        )
      )
    );

  // instaniate webassembly module, and set wasm to instance export, call callback method, pass objects of functions when the promise resolves

  source
    .find(j.EmptyStatement)
    .at(-1)
    .get()
    .insertBefore(
      j.expressionStatement(
        j.callExpression(
          j.memberExpression(
            j.callExpression(
              j.memberExpression(
                j.identifier("WebAssembly"),
                j.identifier("instantiate")
              ),
              [j.identifier("wasmModule"), j.identifier("wasmImports")]
            ),
            j.identifier("then")
          ),
          [
            j.arrowFunctionExpression(
              [j.identifier("instance")],
              j.blockStatement([
                j.expressionStatement(
                  j.assignmentExpression(
                    "=",
                    j.identifier("wasm"),
                    j.memberExpression(
                      j.identifier("instance"),
                      j.identifier("exports")
                    )
                  )
                ),
                j.expressionStatement(
                  j.callExpression(j.identifier("callback"), [
                    j.objectExpression(
                      exportedFunctions.map((functionName) =>
                        j.objectProperty(
                          j.identifier(functionName),
                          j.identifier(functionName)
                        )
                      )
                    ),
                  ])
                ),
              ])
            ),
          ]
        )
      )
    );

  return jsbeautifier(
    `export default function bootstrap(wasmModule, callback) {${source.toSource()}}`
  );
};
