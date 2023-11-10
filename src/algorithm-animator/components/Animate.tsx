import { State } from "@/models/dfa";
import { Dispatch, SetStateAction, useState } from "react";
import { GraphAnimator } from "./GraphAnimator";
import { Trace } from "./Trace";
import '../app/globals.css'

interface AnimateParams {
    states: State[]
    goBack: ()=> void
  }

export function Animate({states, goBack}:AnimateParams) {
    const [currentLetter, setCurrentLetter] = useState<number>(0)
    const [currentState, setCurrentState] = useState<string>("In Progress")
    const [text, setText] = useState<string>("");

    return (
        <>
            <input onChange={(e) => {setText(e.target.value); setCurrentLetter(0)}} value={text}/>
            <Trace text={text} current={currentLetter} log={[]} state={currentState} key={Math.random()}/>
            {text.length > 0 && (
                <GraphAnimator states={states} text={text} currentLetter={currentLetter} setCurrentLetter={setCurrentLetter} setCurrentState={setCurrentState}/>
            )}

<br/><br/>
            <input type="button" onClick={() => goBack()}  value="Go back to editing" />
            </>
    )
}
