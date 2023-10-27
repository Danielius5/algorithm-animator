import { Dispatch, SetStateAction, useEffect } from "react";
import { EMPTY } from "./ENFABuildAnimator";

interface DFATransitionTableParams {
    NFATransitionTable: Set<string>[][];
    DFATransitionTable: Set<string>[][];
    setDFATransitionTable: Dispatch<SetStateAction<Set<string>[][]>>
    language: string[]
}
//TODO: extract helpers
// Taken from here and modified: https://stackoverflow.com/a/44827922
function areSetsEqual(a:Set<unknown>, b:Set<unknown>) {
    return a.size === b.size && [...a].every(value => b.has(value));
}

function isExistingState(a: Set<string>, states: Set<string>[]){
    return states.some((state) => areSetsEqual(a, state))
}

function getInitialDFATransitionTable(language: string[], NFATransitionTable: Set<string>[][]) {
    let table:Set<string>[][] = [[new Set(["State"]), ...language.map((c) => new Set(c))]]
    const languagePrefix = 2; // first column is state, second is epsillon in NFA table
    const eClosureColumn = 1;
    const verticalPrefix = 1; // skip first row with headers
    const baseState = NFATransitionTable[verticalPrefix][eClosureColumn]
    let dfaStates: Set<string>[] = [baseState]
    let queue: Set<string>[] = [baseState]
    while (queue.length > 0) {
        const reachableStates = queue[0]
        queue = queue.slice(1)
        if (reachableStates === undefined) {
            throw new Error("error")
        }

        let row = [reachableStates]
        language.forEach((character, ind) => {
            let characterSet = new Set<string>
            let result = new Set<string>
            for (const s of reachableStates) {
                let sRow = parseInt(s.substring(1))
                characterSet = new Set([...characterSet, ...NFATransitionTable[sRow][languagePrefix + ind]])
            }
            for (const s of characterSet) {
                let sRow = parseInt(s.substring(1))
                result = new Set([...characterSet, ...NFATransitionTable[sRow][eClosureColumn]])
            }
            row.push(result)
            if(!isExistingState(result, dfaStates)) {
                dfaStates.push(result)
                queue.push(result)
            }
        })
        table.push(row)
    }
    return table
}
export function DFATransitionTable({language: langWithEpsillon, NFATransitionTable, DFATransitionTable: DFATransitionTableState, setDFATransitionTable: setDFATransitionTableState}:DFATransitionTableParams) {
    const language = langWithEpsillon.filter((c) => c!= EMPTY)
    if (NFATransitionTable[1] === undefined) {
        return
    }
    useEffect(() => {
        setDFATransitionTableState(getInitialDFATransitionTable(language, NFATransitionTable))
    }, [])
    return (
        <>
            <h3>DFA transition table</h3>
            {DFATransitionTableState.length > 0 &&
                <table>
                    <thead>
                        <tr>
                            {DFATransitionTableState[0].map((character) => <th key={[...character].join()}>{[...character].join()}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {DFATransitionTableState.slice(1).map((row, ind) => {
                            return (
                                <tr key={ind}>
                                    {row.map((cell, index) => {
                                        return (
                                            <>
                                                {[...cell].length == 0 ? 
                                                (
                                                    <td key={index}>∅</td>
                                                )
                                                : 
                                
                                                (
                                                    <td key={index}>
                                                        {[...cell].sort((a,b) => a.localeCompare(b)).join()}
                                                     </td>
                                                )}
                                            </>
                                        )
                                        })}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            }
        </>
    )
}

