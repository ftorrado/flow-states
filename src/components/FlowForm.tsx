import React, { ChangeEvent, useContext } from "react";
import { Button } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import FlowContext from "../FlowContext";
import StateInput from "./StateInput";
import TransitionInput from "./TransitionInput";


export default function FlowForm() {
  const { flow, changeFlow, addState, addTransition } = useContext(FlowContext);

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    changeFlow({ ...flow, name: event.target.value});
  };

  const handleCreateState = (event: React.MouseEvent) => {
    event.preventDefault();
    addState();
  };

  const handleStartStateChange = (event: ChangeEvent<HTMLInputElement>) => {
    changeFlow({ ...flow, startState: event.target.value});
  };

  const handleCreateTransition = (event: React.MouseEvent) => {
    event.preventDefault();
    addTransition();
  };

  const doValidation = (event: React.MouseEvent) => {
    event.preventDefault();
    //TODO
  };

  const handleSubmit = (event: React.MouseEvent) => {
    event.preventDefault();
    //TODO
  };

  return (
    <Form className="FlowForm" noValidate={true}>
      <Form.Group as={Row} controlId="inputFlowName">
        <Form.Label column sm="3" xs="4">
          Flow Name
        </Form.Label>
        <Col sm="9" xs="8">
          <Form.Control
            type="text"
            placeholder="Flow Name"
            value={flow.name}
            onChange={handleNameChange}
            required
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId="formStates">
        <Form.Label column sm="3" xs="4">
          States
        </Form.Label>
        <Col sm="9" xs="8" id="flowStates">
          {flow.states.map((state, idx) => (
            <StateInput key={`state${idx}`} state={state} idx={idx} />
          ))}
          <Button variant="secondary" type="button" className="mt-2" onClick={handleCreateState}>
            Create State
          </Button>
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId="formTransitions">
        <Form.Label column sm="3" xs="4">
          Transitions
        </Form.Label>
        <Col sm="9" xs="8" id="flowTransitions">
          {flow.transitions.map((transition, idx) => (
            <TransitionInput key={`transition${idx}`} transition={transition} idx={idx} />
          ))}
          <Button variant="secondary" type="button" className="mt-2" onClick={handleCreateTransition}>
            Create Transition
          </Button>
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId="inputStartState">
        <Form.Label column sm="3" xs="4">
          Start State
        </Form.Label>
        <Col sm="9" xs="8">
          {flow.states.length > 0 ? (
            <Form.Control as="select" value={flow.startState} onChange={handleStartStateChange} required custom>
              <option value="null" disabled>
                Select Starting State
              </option>
              {flow.states.map((state) => (
                <option key={state.id} value={state.id}>{state.id}</option>
              ))}
            </Form.Control>
          ) : (
            <p>Create States first!</p>
          )}
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId="inputSubmit">
        <Col>
          <Button variant="secondary" type="button" className="mt-2" onClick={doValidation}>
            Check errors
          </Button>
          &nbsp;&nbsp;&nbsp;
          <Button variant="primary" type="button" className="mt-2" onClick={handleSubmit}>
            Finish
          </Button>
        </Col>
      </Form.Group>
      <hr />
      <Form.Group as={Row}>
        <Form.Label column sm="3" xs="4">
          Errors
        </Form.Label>
        <Col className="mt-2">
          <ul>
            <li>TODO</li>
          </ul>
        </Col>
      </Form.Group>
    </Form>
  );
}
