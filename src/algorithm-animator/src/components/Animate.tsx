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
    const [currentLetter, setCurrentLetter] = useState<number>(0.5)
    const [currentState, setCurrentState] = useState<AnimationState>(AnimationState.IN_PROGRESS)
    const [currentStep, setCurrentStep] = useState<number>(0)
    const [text, setText] = useState<string>(sequence || "");

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
