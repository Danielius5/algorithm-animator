import { EMPTY } from "../components/ENFABuildAnimator";
import { State } from "../models/dfa";


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
export function getInitialENFATransitionTable(language: string[], states: State[]){
    const table: Set<string>[][] = [[new Set(["State"]), ...language.map((c) => new Set(c))]]
    for(const state of states){
        // if (state.value === "Start") continue;
        const row:Set<string>[] = [new Set([state.value])]
        for (const char of language) {
            const visited = new Set<string>()
            const reachable = findAllReachableByChar(state, char, visited)
            if (char == EMPTY) reachable.add(state.value)
            // const res = Array.from(reachable).sort((a, b) => a.localeCompare(b));

            row.push(reachable)
        }

        table.push(row);
    }
        
    
    return table
}