import {
  createContext,
  ReactNode,
  useEffect,
  useReducer,
  useState,
} from "react";
import { cycleReducer, Cycle } from "../reducers/cycle/reducer";
import {
  addNewCycleAction,
  interruptCurrentCycleAction,
  markCurrentCycleAsFinishCycle,
} from "../reducers/cycle/actions";
import { differenceInSeconds } from "date-fns";

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
  const [cyclesState, dispatchCycles] = useReducer(
    cycleReducer,
    {
      cycles: [],
      activeCycleId: null,
    },
    (initialState) => {
      const storedStateAsJSON = localStorage.getItem(
        "@ignite-timer:cycles-state-1.0.0"
      );

      if (storedStateAsJSON) {
        return JSON.parse(storedStateAsJSON);
      }

      return initialState;
    }
  );
  const { cycles, activeCycleId } = cyclesState;
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
    if (activeCycle) {
      const secondsDifference = differenceInSeconds(
        new Date(),
        new Date(activeCycle?.startDate)
      );

      return secondsDifference;
    }

    return 0;
  });

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds);
  }

  function markCurrentCycleAsFinish() {
    dispatchCycles(markCurrentCycleAsFinishCycle());
  }

  function createNewCycle(data: CreateCycleData) {
    const id = String(new Date().getTime());

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    };

    dispatchCycles(addNewCycleAction(newCycle));

    setAmountSecondsPassed(0);
  }

  function interruptCycle() {
    dispatchCycles(interruptCurrentCycleAction());

    document.title = "Ignite Timer";
  }

  useEffect(() => {
    const cyclesStateJSON = JSON.stringify(cyclesState);

    localStorage.setItem("@ignite-timer:cycles-state-1.0.0", cyclesStateJSON);
  }, [cyclesState]);

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
