import { TransitionTarget } from "./Transition";

export const StateCategory = {
  IDLE: "Idle",
  OPEN: "Open",
  CLOSED: "Closed"
} as const;

export type StateCategoryVal = typeof StateCategory[keyof typeof StateCategory];

type State = {
  id: number;
  name: string;
  category: StateCategoryVal;
  targets: TransitionTarget[];
};
export default State;

export const emptyState = (id: number): State => ({
  id,
  name: "",
  category: StateCategory.IDLE,
  targets: []
});
