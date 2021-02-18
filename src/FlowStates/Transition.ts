export type TransitionTarget = {
  id: number;
  toState: number;
};

type Transition = {
  id: number;
  name: string;
  toState: number;
  validate?: (dataStore: Object, sourceState: string) => boolean;
  onTransition?: (dataStore: Object, sourceState: string) => void;
};
export default Transition;

export const emptyTransition = (id: number): Transition => ({
  id,
  name: "",
  toState: -1
});
