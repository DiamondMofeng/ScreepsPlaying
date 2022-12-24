//TODO 用ts限制禁止调用方法时传入预留的add,sub,get,set等key

type Counter = Record<string, number>
type ProxiedCounter = Counter & {
  readonly add: (key: string, value?: number) => number;
  readonly sub: (key: string, value?: number) => number;
  readonly get: (key: string) => number;
  readonly set: (key: string, value: number) => number;
};

/**
 * 提供对counter的快速操作方法  
 * 注： counter是指{'type1': 1, 'type2': 2, ...}这种，如由'aabcdd'生成得到的{a:2,b:1,c:1,d:2}
 * !!! 原counter上的`get`,`set`,`add`,`sub`属性将会被覆盖,你仍然需要使用`counterRef`来访问原来的这些属性
 * 
 * @example
 * const [counter, counterRef] = useCounter();
 * counter.add('a', 1);
 * counter.sub('a', 1);
 * counter.get('a');  // 0
 * 
 * @param counter - 初始counter
 * @returns {[counterProxy, counterRef]} counterProxy是counter的代理，counterRef是原counter
*/
export function useCounter(counter = {} as Counter): [ProxiedCounter, Counter] {

  if (!Reflect.isExtensible(counter)) {
    throw new Error('counter must be extensible')
  }

  const handler = {
    get(target: object, key: string) {
      if (key === 'add') {
        return (key: string, value = 1) => {
          Reflect.set(target, key, (Reflect.get(target, key, target) ?? 0) + value)
          return Reflect.get(target, key, target)
        }
      }
      if (key === 'sub') {
        return (key: string, value = 1) => {
          Reflect.set(target, key, (Reflect.get(target, key, target) ?? 0) - value)
          return Reflect.get(target, key, target)
        }
      }
      if (key === 'get') {
        return (key: string) => (Reflect.get(target, key, target) ?? 0)
      }
      if (key === 'set') {
        return (key: string, value: number) => {

          if (['add', 'sub', 'get', 'set'].includes(key)) {
            throw new Error(`key '${key}' is preserved`)
          }

          Reflect.set(target, key, value)
          return Reflect.get(target, key, target)
        }
      }
      return (Reflect.get(target, key, target) ?? 0)
    },

    set(target: object, key: string, value: number) {

      if (['add', 'sub', 'get', 'set'].includes(key)) {
        throw new Error(`key '${key}' is preserved`)
      }

      return Reflect.set(target, key, value)
    }
  }

  return [new Proxy(counter, handler) as ProxiedCounter, counter]

}

