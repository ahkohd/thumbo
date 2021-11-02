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
- Supports `Png`, `Jpeg`, `Gif`, `Ico` and `Svg`

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

### <span id="thumbo_image_format">`Thumbo.init(callback(): void, config:` [`InitOptions`](#initoptions)`)`</span>

Initiates thumbo. The initiation proccess includes:

- Downloads the [thumbo-core](https://github.com/ahkohd/thumbo-core) WebAssembly bundle from [unpkg.com](https://unpkg.com/thumbo-core/pkg/thumbo_core_bg.wasm)
- Complies the WASM binary
- Starts a pool of web workers(8 workers are pooled by default, however, you can control the number of wokers to be spawned) to take thumbnail creation tasks
- After the afore mentioned steps are completed, `isInitialized` field is set `true` and the provided
  callback method is invoked

#### <span id="initoptions">`InitOptions`</span>

`InitOptions` interface provides the configuration for the `init` method.

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

### <span id="transfer">`Transfer(transferable:` [`Transferable`](https://developer.mozilla.org/de/docs/Web/API/Transferable)`)`</span>

Mark transferable objects within an arbitrary object or array as
being a transferable object. They will then not be serialized
and deserialized on messaging with the main thread, but ownership
of them will be tranferred to the receiving thread.

Only array buffers, message ports and few more special types of
objects can be transferred, but it's much faster than serializing and
deserializing them.

Returns a <span id="transferdescriptor">`TransferDescriptor`</span>, a container that holds the arraybuffer to be transferred.

> Note:
> The transferable object cannot be accessed by this thread again
> unless the receiving thread transfers it back again!

**Transferable**: transferable Array buffer, message port or similar.

See <https://developers.google.com/web/updates/2011/12/Transferable-Objects-Lightning-Fast>

### <span id="imageformat">Thumbo.ImageFormat</span>

Enums of supported image formats. Thumbo supports thumbnail creation for the following formats:

- `Png`
- `Jpeg`
- `Gif`
- `Ico`
- `Svg`

### <span id="thumbo_thumbnail">Thumbo.thumbnail(bufferDescriptor: [TransferDescriptor](#transferdescriptor), format: [ImageFormat](#imageformat), width: number, height: number)</span>

Creates a thumbnail from the provided arraybuffer transfer descriptor.
The provided arraybuffer is transferred to the worker for processing, once the task is completed, the newly created thumbnail arraybuffer
is transferred back to the main thread.
