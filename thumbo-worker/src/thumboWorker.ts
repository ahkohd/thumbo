import { expose, Transfer } from "threads";
import { ThumboWorkerConfig } from "../../types/ThumboWorkerConfig";
import { wasmExports, wasmImports, bootstrap } from "./thumboWorkerBg";

declare global {
  interface Window {
    thumboInstance: any;
    heap: Array<any>;
    heap_next: number;
    cachedTextDecoder: TextDecoder;
    cachedTextEncoder: TextEncoder;
    WASM_VECTOR_LEN: number;
    cachegetUint8Memory0: Uint8Array;
    cachegetInt32Memory0: Int32Array;
    encodeString(arg: any, view: any): TextEncoderEncodeIntoResult;
  }
}

bootstrap();

expose(
  async (
    wasmModule: ArrayBufferLike,
    config: ThumboWorkerConfig,
    buffer?: ArrayBufferLike
  ) => {
    self.thumboInstance = await WebAssembly.instantiate(
      wasmModule,
      wasmImports() as any
    );
    const thumbo = wasmExports();
    let imgBuffer;

    if (config.url) {
      imgBuffer = new Uint8Array(await (await fetch(config.url)).arrayBuffer());
    }

    return Transfer(
      thumbo.thumbnail(
        config.url ? imgBuffer : new Uint8Array(buffer!),
        config.format,
        config.width,
        config.height
      ).buffer
    );
  }
);
