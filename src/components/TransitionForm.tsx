import React, { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Row from "react-bootstrap/Row";
import Tooltip from "react-bootstrap/Tooltip";
import FlowContext from "../FlowContext";
import {
  Transition
} from "../FlowStates";
import TransitionDetailsForm from "./TransitionDetailsForm";

export type TransitionFormProps = {
  transition: Transition;
  idx: number;
};

export default function TransitionForm({
  transition,
  idx
}: TransitionFormProps) {
  const { flow, referencesMap, changeTransition, removeTransition } = useContext(FlowContext);
  const [referers, setReferers] = useState<string[]>([]);
  const [ showDetails, setShowDetails ] = useState<boolean>(false);

  const handleCloseDetails = () => setShowDetails(false);
  const handleShowDetails = () => setShowDetails(true);

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

  return (
    <Card body>
      <Row>
        <Col xs="11">
          <Row>
            <Form.Group as={Col} sm="5" controlId={`inputTransitionId-${idx}`}>
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
            <Col sm="2" className="p-2 pl-0 d-none d-sm-block">
              <Row>&nbsp;</Row>
              <div>=&gt;</div>
            </Col>
            <Form.Group as={Col} sm="5" controlId={`inputTransitionTarget-${idx}`}>
              <Form.Label>
                Target
              </Form.Label>
              <Form.Control as="select" value={transition.toState} onChange={handleTargetChange} custom>
                {flow.states.map((state) => (
                  <option key={state.id} value={state.id}>{state.id}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Row>

          {referers &&
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
          }
        </Col>

        <Col xs="1">
          <OverlayTrigger placement="top"
            delay={{ show: 0, hide: 200 }}
            overlay={<Tooltip id={`transition-tooltip-x-${idx}`}>Remove</Tooltip>}
          >
            <Button className="mb-2" variant="warning" size="sm" type="button" onClick={handleRemove}>
              x
            </Button>
          </OverlayTrigger>
          <OverlayTrigger placement="bottom"
            delay={{ show: 0, hide: 200 }}
            overlay={<Tooltip id={`transition-tooltip-${idx}`}>Transition details</Tooltip>}
          >
            <Button className="mb-2" variant="secondary" size="sm" type="button" onClick={handleShowDetails}>
              &#8230;
            </Button>
          </OverlayTrigger>
        </Col>
      </Row>

      <Modal show={showDetails} onHide={handleCloseDetails} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Transition details - {transition.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TransitionDetailsForm transition={transition} idx={idx} />
        </Modal.Body>
      </Modal>
    </Card>
  );
}
