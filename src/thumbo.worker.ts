import { expose } from "threads";

expose(() => {
  console.log("kick");
});
