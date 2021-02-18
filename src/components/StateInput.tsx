import React from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import { StateCategory, StateFormat } from "../FlowStates";

type StateInputProps = {
  state: StateFormat;
  idx: number;
};

export default function StateInput({ state, idx }: StateInputProps) {
  return (
    <Card body>
      <Form.Group as={Row} className="mb-1">
        <Col className="text-right pb-0">
          <Button variant="warning" size="sm" type="button">
            x
          </Button>
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId={`inputStateName-${idx}`}>
        <Form.Label column sm="4">
          Name
        </Form.Label>
        <Col sm="8">
          <Form.Control type="text" placeholder="Name" value={state.name} />
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId={`inputStateCategory-${idx}`}>
        <Form.Label column sm="4">
          Category
        </Form.Label>
        <Col sm="8">
          <Form.Control as="select" htmlSize={3} value={state.category} custom>
            {(Object.keys(StateCategory) as (keyof typeof StateCategory)[])
              .map((category) => StateCategory[category])
              .map((category) => (
                <option value={category}>{category}</option>
              ))}
          </Form.Control>
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId={`inputStateTransitions-${idx}`}>
        <Form.Label column sm="4">
          Transitions
        </Form.Label>
        <Col sm="8">
          {state.targets ? (
            state.targets.map((target) => (
              <Row className="mb-2">
                <Col>
                  <Form.Control
                    type="text"
                    value={target.name}
                    placeholder="Transition Name"
                  />
                  <span>==&gt; {target.toState}</span>
                </Col>
                <Col xs="auto" className="pl-0 m-auto">
                  <Button variant="warning" size="sm" type="button">
                    x
                  </Button>
                </Col>
              </Row>
            ))
          ) : (
            <p>No transitions</p>
          )}

          <Button variant="secondary" type="button">
            + Transition
          </Button>
        </Col>
      </Form.Group>
    </Card>
  );
}
