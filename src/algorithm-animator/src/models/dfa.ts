export interface Transition {
    characterMatched: string | undefined;
    stateTo: State
    active?: boolean;
}
export interface State {
    value: string;
    isAccepted: boolean;
    transitions: Transition[]
    active?: boolean;
}
/* eslint-disable  @typescript-eslint/no-explicit-any */
export function instanceOfState(object: any): object is State {
    return 'state' in object;
}
export interface DFA {
    states: State[]
}
export type Step = (State | Transition);