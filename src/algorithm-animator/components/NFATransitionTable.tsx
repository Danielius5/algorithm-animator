import { State } from "@/models/dfa";
import { Dispatch, SetStateAction, useState } from "react";
import { EMPTY } from "./ENFABuildAnimator";

interface ENFAToDFAAnimatorParams {
    NFAstates: State[];
    DFAstates: State[];
    setDFAStates: Dispatch<SetStateAction<State[]>>
    setDFAComplete: Dispatch<SetStateAction<boolean>>
    language: string[]
}

function findAllReachableByChar(state: State, char: string, visited: Set<string>) {
    let set: Set<string> = new Set()
    if (visited.has(state.value)) {
        return set;
    }
    visited.add(state.value)
    for(const t of state.transitions) {
        if (t.characterMatched === char) {
            set.add(t.stateTo.value)
            if (char == EMPTY) {
                set = new Set<string>([...set, ...findAllReachableByChar(t.stateTo, char, visited)])
            }
        }
    }
    return set
}
function getInitialENFATransitionTable(language: string[], states: State[]){
    let table = [["State", ...language.map((c) => c)]]
    for(const state of states){
        const row:string[] = [state.value]
        for (const char of language) {
            const visited = new Set<string>()
            const reachable = findAllReachableByChar(state, char, visited)
            if (char == EMPTY) reachable.add(state.value)
            const res = Array.from(reachable).sort((a, b) => a.localeCompare(b));

            row.push(res.join())
        }

        table.push(row);
    }
        
    
    return table
}
export function NFATransitionTable({NFAstates, DFAstates, setDFAStates, setDFAComplete, language}:ENFAToDFAAnimatorParams) {
    // const visited:Set<string> = new Set();
    // const language = Array.from(getLanguage(NFAstates[0], visited)).sort((a, b) => b.localeCompare(a));
    // TODO: do step by step?
    const [NFATransitionTable, setNFATransitionTable] = useState<string[][]>(getInitialENFATransitionTable(language, NFAstates))
    return (
        <>
            <h3>ε-NFA transition table</h3>
            <table>
                <thead>
                    <tr>
                        {NFATransitionTable[0].map((character) => <th key={character}>{character}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {NFATransitionTable.slice(1).map((row) => {
                        return (
                            <tr key={row.join("")}>
                                {row.map((cell, index) => <td key={index}>{cell}</td>)}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </>
    )
}