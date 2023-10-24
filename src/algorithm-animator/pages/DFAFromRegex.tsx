import { ENFABuildAnimator } from "@/components/ENFABuildAnimator";
import { NFATransitionTable } from "@/components/NFATransitionTable";
import { State } from "@/models/dfa";
import { useState } from "react";

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

export function DFAFromRegex() {
    const [statesNFA, setStatesNFA] = useState<State[]>([])
    const [NFAComplete, setNFAComplete] = useState<boolean>(false)

    const [statesDFA, setStatesDFA] = useState<State[]>([])
    const [DFAComplete, setDFAComplete] = useState<boolean>(false)

    const visited:Set<string> = new Set();
    let language:string[] = [];
    if (statesNFA.length > 0) {
        console.log(statesNFA)
        language = Array.from(getLanguage(statesNFA[0], visited)).sort((a, b) => b.localeCompare(a));
    }
    return (
        <>
            <h2>Regex to ε-NFA</h2>
            <ENFABuildAnimator regex="a*" states={statesNFA} setStates={setStatesNFA} NFAComplete={NFAComplete} setNFAComplete={setNFAComplete} />
            {NFAComplete && (
                <>
                    <h2>ε-NFA to DFA</h2>
                    <NFATransitionTable NFAstates={statesNFA} DFAstates={statesDFA} setDFAStates={setStatesDFA} setDFAComplete={setDFAComplete} language={language} />
                </>
            )}
        </>
    )

} 