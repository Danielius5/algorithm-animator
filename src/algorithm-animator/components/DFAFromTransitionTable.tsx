import { DFABuilder } from "@/helpers/dfa_builder";
import { EMPTY } from "./ENFABuildAnimator";
import { GraphFromDFA } from "./GraphFromDFA";
import { Dispatch, SetStateAction, useEffect } from "react";
import { State } from "@/models/dfa";

interface DFAFromTransitionTableParams {
    DFATransitionTable: Set<string>[][];
    NFATransitionTable: Set<string>[][];
    setStates: Dispatch<SetStateAction<State[]>>
    states: State[]
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

function findState(a: Set<string>, states: Set<string>[]) {
    let foundInd = -1
    states.forEach((state, ind) => {
        if (areSetsEqual(a, state)) {
            foundInd = ind
        }
    })
    if (foundInd == -1) throw new Error("Error")
    return foundInd
}
function isFailingState(state: Set<string>) {
    return [...state].length == 0
}
const INF = 100000;
function buildDFA(dfaBuilder: DFABuilder, DFATransitionTable: Set<string>[][], language: string[], finalState: string) {
    const baseState = DFATransitionTable[1][0]
    let states: Set<string>[] = [baseState]
    let isFinalState: boolean[] = [baseState.has(finalState)]
    let transitions:[string, number, number][] = []

    let table = DFATransitionTable.slice(1)
    table = table.filter((row) => !isFailingState(row[0]))

    // TODO: write about this
    // eg: not reachable for aa* so not needed, but reachable for a|b

    let failingStateReachable = false
    table.forEach((row, rowInd) => { //row[ind] = states[ind]

        row.forEach((cell, ind) => { 
            // skip states part, only need transitions
            if(ind == 0) return;

            if(!isExistingState(cell, states)) {
                if ([...cell].length != 0) {
                    states.push(cell)
                    isFinalState.push(cell.has(finalState))
                }
            }

            if (isFailingState(cell)) {
                failingStateReachable = true
                transitions.push([language[ind - 1], rowInd, INF])
            }
            else {
                transitions.push([language[ind - 1], rowInd, findState(cell, states)])
            }
        })
    })

    states.forEach((state, ind) => {
        dfaBuilder.addState(isFinalState[ind])
    })
    // dfaBuilder.addEdge("Start", "S1", undefined)

    if (failingStateReachable) {
        dfaBuilder.addState(false)
        language.forEach((character,) => {
            dfaBuilder.addEdge(`S${states.length + 1}`, `S${states.length + 1}`, character)
        })
    }
    transitions.forEach(([char, fromInd, toInd]) => {
        toInd = Math.min(toInd + 1, states.length + 1)
        fromInd = Math.min(fromInd + 1, states.length + 1)
        dfaBuilder.addEdge(`S${fromInd}`, `S${toInd}`, char)
    })

    // dfaBuilder.addEdge("START", "S1", EMPTY)
}
export function DFAFromTransitionTable({language: langWithEpsillon, DFATransitionTable, NFATransitionTable, setStates, states}: DFAFromTransitionTableParams) {
    if (DFATransitionTable[1] === undefined) {
        return
    }
    useEffect(() => {
        if (states.length == 0) {
            const language = langWithEpsillon.filter((c) => c!= EMPTY)
            const dfaBuilder = new DFABuilder()
            const finalState = [...NFATransitionTable[NFATransitionTable.length - 1][0]][0]
            buildDFA(dfaBuilder, DFATransitionTable, language, finalState)
            setStates(dfaBuilder.states)
        }
    });
    return (
        <GraphFromDFA states={states} />
    )
}