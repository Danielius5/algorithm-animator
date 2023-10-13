import { State, Step, instanceOfState } from "@/models/dfa";
import { GraphFromDFA } from "./GraphFromDFA";
import { Dispatch, SetStateAction, useState } from "react";

interface GraphAnimatorParams {
    states: State[]
    text?: string;
    setCurrentLetter: Dispatch<SetStateAction<number>>
    setCurrentState: Dispatch<SetStateAction<string>>
  }

function recursiveBuildSteps(state: State, text: string, steps: Step[]) {
    if (text.length == 0) {
        return;
    }
    const characterMatched = text[0]
    const remainder = text.substring(1)
    const transition = state.transitions.find((tr) => tr.characterMatched == characterMatched)
    if (!transition) {
        return;
    }
    steps.push(transition)
    steps.push(transition.stateTo)
    recursiveBuildSteps(transition.stateTo, remainder, steps)
}
function getSteps(states: State[], text: string) {
    let steps: Step[] = [states[0]]
    recursiveBuildSteps(states[0], text, steps);

    return steps;
}
function setActiveStep(state: State, step: Step, visited: Set<Step>) {
    if (visited.has(state)) {
        return;
    }
    state.active = step == state
    visited.add(state)
    for (const transition of state.transitions) {
        transition.active = step == transition;
        setActiveStep(transition.stateTo, step, visited)
    }
}
export function GraphAnimator({states, text, setCurrentLetter, setCurrentState}:GraphAnimatorParams) {
    const [currentStep, setCurrentStep] = useState<number>(0)

    let steps: Step[] = []
    let visited: Set<Step> = new Set()
    if (text) {
        steps = getSteps(states, text);
    }
    setActiveStep(states[0], steps[currentStep], visited);
    setCurrentLetter(Math.max(currentStep - 1 - visited.keys.length,0));

    if (currentStep == steps.length) {
        const finalStep = steps[currentStep - 1];
        // @ts-ignore
        console.log(finalStep.isAccepted);
        // @ts-ignore
        if(finalStep.isAccepted){
            setCurrentState("Accepted")
        }
        else {setCurrentState("Rejected")}
        // if (typeof finalStep === "State")
    }
    else {
        setCurrentState("In Progress")
    }
    return (
        <div>
            <GraphFromDFA states={states} />
            <input type="button" onClick={() => setCurrentStep(Math.min(currentStep + 1, steps.length))}  value="Next" />
            <input type="button" onClick={() => setCurrentStep(Math.max(currentStep - 1, 0))}  value="Back" />
        </div>
    )
}
