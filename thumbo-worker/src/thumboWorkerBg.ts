export default function bootstrap(
  wasmModule: WebAssembly.Module,
  callback: (exports) => void
) {
  let wasm, wasmImports;

  const heap = new Array(32).fill(undefined);

  heap.push(undefined, null, true, false);

  function getObject(idx) {
    return heap[idx];
  }

  let heap_next = heap.length;

  function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
  }

  function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
  }

  const lTextDecoder =
    typeof TextDecoder === "undefined"
      ? // @ts-ignore
        (0, module.require)("util").TextDecoder
      : TextDecoder;

  let cachedTextDecoder = new lTextDecoder("utf-8", {
    ignoreBOM: true,
    fatal: true,
  });

  cachedTextDecoder.decode();

  let cachegetUint8Memory0 = null;
  function getUint8Memory0() {
    if (
      cachegetUint8Memory0 === null ||
      cachegetUint8Memory0.buffer !== wasm.memory.buffer
    ) {
      cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
  }

  function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
  }

  let WASM_VECTOR_LEN = 0;

  function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1);
    getUint8Memory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
  }

  let cachegetInt32Memory0 = null;
  function getInt32Memory0() {
    if (
      cachegetInt32Memory0 === null ||
      cachegetInt32Memory0.buffer !== wasm.memory.buffer
    ) {
      cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
  }

  function getArrayU8FromWasm0(ptr, len) {
    return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
  }
  /**
   * @param {Uint8Array} image_buffer
   * @param {number} format
   * @param {number} width
   * @param {number} height
   * @returns {Uint8Array}
   */
  function thumbnail(image_buffer, format, width, height) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      var ptr0 = passArray8ToWasm0(image_buffer, wasm.__wbindgen_malloc);
      var len0 = WASM_VECTOR_LEN;
      wasm.thumbnail(retptr, ptr0, len0, format, width, height);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v1 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v1;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }

  function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
  }

  const lTextEncoder =
    typeof TextEncoder === "undefined"
      ? // @ts-ignore
        (0, module.require)("util").TextEncoder
      : TextEncoder;

  let cachedTextEncoder = new lTextEncoder("utf-8");

  const encodeString =
    typeof cachedTextEncoder.encodeInto === "function"
      ? function (arg, view) {
          return cachedTextEncoder.encodeInto(arg, view);
        }
      : function (arg, view) {
          const buf = cachedTextEncoder.encode(arg);
          view.set(buf);
          return {
            read: arg.length,
            written: buf.length,
          };
        };

  function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === undefined) {
      const buf = cachedTextEncoder.encode(arg);
      const ptr = malloc(buf.length);
      getUint8Memory0()
        .subarray(ptr, ptr + buf.length)
        .set(buf);
      WASM_VECTOR_LEN = buf.length;
      return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
      const code = arg.charCodeAt(offset);
      if (code > 0x7f) break;
      mem[ptr + offset] = code;
    }

    if (offset !== len) {
      if (offset !== 0) {
        arg = arg.slice(offset);
      }
      ptr = realloc(ptr, len, (len = offset + arg.length * 3));
      const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
      const ret = encodeString(arg, view);

      offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
  }

  function __wbg_new_693216e109162396() {
    var ret = new Error();
    return addHeapObject(ret);
  }

  function __wbg_stack_0ddaca5d1abfb52f(arg0, arg1) {
    var ret = getObject(arg1).stack;
    var ptr0 = passStringToWasm0(
      ret,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc
    );
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
  }

  function __wbg_error_09919627ac0992f5(arg0, arg1) {
    try {
      console.error(getStringFromWasm0(arg0, arg1));
    } finally {
      wasm.__wbindgen_free(arg0, arg1);
    }
  }

  function __wbindgen_object_drop_ref(arg0) {
    takeObject(arg0);
  }

  function __wbindgen_throw(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
  }

  wasmImports = {
    "./thumbo_core_bg.js": {
      __wbg_new_693216e109162396,
      __wbg_stack_0ddaca5d1abfb52f,
      __wbg_error_09919627ac0992f5,
      __wbindgen_object_drop_ref,
      __wbindgen_throw,
    },
  };

  WebAssembly.instantiate(wasmModule, wasmImports).then((instance) => {
    wasm = instance.exports;
    callback({ thumbnail });
  });
}
