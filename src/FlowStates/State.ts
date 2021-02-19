import { TransitionTarget } from "./Transition";

export const StateCategory = {
  IDLE: "Idle",
  OPEN: "Open",
  CLOSED: "Closed"
} as const;

export type StateCategoryVal = typeof StateCategory[keyof typeof StateCategory];

type State = {
  id: string;
  category: StateCategoryVal;
  targets: TransitionTarget[];
};
export default State;

export const emptyState = (id: string): State => ({
  id,
  category: StateCategory.IDLE,
  targets: []
});
