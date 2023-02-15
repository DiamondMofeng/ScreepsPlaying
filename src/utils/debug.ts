export function debugFactory(showLog: boolean): (...args: any[]) => void {
  if (showLog) {
    return (...args: any[]) => console.log(...args);
  } else {
    return () => { /* skip */ };
  }
}