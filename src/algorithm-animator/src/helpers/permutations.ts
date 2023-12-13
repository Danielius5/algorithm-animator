export function getAllPermutations(map: [string, string[]][], index: number, parentPermutations: [string, string][], result: [string, string][][]) {
    if (index > map.length - 1) {
        if (parentPermutations.length > 0) {
            // push to result but create a new copy of everything
            const copy: [string, string][] = []
            
            for(const [letter, state] of parentPermutations) {
                copy.push([letter, state])
            }
            result.push(copy)
        }
        return
    }

    const [letter, states] = map[index]

    for (const state of states) {
        parentPermutations.push([letter, state])
        getAllPermutations(map, index + 1, parentPermutations, result)
        parentPermutations.pop()
    }
}