import { useState } from "react";
import '../globals.css';
import { State } from "../models/dfa";
import { GraphAnimator } from "./GraphAnimator";
import { Trace } from "./Trace";

interface AnimateParams {
    states: State[]
    goBack: ()=> void
  }

export function Animate({states, goBack}:AnimateParams) {
    // TODO: write about this
    // use floor to only move to next letter once we have gone through both transition and state (add 0.5 on each)
    // min can be 0.5, max text length + 0.5
    // Use Math.floor for comparisons to get the current number
    const [currentLetter, setCurrentLetter] = useState<number>(0.5)
    const [currentState, setCurrentState] = useState<string>("In Progress")
    const [currentStep, setCurrentStep] = useState<number>(0)
    const [text, setText] = useState<string>("");
    // key={text} needed so we recreate graph animator on change to text
    return (
        <>
            <input onChange={(e) => {setText(e.target.value);  setCurrentStep(0);setCurrentLetter(0.5);}} value={text} id="user-input-text-for-dfa"/>
            <Trace text={text} current={Math.floor(currentLetter)} log={[]} state={currentState}/>
            <GraphAnimator states={states} text={text} currentLetter={currentLetter} setCurrentLetter={setCurrentLetter} setCurrentState={setCurrentState} setCurrentStep={setCurrentStep} currentStep={currentStep} key={text}/>

<br/><br/>
            <input type="button" onClick={() => goBack()}  value="Go back to editing" />
            </>
    )
}
