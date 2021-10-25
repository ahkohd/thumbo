import * as thumbo from "thumbo-core";
import { spawn, Pool, BlobWorker } from "threads";
import ThumboWorker from "!!raw-loader!ts-loader!./thumbo.worker";
import { PoolOptions } from "threads/dist/master/pool";
export default class Thumbo {
  static pool;

  public static init(options?: PoolOptions) {
    Thumbo.pool = Pool(
      () => spawn(BlobWorker.fromText(ThumboWorker)),
      options?.size ?? 8
    );
    //
  }
}
