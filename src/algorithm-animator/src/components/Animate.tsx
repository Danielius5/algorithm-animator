import { useState } from "react";
import '../globals.css';
import { State } from "../models/dfa";
import { GraphAnimator } from "./GraphAnimator";
import { AnimationState, Trace } from "./Trace";

interface AnimateParams {
    states: State[]
    sequence?: string
    id?: string
  }

export function Animate({states, sequence, id}:AnimateParams) {
    // TODO: write about this
    // use floor to only move to next letter once we have gone through both transition and state (add 0.5 on each)
    // min can be 0.5, max text length + 0.5
    // Use Math.floor for comparisons to get the current number
    const [currentLetter, setCurrentLetter] = useState<number>(0.5)
    const [currentState, setCurrentState] = useState<AnimationState>(AnimationState.IN_PROGRESS)
    const [currentStep, setCurrentStep] = useState<number>(0)
    const [text, setText] = useState<string>(sequence || "");

    // key={text} needed so we recreate graph animator on change to text
    return (
        <>
            <label htmlFor={"user-input-text-for-dfa" + (id  ?? "-g-animator")}>Sequence to match:</label> <br/>
            <input disabled={sequence !== undefined} onChange={(e) => {setText(e.target.value);  setCurrentStep(0);setCurrentLetter(0.5);}} value={text} id={"user-input-text-for-dfa" + (id  ?? "-g-animator")} />
            <br/>
            <Trace text={text} current={Math.floor(currentLetter)} log={[]} state={currentState}/>
            <GraphAnimator id={id} states={states} text={text} currentLetter={currentLetter} setCurrentLetter={setCurrentLetter} setCurrentState={setCurrentState} setCurrentStep={setCurrentStep} currentStep={currentStep} key={text}/>
        </>
    )
}
