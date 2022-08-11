import {
  createContext,
  ReactNode,
  useReducer,
  useState,
} from 'react';

interface CreateCycleData {
  task: string;
  minutesAmount: number;
}

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptDate?: Date;
  finshDate?: Date;
}

interface CycleContextType {
  cycles: Cycle[];
  activeCycle: Cycle | undefined;
  activeCycleId: string | null;
  amountSecondsPassed: number;
  markCurrentCycleAsFinished: () => void;
  setSecondsPassed: (seconds: number) => void;
  createNewCycle: (data: CreateCycleData) => void;
  interrupCurrentCycle: () => void;
}

interface CycleContextProviderProps {
  children: ReactNode;
}

export const CyclesContext = createContext({} as CycleContextType);

export function CyclesContextProvider({
  children,
}: CycleContextProviderProps) {
  const [cycles, dispatcher] = useReducer(
    (state: Cycle[], action: any) => {
      if (action.type === 'ADD_NEW_CYCLE') {
        return [...state, action.payload.newCycle];
      }

      return state;
    },
    []
  );

  const [activeCycleId, setActiveCycleId] = useState<string | null>(
    null
  );
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

  const activeCycle = cycles.find(
    (cycle) => cycle.id === activeCycleId
  );

  function markCurrentCycleAsFinished() {
    dispatcher({
      type: 'MARK_CURRENT_CYCLE_AS_FINISHED',
      payload: {
        activeCycleId,
      },
    });

    // setCycles((state) =>
    //   state.map((cycle) => {
    //     if (cycle.id === activeCycleId) {
    //       return { ...cycle, finshDate: new Date() };
    //     } else {
    //       return cycle;
    //     }
    //   })
    // );
  }

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds);
  }

  function createNewCycle(data: CreateCycleData) {
    const id = String(new Date().getTime());

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    };

    dispatcher({
      type: 'ADD_NEW_CYCLE',
      payload: {
        newCycle,
      },
    });
    // setCycles((state) => [...state, newCycle]);
    setActiveCycleId(id);
    setAmountSecondsPassed(0);
  }

  function interrupCurrentCycle() {
    dispatcher({
      type: 'INTERRUPT_NEW_CYCLE',
      payload: {
        activeCycleId,
      },
    });

    // setCycles((state) =>
    //   state.map((cycle) => {
    //     if (cycle.id === activeCycleId) {
    //       return { ...cycle, interruptDate: new Date() };
    //     } else {
    //       return cycle;
    //     }
    //   })
    // );

    setActiveCycleId(null);
  }

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        amountSecondsPassed,
        markCurrentCycleAsFinished,
        setSecondsPassed,
        createNewCycle,
        interrupCurrentCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  );
}
