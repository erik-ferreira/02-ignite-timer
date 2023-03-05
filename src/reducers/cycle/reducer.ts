import produce from "immer";
import { ActionTypes } from "./actions";

export interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}

interface CyclesState {
  cycles: Cycle[];
  activeCycleId: string | null;
}

export function cycleReducer(state: CyclesState, action: any) {
  switch (action.type) {
    case ActionTypes.ADD_NEW_CYCLE:
      return produce(state, (draft) => {
        draft.cycles.push(action.payload.newCycle);
        draft.activeCycleId = action.payload.newCycle.id;
      });

    case ActionTypes.INTERRUPT_CURRENT_CYCLE: {
      const cycleIndexActive = state.cycles.findIndex(
        (cycle) => cycle.id === state.activeCycleId
      );

      if (cycleIndexActive < 0) {
        return state;
      }

      return produce(state, (draft) => {
        draft.cycles[cycleIndexActive].interruptedDate = new Date();
        draft.activeCycleId = null;
      });
    }
    case ActionTypes.MARK_CURRENT_CYCLE_AS_FINISH: {
      const cycleIndexActive = state.cycles.findIndex(
        (cycle) => cycle.id === state.activeCycleId
      );

      if (cycleIndexActive < 0) {
        return state;
      }

      return produce(state, (draft) => {
        draft.cycles[cycleIndexActive].finishedDate = new Date();
        draft.activeCycleId = null;
      });
    }
    default:
      return state;
  }
}
