import { createContext, ReactNode, useReducer, useState } from "react";
import { cycleReducer, Cycle } from "../reducers/cycle/reducer";
import {
  addNewCycleAction,
  interruptCurrentCycleAction,
  markCurrentCycleAsFinishCycle,
} from "../reducers/cycle/actions";

interface CreateCycleData {
  task: string;
  minutesAmount: number;
}

interface CyclesContextData {
  cycles: Cycle[];
  amountSecondsPassed: number;
  activeCycle: Cycle | undefined;
  activeCycleId: string | null;

  interruptCycle: () => void;
  markCurrentCycleAsFinish: () => void;
  setSecondsPassed: (seconds: number) => void;
  createNewCycle: (values: CreateCycleData) => void;
}

export const CyclesContext = createContext({} as CyclesContextData);

interface CyclesContextProviderProps {
  children: ReactNode;
}

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  const [cyclesState, dispatchCycles] = useReducer(cycleReducer, {
    cycles: [],
    activeCycleId: null,
  });
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

  const { cycles, activeCycleId } = cyclesState;
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds);
  }

  function markCurrentCycleAsFinish() {
    dispatchCycles(markCurrentCycleAsFinishCycle);
  }

  function createNewCycle(data: CreateCycleData) {
    const id = String(new Date().getTime());

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    };

    dispatchCycles(addNewCycleAction);

    setAmountSecondsPassed(0);
  }

  function interruptCycle() {
    dispatchCycles(interruptCurrentCycleAction);

    document.title = "Ignite Timer";
  }

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        markCurrentCycleAsFinish,
        amountSecondsPassed,
        setSecondsPassed,
        createNewCycle,
        interruptCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  );
}
