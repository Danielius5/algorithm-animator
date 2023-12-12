import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { State, Step } from "../models/dfa";
import { GraphFromDFA } from "./GraphFromDFA";

interface GraphAnimatorParams {
    states: State[]
    text?: string;
    currentLetter: number;
    currentStep: number;
    setCurrentLetter: Dispatch<SetStateAction<number>>
    setCurrentState: Dispatch<SetStateAction<string>>
    setCurrentStep: Dispatch<SetStateAction<number>>
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
    const steps: Step[] = [states[0]]
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
export function GraphAnimator({states, text, setCurrentLetter, setCurrentState, currentLetter, currentStep, setCurrentStep}:GraphAnimatorParams) {
    
    const [goForward, setGoForward] = useState<boolean | undefined >(undefined);
    let steps: Step[] = []
    const visited: Set<Step> = new Set()
    useEffect(() => {
        setGoForward(undefined);
    })
    useEffect(() => {
        let nextLetterState = 0.5;
        if (text) {
            if(goForward === true) {
                nextLetterState =Math.min(currentLetter + 0.5, text.length + 0.5);
            } else if(goForward === false) {
                nextLetterState = Math.max(currentLetter - 0.5, 0.5);
            }
        }
        if (currentStep == steps.length - 1) {
            const finalStep = steps[currentStep];
            // @ts-expect-error cannot avoid guessing which type of step this is - transition or state
            if(finalStep.isAccepted && Math.floor(nextLetterState) == text.length){
                setCurrentState("Accepted")
            }
            else {setCurrentState("Rejected")}
            // if (typeof finalStep === "State")
        }
        else {
            setCurrentState("In Progress")
        }
        setCurrentLetter(nextLetterState);
    }, [currentStep]);
    
    if (text) {
        steps = getSteps(states, text);
        if (steps.length == 1) {
            setCurrentState("Rejected")
        }
    }
    setActiveStep(states[0], steps[currentStep], visited);
    

    return (
        <div>
            <GraphFromDFA states={states} />
            <input type="button" onClick={() => {setCurrentStep(Math.min(currentStep + 1, steps.length - 1)); setGoForward(true)}}  value="Next" id="animate-button-next" />
            <input type="button" onClick={() => {setCurrentStep(Math.max(currentStep - 1, 0)); setGoForward(false)}}  value="Back" id="animate-button-back" />

        </div>
    )
}
