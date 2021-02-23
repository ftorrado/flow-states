import React, { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import FlowContext from "../FlowContext";
import { State, StateCategory, StateCategoryVal, TransitionTarget } from "../FlowStates";

type AvailableTargets = {list: TransitionTarget[], hasAny: boolean};

type StateInputProps = {
  state: State;
  idx: number;
};

export default function StateInput({ state, idx }: StateInputProps) {
  const { flow, changeState, removeState } = useContext(FlowContext);
  const [availableTargets, setAvailableTargets] = useState<AvailableTargets>({ list: [], hasAny: false });

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

  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const category = StateCategory[(event.target.value as StateCategoryVal)] || StateCategory.Idle;
    changeState({...state, category }, idx);
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
        <Form.Group as={Row} className="mb-0" controlId={`inputStateTransitions-${idx}`}>
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
      <Col xs="1" className="p-0 pl-3">
        <Form.Group as={Row}>
          <Button variant="warning" size="sm" type="button" onClick={handleRemove}>
            x
          </Button>
        </Form.Group>
        {/* TODO
        <Form.Group as={Row}>
          <Button variant="secondary" size="sm" type="button">
            <pre>-&gt;</pre> f()
          </Button>
        </Form.Group>
        <Form.Group as={Row}>
          <Button variant="secondary" size="sm" type="button">
            f() <pre>-&gt;</pre>
          </Button>
        </Form.Group>*/}
      </Col>
      </Row>
    </Card>
  );
}
