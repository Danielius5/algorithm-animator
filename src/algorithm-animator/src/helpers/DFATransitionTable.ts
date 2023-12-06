// Taken from here and modified: https://stackoverflow.com/a/44827922
function areSetsEqual(a:Set<unknown>, b:Set<unknown>) {
    return a.size === b.size && [...a].every(value => b.has(value));
}

function isExistingState(a: Set<string>, states: Set<string>[]){
    return states.some((state) => areSetsEqual(a, state))
}

export function getInitialDFATransitionTable(language: string[], NFATransitionTable: Set<string>[][]) {
    const table:Set<string>[][] = [[new Set(["State"]), ...language.map((c) => new Set(c))]]
    const languagePrefix = 2; // first column is state, second is epsillon in NFA table
    const eClosureColumn = 1;
    const verticalPrefix = 1; // skip first row with headers
    const baseState = NFATransitionTable[verticalPrefix][eClosureColumn]
    const dfaStates: Set<string>[] = [baseState]
    let queue: Set<string>[] = [baseState]
    while (queue.length > 0) {
        const reachableStates = queue[0]
        queue = queue.slice(1)
        if (reachableStates === undefined) {
            throw new Error("error")
        }

        const row = [reachableStates]
        language.forEach((character, ind) => {
            let characterSet = new Set<string>
            let result = new Set<string>
            for (const s of reachableStates) {
                const sRow = parseInt(s.substring(1))
                characterSet = new Set([...characterSet, ...NFATransitionTable[sRow][languagePrefix + ind]])
            }
            for (const s of characterSet) {
                const sRow = parseInt(s.substring(1))
                result = new Set([...result, ...characterSet, ...NFATransitionTable[sRow][eClosureColumn]])
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