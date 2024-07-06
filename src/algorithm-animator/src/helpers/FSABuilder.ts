import { State } from "../models/dfa";

export class FSABuilder {
    stateValues: Set<string> 
    states: State[]
    highestState: number
    constructor() {
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
    switchType(name: string) {
        const stateIndex = this.states.findIndex((s) => s.value == name);
        if (stateIndex > -1) {
            this.states[stateIndex].isAccepted = !this.states[stateIndex].isAccepted;
        }
    }

    addEdge(from: string, to: string, characterMatched: string | undefined) {
        if (!characterMatched) {
            alert("Cannot create an edge without matching character!")
            throw new Error()
        }
        const fromNode = this.states.find((value) => value.value == from);
        const toNode = this.states.find((value) => value.value == to);
        if (!fromNode || !toNode) {
            alert("Attempted edge creation between non-existing states!")
            throw new Error()
        }
        const identicalEdge = fromNode.transitions.find((t) => t.stateTo == toNode && t.characterMatched == characterMatched)
        if (identicalEdge) {
            alert("This edge already exists, cannot create identical one!")
            throw new Error()
        }
        fromNode.transitions.push({stateTo: toNode, characterMatched: characterMatched})
    }

    deleteEdge(from: string, to: string, characterMatched: string) {
        const fromNode = this.states.find((value) => value.value == from);
        const toNode = this.states.find((value) => value.value == to);
        if (!fromNode || !toNode) {
            throw new Error("Attempted edge deletion between non-existing states")
        }
        const edgeExists = fromNode.transitions.find((value) => value.stateTo.value == to && value.characterMatched == characterMatched)
        if (!edgeExists) {
            throw new Error("Edge does not exist")
        }
        fromNode.transitions = fromNode.transitions.filter((value) => !(value.stateTo.value == to && value.characterMatched == characterMatched))
    }
    deleteState(s:string) {
        this.states = this.states.filter((state)=> state.value !== s)
        this.states.forEach((_, index) => {
            this.states[index].transitions = this.states[index].transitions.filter((transition) =>transition.stateTo.value !== s)
        })
    }
}