export interface Transition {
    characterMatched: string;
    stateTo: State
    active?: boolean;
}
export interface State {
    value: string;
    isAccepted: boolean;
    transitions: Transition[]
    active?: boolean;
}

export function instanceOfState(object: any): object is State {
    return 'state' in object;
}
export interface DFA {
    states: State[]
}
export type Step = (State | Transition);