import { State } from "../models/dfa";

export class DFABuilder {
    stateValues: Set<string> 
    states: State[]
    highestState: number
    // baseState: State
    constructor() {
        // const baseStateName = "Start"
        // this.baseState = {value:baseStateName, transitions: [], isAccepted: false, }
        this.stateValues = new Set([])
        this.highestState = 0;

        this.states = [];
    }

    addState(isAccepted: boolean) {
        const value = `S${++this.highestState}`;
        this.stateValues.add(value);
        this.states.push({value: value, isAccepted: isAccepted, transitions: []})
        return value
    }

    addEdge(from: string, to: string, characterMatched: string | undefined) {
        const fromNode = this.states.find((value) => value.value == from);
        const toNode = this.states.find((value) => value.value == to);
        if (!fromNode || !toNode) {
            throw Error("Attempted edge creation between non-existing states")
        }
        fromNode.transitions.push({stateTo: toNode, characterMatched: characterMatched})
    }

    deleteEdge(from: string, to: string, characterMatched: string) {
        const fromNode = this.states.find((value) => value.value == from);
        const toNode = this.states.find((value) => value.value == to);
        if (!fromNode || !toNode) {
            throw Error("Attempted edge deletion between non-existing states")
        }
        const edgeExists = fromNode.transitions.find((value) => value.stateTo.value == to && value.characterMatched == characterMatched)
        if (!edgeExists) {
            throw Error("Edge does not exist")
        }
        fromNode.transitions = fromNode.transitions.filter((value) => !(value.stateTo.value == to && value.characterMatched == characterMatched))
    }
}