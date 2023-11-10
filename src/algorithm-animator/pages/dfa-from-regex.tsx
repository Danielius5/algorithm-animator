import { DFAFromTransitionTable } from "@/components/DFAFromTransitionTable";
import { DFATransitionTable } from "@/components/DFATransitionTable";
import { ENFABuildAnimator } from "@/components/ENFABuildAnimator";
import { NFATransitionTable } from "@/components/NFATransitionTable";
import { State } from "@/models/dfa";
import { useRouter } from "next/router";
import { useState } from "react";
import '../app/globals.css'
import { Animate } from "@/components/Animate";
import { DFABuilder } from "@/helpers/dfa_builder";

function getLanguage(state: State, visited: Set<string>) {
    let set: Set<string> = new Set()

    if (visited.has(state.value)) {
        return set;
    }
    visited.add(state.value)

    for(const t of state.transitions) {
        set.add(t.characterMatched)
        
        set = new Set<string>([...set, ...getLanguage(t.stateTo, visited)])
    }
    return set;
}

export default function DFAFromRegex() {
    const router = useRouter()

    const [regex, setRegex] = useState<string>("")
    const [submit, setSubmit] = useState<boolean>(false)

    const [statesNFA, setStatesNFA] = useState<State[]>([])
    const [NFAComplete, setNFAComplete] = useState<boolean>(false)

    // const [statesDFA, setStatesDFA] = useState<State[]>([])
    // const [DFAComplete, setDFAComplete] = useState<boolean>(false)

    const [animate, setAnimate] = useState<boolean>(false)
    const dfaBuilder = new DFABuilder();

    const [NFATransitionTableState, setNFATransitionTableState] = useState<Set<string>[][]>([])
    const [DFATransitionTableState, setDFATransitionTableState] = useState<Set<string>[][]>([])

    const [statesDFA, setStatesDFA] = useState<State[]>([])

    const visited:Set<string> = new Set();
    let language:string[] = [];
    if (statesNFA.length > 0) {
        language = Array.from(getLanguage(statesNFA[0], visited)).sort((a, b) => b.localeCompare(a));
    }
    function unsubmit() {
        setStatesNFA([])
        setNFAComplete(false)
        setNFATransitionTableState([])
        setDFATransitionTableState([])
        setSubmit(false)
    }
    return (
        <>
        {!animate  || dfaBuilder.states.length == 0 ? (
            <>
                <input onChange={(e) => {setRegex(e.target.value); unsubmit()}} value={regex}/>
                <input type="button" onClick={() => setSubmit(true)} value="build dfa" />
                {submit && (
                    <>
                        <h2>Regex to ε-NFA</h2>
                        <ENFABuildAnimator regex={regex} states={statesNFA} setStates={setStatesNFA} NFAComplete={NFAComplete} setNFAComplete={setNFAComplete} />
                        {NFAComplete && (
                            <>
                                <h2>ε-NFA to DFA</h2>
                                <NFATransitionTable NFAstates={statesNFA} language={language} NFATransitionTable={NFATransitionTableState} setNFATransitionTable={setNFATransitionTableState}/>
                                {NFATransitionTable.length > 0 && (
                                    <>
                                        <DFATransitionTable language={language} NFATransitionTable={NFATransitionTableState} setDFATransitionTable={setDFATransitionTableState} DFATransitionTable={DFATransitionTableState}/>
                                        {DFATransitionTable.length > 0 && (
                                            <DFAFromTransitionTable DFATransitionTable={DFATransitionTableState} NFATransitionTable={NFATransitionTableState} language={language} dfaBuilder={dfaBuilder} key={Math.random()}/>
                                        )}
                                        <input type="button" onClick={() => setAnimate(true)} value = "animate" />
                                    </>
                                )}
                            </>
                        )}
                    </>
                )}
            </>
        ) : (
            <Animate states={dfaBuilder.states} goBack={() => setAnimate(false)}/>
        )}
        </>
    )

} 