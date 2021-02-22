import React, { useContext, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import FlowContext from "../FlowContext";
import {
  ReferenceFormat,
  Transition
} from "../FlowStates";


type TransitionInputProps = {
  transition: Transition;
  idx: number;
};

export default function TransitionInput({
  transition,
  idx
}: TransitionInputProps) {
  const { flow, referencesMap, changeTransition, removeTransition } = useContext(FlowContext);
  const referenceRef = useRef<ReferenceFormat>();

  useEffect(() => {
    referenceRef.current = referencesMap.find(
      (ref) => ref.transition === transition.id
    );
  }, [transition.id, referencesMap]);

  const handleRemove = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.preventDefault();
    removeTransition(transition.id);
  };

  const handleIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    changeTransition({...transition, id: event.target.value}, idx);
  };

  const handleTargetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    changeTransition({...transition, toState: event.target.value}, idx);
  };

  return (
    <Card body>
      <Form.Group as={Row}>
        <Col className="text-right pb-0">
          <Button variant="warning" size="sm" type="button" onClick={handleRemove}>
            x
          </Button>
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId={`inputTransitionId-${idx}`}>
        <Form.Label column sm="4">
          Id
        </Form.Label>
        <Col sm="8">
          <Form.Control
            type="text"
            placeholder="Id"
            value={transition.id}
            name="id"
            onChange={handleIdChange}
          />
        </Col>
      </Form.Group>
      <Row>
        <Form.Label column sm="4">
          Source(s)
        </Form.Label>
        <Col sm="8" className="text-left">
          <ul>
            {(referenceRef.current?.fromStates || []).map((source) => (
              <li>{source}</li>
            ))}
          </ul>
        </Col>
      </Row>
      <Form.Group as={Row} controlId={`inputTransitionTarget-${idx}`}>
        <Form.Label column sm="4">
          Target
        </Form.Label>
        <Col sm="8">
          <Form.Control as="select" value={transition.toState} onChange={handleTargetChange} custom>
            {flow.states.map((state) => (
              <option value={state.id}>{state.id}</option>
            ))}
          </Form.Control>
        </Col>
      </Form.Group>
    </Card>
  );
}
