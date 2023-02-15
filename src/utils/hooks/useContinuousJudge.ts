import { debugFactory } from "../debug";
import { useGlobalCache } from "./useGlobalCache";

const debug = debugFactory(false)

const getInitialState = (duration: number) => {
  debug('generated')
  return ({
    startTick: Game.time,
    duration,
    expireTick: Game.time + duration,
    lastVisitTick: Game.time - 1,
    lastResult: true,
  })
}

/**
 * return true if judge() always return true in a certain duration  
 * !!! duration must >= 1
 */
export function useContinuousJudge(
  id: string,
  duration: number,
  judge: () => boolean,
  /** reset state after return true */
  resetWhenTrue = false,
): boolean {
  const judgement = useGlobalCache(`__lastJudge_${id}`, () => getInitialState(duration), -1);

  function reset() {
    Object.assign(judgement, getInitialState(duration))
  }

  // reset if duration is up
  if (Game.time >= judgement.expireTick) {
    debug('reset 1')
    reset();
  }

  // reset if last result is false
  if (judgement.lastResult === false) {
    debug('reset 2')
    reset();
  }

  // reset if not continuous
  if (Game.time - judgement.lastVisitTick > 1) {
    debug('reset 3')
    reset();
  }

  // judge
  const result = judge();

  judgement.lastResult = result;

  debug('judgement.expireTick: ', judgement.lastVisitTick, judgement.expireTick);
  if (result && judgement.lastVisitTick === judgement.expireTick - 2) {

    if (!resetWhenTrue) {
      judgement.lastVisitTick = Game.time;
      judgement.expireTick += 1;
    }

    return true
  }

  judgement.lastVisitTick = Game.time;

  return false;

}