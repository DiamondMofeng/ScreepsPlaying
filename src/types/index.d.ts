
export interface global { }
declare global {
  namespace NodeJS {
    interface Global {
      lastOnline: number;

    }
  }
}