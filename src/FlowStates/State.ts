import { TransitionTarget } from "./Transition";

export enum StateCategory {
  Idle,
  Open,
  Closed
};

export type StateCategoryVal = keyof typeof StateCategory;

type State = {
  id: string;
  category: StateCategory;
  targets: TransitionTarget[];
};
export default State;

export const emptyState = (id: string): State => ({
  id,
  category: StateCategory.Idle,
  targets: []
});
