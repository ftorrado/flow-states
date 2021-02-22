import React, { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import FlowContext from "../FlowContext";
import {
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
  const [referers, setReferers] = useState<string[]>([]);

  useEffect(() => {
    setReferers(referencesMap.find(
      (ref) => ref.transition === transition.id
    )?.fromStates || []);
  }, [referencesMap, transition.id]);

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

  const openTransitionDetails = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.preventDefault();
    //TODO
  };

  return (
    <Card body>
    <Row>
      <Form.Group as={Col} xs="5" controlId={`inputTransitionId-${idx}`}>
        <Form.Label>
          Id
        </Form.Label>
        <Form.Control
          type="text"
          placeholder="Id"
          value={transition.id}
          name="id"
          onChange={handleIdChange}
        />
      </Form.Group>
      <Col xs="1" className="p-1 pr-0">
        <Row>&nbsp;</Row>
        <div>=&gt;</div>
      </Col>
      <Form.Group as={Col} xs="5" controlId={`inputTransitionTarget-${idx}`}>
        <Form.Label>
          Target
        </Form.Label>
        <Form.Control as="select" value={transition.toState} onChange={handleTargetChange} custom>
          {flow.states.map((state) => (
            <option key={state.id} value={state.id}>{state.id}</option>
          ))}
        </Form.Control>
      </Form.Group>
      <Form.Group as={Col} xs="1" className="p-0 pl-3">
        <Row>
          <Button variant="warning" size="sm" type="button" onClick={handleRemove}>
            x
          </Button>
        </Row>
      </Form.Group>
      </Row>
      <Row>
        <Col sm="3">
          <Button variant="secondary" type="button" onClick={openTransitionDetails}>
            Details
          </Button>
        </Col>
      {referers &&
        <Col sm="9">
          <Row>
          <Form.Label column xs="5">
            Source(s):
          </Form.Label>
          <Col xs="7" className="text-left mt-2">
            <ul className="pl-4">
              {referers.map((source) => (
                <li key={source}>{source}</li>
              ))}
            </ul>
          </Col>
          </Row>
        </Col>
      }
      </Row>
    </Card>
  );
}
