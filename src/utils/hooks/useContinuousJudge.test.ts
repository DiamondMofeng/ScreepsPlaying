import assert from 'power-assert';
import { useContinuousJudge } from './useContinuousJudge';
import { mockGlobal } from 'screeps-jest';
import { randomId } from '../random';

mockGlobal<Game>('Game', {
  time: 123
});

describe('useContinuousJudge', () => {

  beforeEach(() => {
    Game.time += 10000;
  })

  it('should always return true if duration is 1 and result is true', () => {
    const judge = () => true;
    const result = useContinuousJudge('test', 1, judge);
    assert(result === true);

    Game.time += 1;
    const result2 = useContinuousJudge('test', 1, judge);
    assert(result2 === true);

    Game.time += 1;
    const result3 = useContinuousJudge('test', 1, judge);
    assert(result3 === true);

  })

  it('should always return false if duration is 1 and result is false', () => {
    const judge = () => false;
    const result = useContinuousJudge('test', 1, judge);
    assert(result === false);

    Game.time += 1;
    const result2 = useContinuousJudge('test', 1, judge);
    assert(result2 === false);

    Game.time += 1;
    const result3 = useContinuousJudge('test', 1, judge);
    assert(result3 === false);

  })

  it('should return true if duration is 2 and result is true', () => {
    const judge = () => true;
    const result = useContinuousJudge('test2', 2, judge);
    assert(result === false);

    Game.time += 1;
    const result2 = useContinuousJudge('test2', 2, judge);
    assert(result2 === true);

    Game.time += 1;
    const result3 = useContinuousJudge('test2', 2, judge);
    assert(result3 === true);

    Game.time += 1;
    const result4 = useContinuousJudge('test2', 2, judge);
    assert(result4 === true);
  })

  it('should return false if duration is 2 and result is false', () => {
    const judge = () => false;
    const result = useContinuousJudge('test2', 2, judge);
    assert(result === false);

    Game.time += 1;
    const result2 = useContinuousJudge('test2', 2, judge);
    assert(result2 === false);

    Game.time += 1;
    const result3 = useContinuousJudge('test2', 2, judge);
    assert(result3 === false);

    Game.time += 1;
    const result4 = useContinuousJudge('test2', 2, judge);
    assert(result4 === false);
  })

  it('mass random test', () => {
    const testCount = 100;
    const judge = () => true;

    for (let i = 0; i < testCount; i++) {
      Game.time += 10000;

      const id = randomId();
      const duration = Math.floor(Math.random() * 1000);
      for (let i = 0; i < duration - 1; i++) {
        const result = useContinuousJudge(id, duration, judge);
        assert(result === false, `i: ${i}`);
        Game.time += 1;
      }

      for (let i = 0; i < 100; i++) {
        const result = useContinuousJudge(id, duration, judge);
        assert(result === true);
        Game.time += 1;
      }
    }

  })
})
