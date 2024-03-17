import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FSABuilder } from "../helpers/FSABuilder";
import { State } from "../models/dfa";
import { GraphFromDFA } from "./GraphFromDFA";

export const EMPTY = "ε"
interface DFABuildAnimatorParams {
    regex: string;
    states: State[];
    setStates: Dispatch<SetStateAction<State[]>>
    NFAComplete: boolean;
    setNFAComplete: Dispatch<SetStateAction<boolean>>
}
type Step = (dfaBuilder: FSABuilder, parent: string, a: (Steps | string), b: (Steps | string)) => string
type Steps = [Step, Steps | string, Steps | string][];

function addFinish(dfaBuilder: FSABuilder, parent: string, _: Steps | string, __: Steps | string) {
    const state = dfaBuilder.addState(true)
    dfaBuilder.addEdge(parent, state, EMPTY)
    return state
}
function addConcat(dfaBuilder: FSABuilder, parent: string,  a: Steps | string, _: Steps | string) {
    if (typeof a === "string") {
        const state = dfaBuilder.addState(false);
        dfaBuilder.addEdge(parent, state, a);
        return state;
    }
    else {
        const state = addA(dfaBuilder, parent, a, _)
        return state;
    }
}

function addA(dfaBuilder: FSABuilder, parent: string, a:Steps | string, _: Steps | string) {
    let p = parent;
    for (const [step, aSub, bSub] of a) {
        //@ts-expect-error For some reason typescript assumes its an array of Step | string | Steps instead of tuple of Step, Steps | string, Steps | string
        p = step(dfaBuilder, p, aSub, bSub);
    }
    return p;
}

function addStar(dfaBuilder: FSABuilder, parent: string, a:Steps | string, _: Steps | string) {
    if (typeof a === "string") {
        throw new Error("Error");
    }
    const state1 = dfaBuilder.addState(false)
    const state3 = dfaBuilder.addState(false)
    dfaBuilder.addEdge(parent, state1, EMPTY)
    const state2 = addA(dfaBuilder, state1, a, _)
    dfaBuilder.addEdge(state2, state1, EMPTY)
    dfaBuilder.addEdge(state2, state3, EMPTY)
    dfaBuilder.addEdge(state1, state3, EMPTY)
    return state3;
}

function addOr(dfaBuilder: FSABuilder, parent: string, a:Steps | string, b: Steps | string) {
    const state1 = dfaBuilder.addState(false)
    const state2 = dfaBuilder.addState(false)
    const state3 = addA(dfaBuilder, state1, a, [])
    const state4 = addA(dfaBuilder, state2, b, [])
    const state5 = dfaBuilder.addState(false)
    dfaBuilder.addEdge(parent, state1, EMPTY)
    dfaBuilder.addEdge(parent, state2, EMPTY)
    dfaBuilder.addEdge(state3, state5, EMPTY)
    dfaBuilder.addEdge(state4, state5, EMPTY)
    return state5;
}
function appendCurSteps(regex: string, i: number, len: number, steps: Steps) {
    const cur = regex[i];
    if (cur == "(") {
        let j = i+1
        let curBracket = 1;
        for(; j < len; j++) { 
            if (regex[j] == ")") curBracket--;
            if (regex[j] == "(") curBracket++;
            if (curBracket == 0) break;
        }
        if (j == len) throw new Error("Error")
        getSteps(regex.substring(i + 1, j), steps, false)
        return j + 1
        
    } else {
        steps.push([addConcat, cur, ""])
        return i + 1
    }

}
function checkForCurrentLevelOr(regex:string) {
    let par = 0
    for(let i = 0; i < regex.length; i++) {
        const cur = regex[i];
        if (cur == "(") par += 1
        if (cur == ")") par -= 1

        if (cur == "|" && par === 0) {
            return i
        }
    }
    return -1
}
// FIXME (ab*)|ac
function getSteps(regex:string, steps:  Steps, createFinal:boolean) {
    const len = regex.length
    const orIndex = checkForCurrentLevelOr(regex)
    if (orIndex !== -1) {
        const curStepsA: Steps = []
        const curStepsB: Steps = []

        const regexA = regex.substring(0,orIndex)
        const regexB = regex.substring(orIndex + 1)
        getSteps(regexA, curStepsA, false)
        getSteps(regexB, curStepsB, false)

        steps.push([addOr, curStepsA, curStepsB])

        if(createFinal) {
            steps.push([addFinish, regex[len - 1], ""])
        }

        return
    }
    for(let i = 0; i < len - 1;) {
        const curSteps: Steps = []
        let nextI = appendCurSteps(regex, i, len, curSteps)
        const next = regex[nextI]
        
        if (next != "*" && next != "|") {
            steps.push([addConcat, curSteps, ""])
        }

        else if(next == "*") {
            steps.push([addStar, curSteps, []])
            nextI++;
        }
        else if(next == "|") {
            throw new Error("error")
        }
        i = nextI
    }
    if (regex[len - 1] != "*" && regex[len - 2] != "|" && regex[len - 1] != ")") {
        steps.push([addConcat, regex[len - 1], ""])
    }
    if(createFinal) {
        steps.push([addFinish, regex[len - 1], ""])
    }
}

export function ENFABuildAnimator({regex, states, setStates, setNFAComplete}:DFABuildAnimatorParams) {
    const s: Steps = []
    getSteps(regex, s, true)
    const [steps, ] = useState<Steps>(s)
    useEffect(() => {
        const dfaBuilder = new FSABuilder()
        dfaBuilder.addState(false)
        let parent = "S1"
        for(const [func, char, char2] of steps) {
            const newParent = func(dfaBuilder, parent, char, char2)
            parent = newParent
        }
        setStates(dfaBuilder.states)
            setNFAComplete(true)
    }, [steps])
    
    return (
        <>
            <GraphFromDFA key="g-enfa-from-regex" id="g-enfa-from-regex" states={states} />
        </>
    )
}