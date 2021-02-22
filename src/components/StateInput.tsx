import React, { useContext, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import FlowContext from "../FlowContext";
import { State, StateCategory, StateCategoryVal, TransitionTarget } from "../FlowStates";

type StateInputProps = {
  state: State;
  idx: number;
};

export default function StateInput({ state, idx }: StateInputProps) {
  const { flow, changeState, removeState } = useContext(FlowContext);
  const availableTargets = useRef<TransitionTarget[]>([]);

  useEffect(() => {
    const availableTransitions = flow.transitions.filter((transition) => (
      transition.toState !== state.id && !state.targets.some((target) => target.id === transition.id)
    ));
    availableTargets.current = availableTransitions.map((transition) => ({
      id: transition.id,
      toState: transition.toState
    }));
  }, [state, flow.transitions]);

  const handleRemove = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.preventDefault();
    removeState(state.id);
  };

  const handleIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    changeState({...state, id: event.target.value}, idx);
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const category = StateCategory[(event.target.value as StateCategoryVal)] || StateCategory.Idle;
    changeState({...state, category }, idx);
  };

  const handleTargetIdChange = (targetId: string) => (
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newTargetId = event.target.value;
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
    const newTarget: TransitionTarget = flow.transitions.map((transition) => ({
      id: transition.id,
      toState: transition.toState
    })).find((target) => !state.targets.includes(target)) || {
      id: '',
      toState: ''
    };
    targets.push(newTarget);
    changeState({...state, targets }, idx);
  };

  return (
    <Card body>
      <Form.Group as={Row} className="mb-1">
        <Col className="text-right pb-0">
          <Button variant="warning" size="sm" type="button" onClick={handleRemove}>
            x
          </Button>
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId={`inputStateId-${idx}`}>
        <Form.Label column sm="4">
          Id
        </Form.Label>
        <Col sm="8">
          <Form.Control type="text" placeholder="Id" value={state.id} onChange={handleIdChange} />
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId={`inputStateCategory-${idx}`}>
        <Form.Label column sm="4">
          Category
        </Form.Label>
        <Col sm="8">
          <Form.Control as="select" htmlSize={3} value={state.category} onChange={handleCategoryChange} custom>
            {(Object.keys(StateCategory)
              .filter((key: any) => typeof StateCategory[key] === 'number') as StateCategoryVal[])
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
                    value={target.id}
                    placeholder="Transition Id"
                    onChange={handleTargetIdChange(target.id)}
                  />

                  <Form.Control as="select" value={target.id} onChange={handleTargetIdChange(target.id)} custom>
                    {(Object.keys(StateCategory)
                      .filter((key: any) => typeof StateCategory[key] === 'number') as StateCategoryVal[])
                      .map((category) => (
                        <option value={category}>{category}</option>
                      ))}
                  </Form.Control>
                  <span>==&gt; {target.toState}</span>
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

          <Button variant="secondary" type="button" disabled={availableTargets.current.length === 0} onClick={handleAddTarget}>
            + Transition
          </Button>
        </Col>
      </Form.Group>
    </Card>
  );
}
