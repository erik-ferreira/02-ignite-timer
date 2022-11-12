import { createContext, useEffect, useState } from "react";
import { HandPalm, Play } from "phosphor-react";

import { Countdown } from "../../components/Home/Countdown";
import { NewCycleForm } from "../../components/Home/NewCycleForm";

import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from "./styles";

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}

interface CyclesContextData {
  activeCycle: Cycle | undefined;
  activeCycleId: string | undefined;
  markCurrentCycleAsFinish: () => void;
}

export const CyclesContext = createContext({} as CyclesContextData);

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | undefined>(
    undefined
  );

  function markCurrentCycleAsFinish() {
    setCycles((prevCycles) =>
      prevCycles.map((cycle) =>
        cycle.id === activeCycleId
          ? { ...cycle, finishedDate: new Date() }
          : cycle
      )
    );
  }

  // function handleCreateNewCycle(data: NewCycleFormData) {
  //   const id = String(new Date().getTime());

  //   const newCycle: Cycle = {
  //     id,
  //     task: data.task,
  //     minutesAmount: data.minutesAmount,
  //     startDate: new Date(),
  //   };

  //   setCycles((prevState) => [...prevState, newCycle]);
  //   setActiveCycleId(id);
  //   setAmountSecondsPassed(0);

  //   reset();
  // }

  function handleInterruptCycle() {
    setCycles((prevCycles) =>
      prevCycles.map((cycle) =>
        cycle.id === activeCycleId
          ? { ...cycle, interruptedDate: new Date() }
          : cycle
      )
    );

    // setActiveCycleId(null);
  }

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  // const task = watch("task");
  // const isSubmitDisable = !task;

  return (
    <HomeContainer>
      <form
      // onSubmit={handleSubmit(handleCreateNewCycle)}
      >
        <CyclesContext.Provider
          value={{ activeCycle, activeCycleId, markCurrentCycleAsFinish }}
        >
          {/* <NewCycleForm /> */}

          <Countdown />
        </CyclesContext.Provider>

        {activeCycle ? (
          <StopCountdownButton type="button" onClick={handleInterruptCycle}>
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton
            // disabled={isSubmitDisable}
            type="submit"
          >
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  );
}
