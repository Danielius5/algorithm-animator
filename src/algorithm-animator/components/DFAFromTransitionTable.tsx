import { DFABuilder } from "@/helpers/dfa_builder";
import { EMPTY } from "./ENFABuildAnimator";
import { GraphFromDFA } from "./GraphFromDFA";

interface DFAFromTransitionTableParams {
    DFATransitionTable: Set<string>[][];
    NFATransitionTable: Set<string>[][];
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
    dfaBuilder.addState(false)
    
    transitions.forEach(([char, fromInd, toInd]) => {
        toInd = Math.min(toInd + 2, states.length + 2)
        fromInd = Math.min(fromInd + 2, states.length + 2)
        dfaBuilder.addEdge(`S${fromInd}`, `S${toInd}`, char)
    })
    language.forEach((character,) => {
        dfaBuilder.addEdge(`S${states.length + 2}`, `S${states.length + 2}`, character)
    })
    dfaBuilder.addEdge("S1", "S2", EMPTY)
}
export function DFAFromTransitionTable({language: langWithEpsillon, DFATransitionTable, NFATransitionTable}: DFAFromTransitionTableParams) {
    if (DFATransitionTable[1] === undefined) {
        return
    }
    const language = langWithEpsillon.filter((c) => c!= EMPTY)
    const dfaBuilder = new DFABuilder()
    const finalState = [...NFATransitionTable[NFATransitionTable.length - 1][0]][0]
    buildDFA(dfaBuilder, DFATransitionTable, language, finalState)
    return (
        <GraphFromDFA states={dfaBuilder.states} />
    )
}