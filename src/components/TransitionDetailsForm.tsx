import React, { useContext, useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import FlowContext from "../FlowContext";
import * as FunctionStringConverter from "../utils/FunctionStringConverter";
import CodeEditor from "./CodeEditor/CodeEditor";
import { TransitionFormProps } from "./TransitionForm";

const onTransitionArgs = '(dataStore: Object, sourceState: State)';
const validateArgs = `${onTransitionArgs}: boolean`;
const onTransitionSignature = FunctionStringConverter.makeSignature('onTransition', onTransitionArgs);
const validateSignature = FunctionStringConverter.makeSignature('validate', validateArgs);

export default function TransitionDetailsForm({ transition, idx }: TransitionFormProps) {
  const { changeTransition } = useContext(FlowContext);
  const [validateString, setValidateString] = useState(
    FunctionStringConverter.functionToString(validateSignature, transition.validate));
  const [onTransitionString, setOnTransitionString] = useState(
    FunctionStringConverter.functionToString(onTransitionSignature, transition.onTransition));

  /*useEffect(() => {
    console.log('validate changed', validateString, transition.validate);
    setValidateString(FunctionStringConverter.functionToString(validateSignature, transition.validate));
  }, [transition.validate]);

  useEffect(() => {
    console.log('onTransition changed', onTransitionString, transition.onTransition);
    setOnTransitionString(FunctionStringConverter.functionToString(onTransitionSignature, transition.onTransition));
  }, [transition.onTransition]);*/

  const handlePriorityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const numVal = parseInt(event.target.value, 10);
    changeTransition({ ...transition, priority: isNaN(numVal) || !event.target.value ? undefined: numVal }, idx);
  };

  const handleClearValidate = () => {
    console.log('clearing "validate()"');
    changeTransition( { ...transition, validate: undefined }, idx);
    setValidateString(FunctionStringConverter.functionToString(validateSignature, undefined));
  };

  const handleValidateString = (value: string) => {
    const validate = FunctionStringConverter.stringToFunction(validateSignature, value) as ((dataStore: Object, sourceState: string) => boolean) | undefined;
    console.log('setting "validate()"', value, validate);
    changeTransition( { ...transition, validate }, idx);
    setValidateString(value);
  };

  const handleClearOnTransition = () => {
    console.log('clearing "onTransition()"');
    changeTransition( { ...transition, onTransition: undefined }, idx);
    setOnTransitionString(FunctionStringConverter.functionToString(onTransitionSignature, undefined));
  };

  const handleOnTransitionString = (value: string) => {
    const onTransition = FunctionStringConverter.stringToFunction(onTransitionSignature, value) as ((dataStore: Object, sourceState: string) => void) | undefined;
    console.log('setting "onTransition()"', value, onTransition);
    changeTransition( { ...transition, onTransition }, idx);
    setOnTransitionString(value);
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
      <Form.Group as={Row} controlId={`inputTransitionValidate-${idx}`}>
        <Col sm="10">
          <CodeEditor content={validateString} setContent={handleValidateString} language="js" />
        </Col>
        <Col sm="2">
          <Button variant="secondary" size="sm" type="button" onClick={handleClearValidate}>
            Clear
          </Button>
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId={`inputTransitionOn-${idx}`}>
        <Col sm="10">
          <CodeEditor content={onTransitionString} setContent={handleOnTransitionString} language="js" />
        </Col>
        <Col sm="2">
          <Button variant="secondary" size="sm" type="button" onClick={handleClearOnTransition}>
            Clear
          </Button>
        </Col>
      </Form.Group>
    </section>
  )
}
