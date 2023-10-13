import { DFABuilder } from "@/helpers/dfa_builder";
import { State, Step } from "@/models/dfa";
import { useRef, useState } from "react";
import { GraphFromDFA } from "./GraphFromDFA";

const EMPTY = "£"
interface DFABuildAnimatorParams {
    regex: string;
}

type Steps = [((dfaBuilder: DFABuilder, parent: string, charMatched: string, charMatched2: string) => string), string, string][];

function addFinish(dfaBuilder: DFABuilder, parent: string, charMatched: string, charMatched2: string) {
    const state = dfaBuilder.addState(true)
    dfaBuilder.addEdge(parent, state, EMPTY)
    return state
}
function addConcat(dfaBuilder: DFABuilder, parent: string, charMatched: string, charMatched2: string) {
    const state = dfaBuilder.addState(false)
    dfaBuilder.addEdge(parent, state, charMatched)
    return state;
}

function addStar(dfaBuilder: DFABuilder, parent: string, charMatched: string, charMatched2: string) {
    const state1 = dfaBuilder.addState(false)
    const state2 = dfaBuilder.addState(false)
    const state3 = dfaBuilder.addState(false)
    dfaBuilder.addEdge(parent, state1, EMPTY)
    dfaBuilder.addEdge(state1, state2, charMatched)
    dfaBuilder.addEdge(state2, state1, EMPTY)
    dfaBuilder.addEdge(state2, state3, EMPTY)
    dfaBuilder.addEdge(state1, state3, EMPTY)
    return state3;
}

function addOr(dfaBuilder: DFABuilder, parent: string, charMatched: string, charMatched2: string) {
    const state1 = dfaBuilder.addState(false)
    const state2 = dfaBuilder.addState(false)
    const state3 = dfaBuilder.addState(false)
    const state4 = dfaBuilder.addState(false)
    const state5 = dfaBuilder.addState(false)
    dfaBuilder.addEdge(parent, state1, EMPTY)
    dfaBuilder.addEdge(parent, state2, EMPTY)
    dfaBuilder.addEdge(state1, state3, charMatched)
    dfaBuilder.addEdge(state2, state4, charMatched2)
    dfaBuilder.addEdge(state3, state5, EMPTY)
    dfaBuilder.addEdge(state4, state5, EMPTY)
    return state5;
}

function getSteps(regex:string, steps:  Steps) {
    const len = regex.length
    for(let i = 0; i < len - 1; i++) {
        const cur = regex[i]
        const next = regex[i + 1]

        if (next != "*" && next != "|") {
            steps.push([addConcat, cur, ""])
        }

        if(next == "*") {
            steps.push([addStar, cur, ""])
            i += 1;
        }
        if(next == "|") {
            steps.push([addOr, cur, regex[i + 2]])
            i += 2;
        }
    }
    if (regex[len - 1] != "*" && regex[len - 2] != "|") {
        steps.push([addConcat, regex[len - 1], ""])
    }

    steps.push([addFinish, regex[len - 1], ""])
}
export function DFABuildAnimator({regex}:DFABuildAnimatorParams) {
    const [currentStep, setCurrentStep] = useState<number>(0)
    const dfaBuilder = new DFABuilder()

    let steps: Steps = [];
    getSteps(regex, steps)
    let parent = dfaBuilder.states[0].value
    console.log(steps)
    for(const [func, char, char2] of steps) {
        console.log(char, parent)
        const newParent = func(dfaBuilder, parent, char, char2)
        parent = newParent
    }
    return (
        <>
            {/* <input type="button" onClick={() => setCurrentStep(Math.min(currentStep + 1, steps.length))}  value="Next" /> */}
            <GraphFromDFA states={dfaBuilder.states} />
        </>
    )
}