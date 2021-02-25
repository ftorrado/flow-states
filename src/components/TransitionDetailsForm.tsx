import React, { useContext } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import FlowContext from "../FlowContext";
import { TransitionFormProps } from "./TransitionForm";

export default function TransitionDetailsForm({ transition, idx }: TransitionFormProps) {
  const { changeTransition } = useContext(FlowContext);

  const handlePriorityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const numVal = parseInt(event.target.value, 10);
    changeTransition({ ...transition, priority: isNaN(numVal) || !event.target.value ? undefined: numVal }, idx);
  };

  return(
    <section>
      <Form.Group as={Row} controlId={`inputTransitionPriority-${idx}`}>
        <Form.Label column sm="4">
          Priority (def. 0)
        </Form.Label>
        <Col sm="8">
          <Form.Control type="number"
            value={transition.priority}
            name="priority"
            onChange={handlePriorityChange}
          />
        </Col>
      </Form.Group>
    </section>
  )
}
