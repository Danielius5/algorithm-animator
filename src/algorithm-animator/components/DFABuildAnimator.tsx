import { DFABuilder } from "@/helpers/dfa_builder";
import { State } from "@/models/dfa";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { GraphFromDFA } from "./GraphFromDFA";

const EMPTY = "£"
interface DFABuildAnimatorParams {
    regex: string;
    states: State[];
    setStates: Dispatch<SetStateAction<State[]>>
}
type Step = (dfaBuilder: DFABuilder, parent: string, a: (Steps | string), b: (Steps | string)) => string
type Steps = [Step, Steps | string, Steps | string][];

function addFinish(dfaBuilder: DFABuilder, parent: string, _: Steps | string, __: Steps | string) {
    const state = dfaBuilder.addState(true)
    dfaBuilder.addEdge(parent, state, EMPTY)
    return state
}
function addConcat(dfaBuilder: DFABuilder, parent: string,  a: Steps | string, _: Steps | string) {
    // const state = dfaBuilder.addState(false)
    if (typeof a === "string") {
        const state = dfaBuilder.addState(false);
        dfaBuilder.addEdge(parent, state, a);
        return state;
    }
    else {
        const state = addA(dfaBuilder, parent, a, _)
        // dfaBuilder.addEdge(parent, state, charMatched)
        return state;
    }
}

function addA(dfaBuilder: DFABuilder, parent: string, a:Steps | string, _: Steps | string) {
    let p = parent;
    for (const [step, aSub, bSub] of a) {
        // For some reason typescript assumes its an array of Step | string | Steps instead of tuple of Step, Steps | string, Steps | string
        //@ts-ignore
        p = step(dfaBuilder, p, aSub, bSub);
    }
    return p;
}

function addStar(dfaBuilder: DFABuilder, parent: string, a:Steps | string, _: Steps | string) {
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

function addOr(dfaBuilder: DFABuilder, parent: string, a:Steps | string, b: Steps | string) {
    const state1 = dfaBuilder.addState(false)
    const state2 = dfaBuilder.addState(false)
    const state3 = addA(dfaBuilder, state1, a, [])
    const state4 = addA(dfaBuilder, state2, b, [])
    const state5 = dfaBuilder.addState(false)
    dfaBuilder.addEdge(parent, state1, EMPTY) // do i need this?
    dfaBuilder.addEdge(parent, state2, EMPTY) // do i need this?
    // dfaBuilder.addEdge(state1, state3, charMatched)
    // dfaBuilder.addEdge(state2, state4, charMatched2)
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
function getSteps(regex:string, steps:  Steps, createFinal:boolean) {
    const len = regex.length
    for(let i = 0; i < len - 1;) {
        let curSteps: Steps = []
        let nextI = appendCurSteps(regex, i, len, curSteps)
        let next = regex[nextI]
        
        if (next != "*" && next != "|") {
            steps.push([addConcat, curSteps, ""])
        }

        else if(next == "*") {
            steps.push([addStar, curSteps, []])
            nextI++;
        }
        else if(next == "|") {
            let curStepsB: Steps = []
            nextI = appendCurSteps(regex, nextI + 1, len, curStepsB)
            steps.push([addOr, curSteps, curStepsB])
            nextI += 2;
        }
        console.log(nextI, i)
        i = nextI
    }
    if (regex[len - 1] != "*" && regex[len - 2] != "|" && regex[len - 1] != ")") {
        steps.push([addConcat, regex[len - 1], ""])
    }
    if(createFinal) {
        steps.push([addFinish, regex[len - 1], ""])
    }
}
// function traverseSteps(step: Step, parent: string, a:Steps | string, b: Steps | string){
//     let steps: Steps = []
//     let lastA: Step | undefined = undefined;
//     let lastB: Step | undefined = undefined;
//     if (typeof a !== "string") {
//         for (const [step, aSub, bSub] of a) {
//             const res = traverseSteps(step, aSub, bSub);
//             // safe to ignore as recursion must have final element as string
//             //@ts-ignore
//             lastA = res[res.length - 1][1]
//             steps.push(...res.slice(0, -1))
//         }
//     } else {
//         const st: Step = [addConcat, a, b]; 
//         lastA = [addConcat, a, b];
//     }
//     if (typeof b !== "string") {
//         for (const [step, aSub, bSub] of b) {
//             const res = traverseSteps(step, aSub, bSub);
//             // safe to ignore as recursion must have final element as string
//             //@ts-ignore
//             lastB = res[res.length - 1][2]
//             steps.push(...res.slice(0, -1))
//         }
//     } else {
//         lastB = b;
//     }
//     //@ts-ignore
//     steps.push([step, lastA, lastB])
//     return steps
// }
export function ENFABuildAnimator({regex, states, setStates}:DFABuildAnimatorParams) {
    let s: Steps = []
    getSteps(regex, s, true)
    console.log(s)
    const [steps, setSteps] = useState<Steps>(s)
    const [currentStep, setCurrentStep] = useState<number>(0)
    useEffect(() => {
        const dfaBuilder = new DFABuilder()
        let parent = dfaBuilder.states[0].value
        const stepsUntilCurrent = steps.slice(0, currentStep)
        // const s: Steps = []
        // for(const [step, aSub, bSub] of stepsUntilCurrent) {
        //     s.push(...traverseSteps(step, aSub, bSub))
        // }
        for(const [func, char, char2] of stepsUntilCurrent) {
            // console.log(char, parent)
            const newParent = func(dfaBuilder, parent, char, char2)
            parent = newParent
        }
        setStates(dfaBuilder.states)
    }, [steps, currentStep])
    
    return (
        <>
            <input type="button" onClick={() => setCurrentStep(Math.min(currentStep + 1, steps.length))}  value="Next" />
            <GraphFromDFA states={states} />
        </>
    )
}