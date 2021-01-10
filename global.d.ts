export {};

declare global {
  namespace NodeJS {
    interface Global {
      __DEV__: boolean;
    }
  }
}
