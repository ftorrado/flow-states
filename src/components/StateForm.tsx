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
import { State, TransitionTarget } from "../FlowStates";
import StateDetailsForm from "./StateDetailsForm";

type AvailableTargets = {list: TransitionTarget[], hasAny: boolean};

export type StateFormProps = {
  state: State;
  idx: number;
};

export default function StateForm({ state, idx }: StateFormProps) {
  const { flow, changeState, removeState } = useContext(FlowContext);
  const [availableTargets, setAvailableTargets] = useState<AvailableTargets>({ list: [], hasAny: false });
  const [ showDetails, setShowDetails ] = useState<boolean>(false);

  const handleCloseDetails = () => setShowDetails(false);
  const handleShowDetails = () => setShowDetails(true);

  useEffect(() => {
    console.log(`Setting available targets for state ${state.id}`);
    const availableTransitions = flow.transitions.filter((transition) => (
      transition.toState !== state.id && !state.targets.some((target) => target.id === transition.id)
    ));
    const _availableTargets = availableTransitions.map((transition) => ({
      id: transition.id,
      toState: transition.toState
    }));
    console.log(state.targets, _availableTargets);
    setAvailableTargets({
      list: _availableTargets,
      hasAny: _availableTargets.length > 0
    });
  }, [state.id, state.targets, flow.transitions]);

  const handleRemove = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.preventDefault();
    removeState(state.id);
  };

  const handleIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    changeState({...state, id: event.target.value}, idx);
  };

  const handleTargetIdChange = (targetId: string) => (
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newTargetId = event.target.value;
      console.log('Handling target ID change', newTargetId);
      if (newTargetId === targetId) return;
      const targets = state.targets.slice().map((target) => {
        if (target.id === targetId) {
          return {
            id: newTargetId,
            toState: flow.transitions.find((transition) => transition.id === newTargetId)?.toState || ''
          };
        }
        return target;
      });
      console.log(targets);
      changeState({...state, targets }, idx);
    }
  );

  const handleRemoveTarget = (targetId: string) => (
    (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
      event.preventDefault();
      const targets = state.targets.slice().filter((target) => target.id !== targetId);
      changeState({...state, targets }, idx);
    }
  );

  const handleAddTarget = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.preventDefault();
    const targets = state.targets.slice();
    const newTarget: TransitionTarget = availableTargets.list[0] || {
      id: '',
      toState: ''
    };
    console.log("Adding target", newTarget);
    targets.push(newTarget);
    changeState({...state, targets }, idx);
  };

  return (
    <Card body>
      <Row>
      <Col xs="11">
        <Form.Group as={Row} controlId={`inputStateId-${idx}`}>
          <Form.Label column sm="4">
            Id
          </Form.Label>
          <Col sm="8">
            <Form.Control type="text" placeholder="Id" value={state.id} onChange={handleIdChange} />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-0" id={`inputStateTransitions-${idx}`}>
          <Form.Label column sm="4">
            Transitions
          </Form.Label>
          <Col sm="8" className="text-left">
            {state.targets ? (
              state.targets.map((target) => (
                <Row key={`target${target.id}`} className="mb-2">
                  <Col>
                    <Form.Control as="select" value={target.id} onChange={handleTargetIdChange(target.id)} custom>
                      <option value="null" disabled>Select Transition Target</option>
                      <option value={target.id}>{target.id} (=&gt; {target.toState})</option>
                      {availableTargets.list.map((otherTarget) => (
                        <option key={otherTarget.id} value={otherTarget.id}>
                          {otherTarget.id} (=&gt; {otherTarget.toState})
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                  <Col xs="auto" className="pl-0 m-auto">
                    <Button variant="warning" size="sm" type="button" onClick={handleRemoveTarget(target.id)}>
                      x
                    </Button>
                  </Col>
                </Row>
              ))
            ) : (
              <p>No transitions</p>
            )}

            {availableTargets.hasAny && (
            <Button variant="secondary" type="button" onClick={handleAddTarget}>
              + Transition
            </Button>
            )}
          </Col>
        </Form.Group>
      </Col>

      <Col xs="1">
        <OverlayTrigger placement="top"
          delay={{ show: 0, hide: 200 }}
          overlay={<Tooltip id={`state-tooltip-x-${idx}`}>Remove</Tooltip>}
        >
          <Button className="mb-2" variant="warning" size="sm" type="button" onClick={handleRemove}>
            x
          </Button>
        </OverlayTrigger>
        <OverlayTrigger placement="bottom"
          delay={{ show: 0, hide: 200 }}
          overlay={<Tooltip id={`state-tooltip-${idx}`}>State details</Tooltip>}
        >
          <Button className="mb-2" variant="secondary" size="sm" type="button" onClick={handleShowDetails}>
            &#8230;
          </Button>
        </OverlayTrigger>
      </Col>
      </Row>

      <Modal show={showDetails} onHide={handleCloseDetails}>
        <Modal.Header closeButton>
          <Modal.Title>State details - {state.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <StateDetailsForm state={state} idx={idx} />
        </Modal.Body>
      </Modal>
    </Card>
  );
}
