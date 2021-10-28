export function bootstrap() {
  self.thumboInstance = null;

  self.heap = new Array(32).fill(undefined);
  self.heap.push(undefined, null, true, false);
  self.heap_next = self.heap.length;

  self.cachegetUint8Memory0 = null;
  self.cachegetInt32Memory0 = null;

  const lTextEncoder =
    typeof TextEncoder === "undefined"
      ? //@ts-ignore
        (0, module.require)("util").TextEncoder
      : TextEncoder;

  self.cachedTextEncoder = new lTextEncoder("utf-8");

  const lTextDecoder =
    typeof TextDecoder === "undefined"
      ? //@ts-ignore
        (0, module.require)("util").TextDecoder
      : TextDecoder;

  self.cachedTextDecoder = new lTextDecoder("utf-8", {
    ignoreBOM: true,
    fatal: true,
  });

  self.cachedTextDecoder.decode();

  self.encodeString =
    typeof self.cachedTextEncoder.encodeInto === "function"
      ? function (arg, view) {
          return self.cachedTextEncoder.encodeInto(arg, view);
        }
      : function (arg, view) {
          const buf = self.cachedTextEncoder.encode(arg);
          view.set(buf);
          return {
            read: arg.length,
            written: buf.length,
          };
        };

  self.WASM_VECTOR_LEN = 0;
}

export function getUint8Memory0() {
  if (
    self.cachegetUint8Memory0 === null ||
    self.cachegetUint8Memory0.buffer !==
      self.thumboInstance.exports.memory.buffer
  ) {
    self.cachegetUint8Memory0 = new Uint8Array(
      self.thumboInstance.exports.memory.buffer
    );
  }
  return self.cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
  return self.cachedTextDecoder.decode(
    getUint8Memory0().subarray(ptr, ptr + len)
  );
}

function passArray8ToWasm0(arg, malloc) {
  const ptr = malloc(arg.length * 1);
  getUint8Memory0().set(arg, ptr / 1);
  self.WASM_VECTOR_LEN = arg.length;
  return ptr;
}

function getInt32Memory0() {
  if (
    self.cachegetInt32Memory0 === null ||
    self.cachegetInt32Memory0.buffer !==
      self.thumboInstance.exports.memory.buffer
  ) {
    self.cachegetInt32Memory0 = new Int32Array(
      self.thumboInstance.exports.memory.buffer
    );
  }
  return self.cachegetInt32Memory0;
}

function getArrayU8FromWasm0(ptr, len) {
  return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}

function passStringToWasm0(arg, malloc, realloc) {
  if (realloc === undefined) {
    const buf = self.cachedTextEncoder.encode(arg);
    const ptr = malloc(buf.length);
    getUint8Memory0()
      .subarray(ptr, ptr + buf.length)
      .set(buf);
    self.WASM_VECTOR_LEN = buf.length;
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
    const ret = self.encodeString(arg, view);

    offset += ret.written;
  }

  self.WASM_VECTOR_LEN = offset;
  return ptr;
}

export function wasmExports() {
  return {
    /**
     * @param {Uint8Array} image_buffer
     * @param {number} format
     * @param {number} width
     * @param {number} height
     * @returns {Uint8Array}
     */

    thumbnail(image_buffer, format, width, height) {
      const thumbo = self.thumboInstance.exports;
      try {
        const retptr = thumbo.__wbindgen_add_to_stack_pointer(-16);
        var ptr0 = passArray8ToWasm0(image_buffer, thumbo.__wbindgen_malloc);
        var len0 = self.WASM_VECTOR_LEN;
        thumbo.thumbnail(retptr, ptr0, len0, format, width, height);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v1 = getArrayU8FromWasm0(r0, r1).slice();
        thumbo.__wbindgen_free(r0, r1 * 1);
        return v1;
      } finally {
        thumbo.__wbindgen_add_to_stack_pointer(16);
      }
    },
  };
}

export const wasmImports = () => {
  function addHeapObject(obj) {
    if (self.heap_next === self.heap.length)
      self.heap.push(self.heap.length + 1);
    const idx = self.heap_next;
    self.heap_next = self.heap[idx];

    self.heap[idx] = obj;
    return idx;
  }

  function getObject(idx) {
    return self.heap[idx];
  }

  function dropObject(idx) {
    if (idx < 36) return;
    self.heap[idx] = self.heap_next;
    self.heap_next = idx;
  }

  function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
  }

  return {
    "./thumbo_core_bg.js": {
      __wbg_new_693216e109162396() {
        var ret = new Error();
        return addHeapObject(ret);
      },
      __wbg_stack_0ddaca5d1abfb52f(arg0, arg1) {
        var ret = getObject(arg1).stack;
        var ptr0 = passStringToWasm0(
          ret,
          self.thumboInstance.exports.__wbindgen_malloc,
          self.thumboInstance.exports.__wbindgen_realloc
        );
        var len0 = self.WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
      },

      __wbg_error_09919627ac0992f5(arg0, arg1) {
        try {
          console.error(getStringFromWasm0(arg0, arg1));
        } finally {
          self.thumboInstance.exports.__wbindgen_free(arg0, arg1);
        }
      },

      __wbindgen_object_drop_ref(arg0) {
        takeObject(arg0);
      },
      __wbindgen_throw(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
      },
    },
  };
};
