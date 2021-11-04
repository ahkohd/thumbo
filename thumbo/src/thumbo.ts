import { spawn, Pool, TransferDescriptor, BlobWorker } from "threads";

import { PoolOptions } from "threads/dist/master/pool";
import { ThumboWorkerConfig } from "../../common/types/ThumboWorkerConfig";
import ImageFormat from "../../common/types/ImageFormat";

import ThumboWorker from "!!raw-loader!../../thumbo-worker/dist/thumboWorker.js";

export { Transfer } from "threads";

/**
 * InitOptions interface provides the configuration for the `init` method.
 */

export type InitOptions = PoolOptions & {
  wasmUrl?: string;
};

export default class Thumbo {
  static pool;
  static wasmModule?: WebAssembly.Module;

  /**
   * Enums of supported image formats
   */

  public static ImageFormat = ImageFormat;

  static wasmUrl =
    "https://unpkg.com/thumbo-core@1.0.8/pkg/thumbo_core_bg.wasm";

  /**
   * Initiates thumbo. The initiation proccess includes:
   *  - Downloads the [thumbo-core](https://github.com/ahkohd/thumbo-core) WebAssembly bundle from [unpkg.com](https://unpkg.com/thumbo-core/pkg/thumbo_core_bg.wasm)
   *  - Complies the WASM binary
   *  - Starts a pool of web workers(8 workers are pooled by default, however, you can control the number of wokers to be spawned) to take thumbnail creation tasks
   *  - After the afore mentioned steps are completed, `isInitialized` field is set `true`
   * @param options configuration for the `init` method
   * @returns a promise that resolves when the initiation process is completed
   */

  public static async init(options?: InitOptions) {
    try {
      Thumbo.wasmModule = await WebAssembly.compileStreaming(
        fetch(options?.wasmUrl ?? Thumbo.wasmUrl)
      );
      Thumbo.pool = Pool(
        () => spawn(BlobWorker.fromText(ThumboWorker)),
        options
      );
    } catch (e) {
      console.error(e);
    }
  }

  static async work(
    config: ThumboWorkerConfig,
    bufferDescriptor?: TransferDescriptor
  ) {
    return new Promise<ArrayBuffer>((resolve, reject) => {
      Thumbo.pool.queue(async (thumboWorker) => {
        try {
          resolve(
            (await thumboWorker(
              Thumbo.wasmModule,
              config,
              bufferDescriptor
            )) as ArrayBuffer
          );
        } catch (e) {
          reject(e);
        }
      });
    });
  }

  /**
   * Creates a thumbnail from the provided arraybuffer transfer descriptor.
   * The provided arraybuffer is transferred to the worker for processing, once the task is completed, the created thumbnail arraybuffer
   * is transferred to the main thread.
   *
   * @param arraybufferDescriptor arraybuffer transfer descriptor
   * @param format Format of the source image
   * @param width Width of the thumbnail
   * @param height Height of the thumbnail
   * @returns a promise that resolves to the thumbnail arraybuffer
   */

  public static async thumbnail(
    arraybufferDescriptor: TransferDescriptor,
    format: ImageFormat,
    width: number,
    height: number
  ) {
    Thumbo.throwIfUninitialized();

    return Thumbo.work(
      {
        format,
        width,
        height,
      },
      arraybufferDescriptor
    );
  }

  /**
   * Creates a thumbnail from the provided Url.
   * Once the task is completed, the created thumbnail arraybuffer is transferred to the main thread.
   *
   * @param url Url of the source image
   * @param format Format of the source image
   * @param width Width of the thumbnail
   * @param height Height of the thumbnail
   * @returns a promise that resolves to the thumbnail arraybuffer
   */

  public static async thumbnailFromUrl(
    url: string,
    format: ImageFormat,
    width: number,
    height: number
  ) {
    Thumbo.throwIfUninitialized();

    return Thumbo.work({
      url,
      format,
      width,
      height,
    });
  }

  static throwIfUninitialized() {
    if (!Thumbo.wasmModule) {
      throw new Error("Thumbo was not initialized. Call Thumbo.init() first.");
    }
  }

  /**
   * Returns the workers in the pool
   */

  public static get workers() {
    Thumbo.throwIfUninitialized();
    return Thumbo.pool;
  }

  /**
   * Returns a promise that resolves once the task queue is emptied.
   * Promise will be rejected if any task fails.
   *
   * @param allowResolvingImmediately Set to `true` to resolve immediately if task queue is currently empty.
   */

  public static async completed(allowResolvingImmediately?: boolean) {
    Thumbo.throwIfUninitialized();
    return Thumbo.pool.completed(allowResolvingImmediately);
  }

  /**
   * Returns a promise that resolves once the task queue is emptied.
   * Failing tasks will not cause the promise to be rejected.
   *
   * @param allowResolvingImmediately Set to `true` to resolve immediately if task queue is currently empty.
   */

  public static async settled(allowResolvingImmediately?: boolean) {
    Thumbo.throwIfUninitialized();
    return Thumbo.pool.settled(allowResolvingImmediately);
  }

  /**
   * Terminate all pool threads and release all resources.
   *
   * @param force Set to `true` to kill the thread even if it cannot be stopped gracefully.
   */

  public static uninit(force?: boolean) {
    Thumbo.throwIfUninitialized();
    Thumbo.pool.terminate(force);
    Thumbo.pool = undefined;
    Thumbo.wasmModule = undefined;
  }
}
