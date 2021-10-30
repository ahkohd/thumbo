import ImageFormat from "./ImageFormat";

export interface ThumboWorkerConfig {
  format: ImageFormat;
  url?: string;
  width: number;
  height: number;
}
