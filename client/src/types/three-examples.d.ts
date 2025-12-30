declare module 'three/examples/jsm/loaders/RGBELoader' {
  import {Loader} from 'three';

  export class RGBELoader extends Loader {
    constructor();
    setDataType(value: any): this;
    load(url: string, onLoad?: (texture: any) => void, onProgress?: (event: ProgressEvent) => void, onError?: (event: ErrorEvent) => void): void;
    parse(buffer: ArrayBuffer): any;
  }
  export default RGBELoader;
}

declare module 'three/examples/jsm/loaders/EXRLoader' {
  import {Loader} from 'three';

  export class EXRLoader extends Loader {
    constructor();
    setDataType(value: any): this;
    load(url: string, onLoad?: (texture: any) => void): void;
  }
  export default EXRLoader;
}

