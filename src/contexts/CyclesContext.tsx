import { createContext, ReactNode, useReducer, useState } from "react";

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}

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

interface CyclesState {
  cycles: Cycle[];
  activeCycleId: string | null;
}

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  const [cyclesState, dispatchCycles] = useReducer(
    (state: CyclesState, action: any) => {
      switch (action.type) {
        case "ADD_NEW_CYCLE":
          return {
            ...state,
            cycles: [...state.cycles, action.payload.newCycle],
            activeCycleId: action.payload.newCycle.id,
          };

        case "INTERRUPT_CURRENT_CYCLE":
          return {
            ...state,
            cycles: state.cycles.map((cycle) =>
              cycle.id === state.activeCycleId
                ? { ...cycle, interruptedDate: new Date() }
                : cycle
            ),
            activeCycleId: null,
          };

        case "MARK_CURRENT_CYCLE_AS_FINISH":
          return {
            ...state,
            cycles: state.cycles.map((cycle) =>
              cycle.id === state.activeCycleId
                ? { ...cycle, finishedDate: new Date() }
                : cycle
            ),
            activeCycleId: null,
          };

        default:
          return state;
      }
    },
    {
      cycles: [],
      activeCycleId: null,
    }
  );
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

  const { cycles, activeCycleId } = cyclesState;
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds);
  }

  function markCurrentCycleAsFinish() {
    dispatchCycles({
      type: "MARK_CURRENT_CYCLE_AS_FINISH",
      payload: {
        activeCycleId,
      },
    });
  }

  function createNewCycle(data: CreateCycleData) {
    const id = String(new Date().getTime());

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    };

    dispatchCycles({
      type: "ADD_NEW_CYCLE",
      payload: {
        newCycle,
      },
    });

    setAmountSecondsPassed(0);
  }

  function interruptCycle() {
    dispatchCycles({
      type: "INTERRUPT_CURRENT_CYCLE",
      payload: {
        activeCycleId,
      },
    });

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
