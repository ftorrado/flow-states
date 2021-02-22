import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import './App.css';
import FlowForm from "./components/FlowForm";
import FlowContext, { defaultFlow } from "./FlowContext";
import {
  createReferencesMap, ReferencesMap, State,
  Transition
} from "./FlowStates";
import FlowBuilder, { FlowBuildFormat } from "./FlowStates/FlowBuilder";
import "./styles.css";

function App() {
  const [flow, setFlow] = useState<FlowBuildFormat>(defaultFlow);
  const [referencesMap, setReferencesMap] = useState<ReferencesMap>([]);

  useEffect(() => {
    setReferencesMap(createReferencesMap(flow) || []);
    console.log('Updating references map');
  }, [flow, flow.states, flow.transitions]);

  const changeFlow = (newFlow: FlowBuildFormat) => {
    setFlow({ ...flow, ...newFlow });
  }

  const changeState = (state: State, idx: number) => {
    const states = flow.states.slice();
    const oldId = states[idx].id;
    states[idx] = state;
    if (oldId === state.id) {
      setFlow({ ...flow, states });
    } else {
      const newId = state.id;
      console.log('Changing state id', oldId, newId);
      setFlow({
        ...flow,
        startState: flow.startState === oldId ? newId : flow.startState,
        states: states.map((state) => (
          {
            ...state,
            targets: state.targets.map((target) => {
              if (target.toState === oldId) {
                return { ...target, toState: newId };
              }
              return target;
            })
          }
        )),
        transitions: flow.transitions.map((transition) => (
          {
            ...transition,
            toState: transition.toState === oldId ? newId : transition.toState
          }
        ))
      });
    }
  };

  const addState = () => {
    const _flow = new FlowBuilder(flow);
    _flow.createState();
    setFlow(_flow.getData());
  };

  const removeState = (id: string) => {
    const _flow = new FlowBuilder(flow);
    _flow.removeState(id);
    setFlow(_flow.getData());
  };

  const changeTransition = (transition: Transition, idx: number) => {
    const oldValue: Transition = flow.transitions[idx];
    const transitions = flow.transitions.slice();

    if (oldValue.toState !== transition.toState) {
      const _flow = new FlowBuilder(flow);
      _flow.changeTransitionTarget(transition.id, transition.toState);
      setFlow(_flow.getData());
    } else {
      transitions[idx] = transition;
      setFlow({ ...flow, transitions });
    }
  };

  const addTransition = () => {
    const _flow = new FlowBuilder(flow);
    _flow.createTransition();
    setFlow(_flow.getData());
  };

  const removeTransition = (id: string) => {
    const _flow = new FlowBuilder(flow);
    _flow.removeTransition(id);
    setFlow(_flow.getData());
  };

  return (
    <div className="App">
      <header className="App-header pt-3">
        <h1>FlowStates</h1>
        <p>Cool little editor to create workflows as a simple state machine!</p>
      </header>

      <main className="pt-3">
        <Container>
          <FlowContext.Provider value={{
            flow,
            referencesMap,
            changeFlow,
            changeState,
            addState,
            removeState,
            changeTransition,
            addTransition,
            removeTransition,
          }}>
            <FlowForm />
          </FlowContext.Provider>
        </Container>
      </main>
    </div>
  );
}
export default App;
