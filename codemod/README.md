# 🎲 Thumbo-core codemod

The codemod tool downloads the latest [thumboCoreBg.js](https://unpkg.com/thumbo-core@1.0.8/pkg/thumbo_core_bg.js) script from `unpkg`
and transforms. The transformation is to convert the input `thumboCoreBg.js` script into useable, bundler independent background script
that consumes the `thumboCore.wasm` binary.
The transformed code used to build [thumbo-worker](../thumbo-worker).

## 📜 Background

As at the development of `thumbo`, there wasm support for webpack is still experimental and sometimes requires hack to make it work.
This codemod tool takes the generated `thumboCorebg.js` from [wasm-pack] and transforms it - add to compile the `wasmBytes` and instantiate, populate and pass the wasm imports,
and provides a callback, then pass the exports as arguments.

## 🏗 Setup

```bash
yarn
```

## 🔧 Usage

```bash
# download thumboCoreBg.js, transform it, save to ./dist folder
node ./src/main.js
```
