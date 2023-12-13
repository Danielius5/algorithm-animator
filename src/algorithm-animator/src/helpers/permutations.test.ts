import { getAllPermutations } from "./permutations"

describe('Test Permutations', () => {
    it('Deals with empty case', () => {
        const result: [string, string][][] = [];
        getAllPermutations([],0, [], result);

        expect(result).toHaveLength(0);
    })

    it('Deals permutations of one letter', () => {
        const result: [string, string][][] = [];
        getAllPermutations([["a",["S1", "S2"]]],0, [], result);

        expect(result).toHaveLength(2);
        expect(result).toEqual([[["a", "S1"]], [["a", "S2"]]])
    })

    it('Deals with basic permutations of length 1', () => {
        const result: [string, string][][] = [];
        getAllPermutations([["a",["S1"]], ["b", ["S2"]]],0, [], result);

        expect(result).toHaveLength(1);
        expect(result).toEqual([[["a", "S1"], ["b", "S2"]]])
    })

    it('Deals with more complex permutations', () => {
        const result: [string, string][][] = [];
        getAllPermutations([["a",["S1", "S2"]], ["b", ["S3", "S4"]]],0, [], result);

        expect(result).toHaveLength(4);
        expect(result).toEqual([[["a", "S1"], ["b", "S3"]], [["a", "S1"], ["b", "S4"]], [["a", "S2"], ["b", "S3"]], [["a", "S2"], ["b", "S4"]]])
    })

})