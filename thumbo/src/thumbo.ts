import { spawn, Pool, TransferDescriptor, BlobWorker } from "threads";

import { PoolOptions } from "threads/dist/master/pool";
import { ThumboWorkerConfig } from "../../types/ThumboWorkerConfig";

import ThumboWorker from "!!raw-loader!../../thumbo-worker/dist/thumboWorker.js";
import ImageFormat from "../../types/ImageFormat";

export { Transfer } from "threads";

export type InitOptions = PoolOptions & {
  wasmUrl?: string;
};

export default class Thumbo {
  static pool;
  static wasmModule: WebAssembly.Module;
  static ImageFormat = ImageFormat;
  static wasmUrl =
    "https://unpkg.com/thumbo-core@1.0.8/pkg/thumbo_core_bg.wasm";

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
    return new Promise((resolve, reject) => {
      Thumbo.pool.queue(async (thumboWorker) => {
        try {
          resolve(
            await thumboWorker(Thumbo.wasmModule, config, bufferDescriptor)
          );
        } catch (e) {
          reject(e);
        }
      });
    });
  }

  public static async thumbnail(
    bufferDescriptor: TransferDescriptor,
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
      bufferDescriptor
    );
  }

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

  public static get workers() {
    Thumbo.throwIfUninitialized();
    return Thumbo.pool.workers;
  }

  public static async completed() {
    Thumbo.throwIfUninitialized();
    return Thumbo.pool.completed();
  }

  public static async settled() {
    Thumbo.throwIfUninitialized();
    return Thumbo.pool.settled();
  }

  public static uninit(force?: boolean) {
    Thumbo.throwIfUninitialized();
    Thumbo.pool.terminate(force);
    Thumbo.pool = undefined;
    Thumbo.wasmModule = undefined;
  }
}
