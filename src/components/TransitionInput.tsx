import React, { useEffect, useRef } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import {
  FlowInputFormat,
  ReferenceFormat,
  ReferencesMapFormat,
  TransitionFormat
} from "../FlowStates";

type TransitionInputProps = {
  transition: TransitionFormat;
  idx: number;
  referencesMap: ReferencesMapFormat;
  flowInput: FlowInputFormat;
  setFlowInput: React.Dispatch<React.SetStateAction<FlowInputFormat>>;
};

export default function TransitionInput({
  transition,
  idx,
  referencesMap,
  flowInput,
  setFlowInput
}: TransitionInputProps) {
  let reference = useRef<ReferenceFormat | undefined>();

  useEffect(() => {
    reference.current = referencesMap.find(
      (ref) => ref.transition === transition.name
    );
  }, [transition.name, referencesMap]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    switch (name) {
      case "name":
        // update related states too
        setFlowInput((prevState) => ({
          ...prevState,
          name: value
        }));
        break;
      default:
        console.warn(`Unknown input change on TransitionInput: ${name}`);
    }
  };

  return (
    <Card body>
      <Form.Group as={Row}>
        <Col className="text-right pb-0">
          <Button variant="warning" size="sm" type="button">
            x
          </Button>
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId={`inputTransitionName-${idx}`}>
        <Form.Label column sm="4">
          Name
        </Form.Label>
        <Col sm="8">
          <Form.Control
            type="text"
            placeholder="Name"
            value={transition.name}
            name="name"
            onChange={handleChange}
          />
        </Col>
      </Form.Group>
      <Row>
        <Form.Label column sm="4">
          Source(s)
        </Form.Label>
        <Col sm="8" className="text-left">
          <ul>
            {(reference?.fromStates || []).map((source) => (
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
          <Form.Control as="select" value={transition.toState} custom>
            {flowInput.states.map((state) => (
              <option value={state.name}>{state.name}</option>
            ))}
          </Form.Control>
        </Col>
      </Form.Group>
    </Card>
  );
}
