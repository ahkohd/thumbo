import { expose, Transfer, TransferDescriptor } from "threads";
import { ThumboWorkerConfig } from "../../common/types/ThumboWorkerConfig";
import bootstrap from "../../codemod/dist/thumboWorkerBg";

expose(
  async (
    wasmModule: ArrayBufferLike,
    config: ThumboWorkerConfig,
    buffer?: ArrayBufferLike
  ) => {
    const task = new Promise<TransferDescriptor>((resolve) => {
      bootstrap(wasmModule, async (thumbo) => {
        let imgBuffer;

        if (config.url) {
          imgBuffer = new Uint8Array(
            await (await fetch(config.url)).arrayBuffer()
          );
        }

        resolve(
          Transfer(
            thumbo.thumbnail(
              config.url ? imgBuffer : new Uint8Array(buffer!),
              config.format,
              config.width,
              config.height
            ).buffer
          )
        );
      });
    });

    return await task;
  }
);
