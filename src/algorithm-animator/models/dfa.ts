export interface Transition {
    characterMatched: string;
    stateTo: State
}
export interface State {
    value: string;
    isAccepted: boolean;
    transitions: Transition[]
}
export interface DFA {
    states: State[]
}
export type Steps = (State | Transition)[];