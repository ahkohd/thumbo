<div align="center">

  <h1><code>thumbo</code></h1>

<strong>An high-performant thumbnail creation library</strong>

[![Build & Test](https://github.com/ahkohd/thumbo/actions/workflows/build.yml/badge.svg)](https://github.com/ahkohd/thumbo-core/actions/workflows/build.yml)

<sub>Built with Rust 🦀 & WebAssembly 🕸</sub>

</div>

## ✅ Features

- High-performance
- Web worker pool
- Built rust & Web Assembly
- Uses transferable objects
- Easy to use APIs
- Supports `Png`, `Jpeg`, `Gif`, `Ico`, `Webp` and `Svg`

## 🚴 Usage

Install the package from npm:

```bash
yarn add thumbo
```

```ts
import Thumbo, { Transfer } from "thumbo";

Thumbo.init(async () => {
  Thumbo.thumbnail(
    Transfer(await (await fetch("/path/to/img.png")).arrayBuffer()),
    Thumbo.ImageFormat.Png,
    20,
    20
  ).then((thumbnailBuffer) => {
    document.getElementById("img1").src = URL.createObjectURL(
      new Blob([thumbnailBuffer])
    );
  });

  Thumbo.thumbnailFromUrl(
    "https://example.com/image.png",
    Thumbo.ImageFormat.Png,
    20,
    20
  ).then((thumbnailBuffer) => {
    document.getElementById("img2").src = URL.createObjectURL(
      new Blob([thumbnailBuffer])
    );
  });
});
```

## ⚙️ API Reference

### <span id="thumbo_image_format">`Thumbo.init`</span>

Initiates thumbo. The initiation proccess includes:

- Downloads the [thumbo-core](https://github.com/ahkohd/thumbo-core) WebAssembly bundle from [unpkg.com](https://unpkg.com/thumbo-core/pkg/thumbo_core_bg.wasm)
- Complies the WASM binary
- Starts a pool of web workers(8 workers are pooled by default, however, you can control the number of wokers to be spawned) to take thumbnail creation tasks
- After the afore mentioned steps are completed, `isInitialized` field is set `true`.

### <span id="thumbo_image_format">`InitOptions`</span>

`InitOptions` interface provides the configurations for the `Thumbo.init` method.

```ts
interface InitOptions {
  /** Url to fetch the thumbo-core WASM bundle. Defaults to the bundle hosted on unpkg. */
  wasmUrl?: string;
  /** Maximum no. of tasks to run on one worker thread at a time. Defaults to one. */
  concurrency?: number;
  /** Maximum no. of jobs to be queued for execution before throwing an error. */
  maxQueuedJobs?: number;
  /** Gives that pool a name to be used for debug logging, letting you distinguish between log output of different pools. */
  name?: string;
  /** No. of worker threads to spawn and to be managed by the pool. */
  size?: number;
}
```

### <span id="thumbo_thumbnail">thumbo.thumbnail(image_buffer: [Uint8Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array), format: [thumbo.ImageFormat](#thumbo_image_format), width, height)</span>

Creates a thumbnail from the provided image buffer.
