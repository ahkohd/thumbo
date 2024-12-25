# 🎲 Thumbo-core codemod

The codemod tool downloads the latest [thumboCoreBg.js](https://unpkg.com/thumbo-core@1.0.8/pkg/thumbo_core_bg.js) script from `unpkg`
and transforms. The transformation is to convert the input `thumboCoreBg.js` script into useable, bundler independent background script
that consumes the `thumboCore.wasm` binary.
The transformed code used to build [thumbo-worker](../thumbo-worker).

## 📜 Background

As at the development of `thumbo`, the wasm support for webpack is still experimental and sometimes requires hack to make it work.
This codemod tool takes the generated `thumboCorebg.js` from [wasm-pack](https://rustwasm.github.io/wasm-pack/) and transforms it; add code that compiles the `wasmBytes`, initiates the module, pass the wasm imports
and provides a callback which thumbo-core exported methods are passed as argument for use by the worker.

## 🏗 Setup

```bash
pnpm
```

## 🔧 Usage

```bash
# download thumboCoreBg.js, transform it, save to ./dist folder
node ./src/main.js
```
