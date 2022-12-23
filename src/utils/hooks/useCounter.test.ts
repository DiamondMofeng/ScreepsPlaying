import assert from 'power-assert';
import { useCounter } from './useCounter';

describe('useCounter hook', () => {
  it('should add values to counter', () => {
    const [counter] = useCounter();
    assert(counter.add('a', 1) === 1);
    assert(counter.add('b', 2) === 2);
  });

  it('should subtract values from counter', () => {
    const [counter] = useCounter({ a: 5, b: 3 });
    assert(counter.sub('a', 2) === 3);
    assert(counter.sub('b', 1) === 2);
  });

  it('should set values in counter', () => {
    const [counter] = useCounter();
    counter.set('a', 5);
    counter.set('b', 3);
    assert(counter.get('a') === 5);
    assert(counter.get('b') === 3);
  });

  it('should return the correct value when calling get', () => {
    const [counter] = useCounter({ a: 5, b: 3 });
    assert(counter.get('a') === 5);
    assert(counter.get('b') === 3);
  });

  it('should handle multiple method calls', () => {
    const [counter] = useCounter();
    assert(counter.add('a', 1) === 1);
    assert(counter.add('b', 2) === 2);
    assert(counter.get('a') === 1);
    assert(counter.get('b') === 2);
    assert(counter.sub('a', 1) === 0);
    assert(counter.sub('b', 2) === 0);
    assert(counter.get('a') === 0);
    assert(counter.get('b') === 0);
    assert(counter.set('a', 5) === 5);
    assert(counter.set('b', 3) === 3);
    assert(counter.get('a') === 5);
    assert(counter.get('b') === 3);
  });
});