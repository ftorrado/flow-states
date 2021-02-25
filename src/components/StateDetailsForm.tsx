import React, { useContext } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import FlowContext from "../FlowContext";
import { StateCategory, StateCategoryVal } from "../FlowStates";
import { StateFormProps } from "./StateForm";

export default function StateDetailsForm({ state, idx }: StateFormProps) {
  const { changeState } = useContext(FlowContext);

  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    changeState({...state, category: event.target.value as unknown as StateCategory }, idx);
  };

  return(
    <section>
      <Form.Group as={Row} controlId={`inputStateCategory-${idx}`}>
        <Form.Label column sm="4">
          Category
        </Form.Label>
        <Col sm="8">
          <Form.Control as="select" value={state.category} onChange={handleCategoryChange} custom>
            {(Object.keys(StateCategory)
              .filter((key: any) => typeof StateCategory[key] === 'number') as StateCategoryVal[])
              .map((category) => (
                <option key={category} value={StateCategory[category]}>{category}</option>
              ))}
          </Form.Control>
        </Col>
      </Form.Group>

    </section>
  )
}
