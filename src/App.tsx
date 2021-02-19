import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import "./styles.css";
import logo from './logo.svg';

import React, { useEffect, useRef, useState } from "react";
import Container from "react-bootstrap/Container";

import FlowForm from "./components/FlowForm";
import FlowContext, { defaultFlow } from "./FlowContext";
import {
  State,
  Transition,
  ReferencesMap,
  createReferencesMap
} from "./FlowStates";
import FlowBuilder, { FlowBuildFormat } from "./FlowStates/FlowBuilder";

function App() {
  const [flow, setFlow] = useState<FlowBuildFormat>(defaultFlow);
  const referencesMapRef = useRef<ReferencesMap>([]);

  useEffect(() => {
    referencesMapRef.current = createReferencesMap(flow) || [];
  }, [flow]);

  const changeFlow = (newFlow: FlowBuildFormat) => {
    setFlow({ ...flow, ...newFlow });
  }

  const changeState = (state: State, idx: number) => {
    const states = flow.states.slice();
    states[idx] = state;
    setFlow({ ...flow, states });
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
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>

      <main>
      <h1>FlowStates</h1>
      <p>Cool little editor to create state machine flow charts!</p>
        <Container>
          <FlowContext.Provider value={{
            flow,
            referencesMap: referencesMapRef.current,
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
