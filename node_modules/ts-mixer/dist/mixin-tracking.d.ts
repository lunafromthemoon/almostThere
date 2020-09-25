export declare const registerMixins: (mixedClass: any, constituents: Function[]) => Map<any, Function[]>;
export declare const hasMixin: <M>(instance: any, mixin: new (...args: any[]) => M) => instance is M;
