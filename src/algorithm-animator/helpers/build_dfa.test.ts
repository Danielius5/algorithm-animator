import { expWithinParenthesis, prepareExp } from "./build_dfa"

describe("prepareExp", () => {
    it("should return empty string if given empty string", () => {
        expect(prepareExp("")).toEqual("")
    }),

    it("should append . where concatenation is implied", () => {
        expect(prepareExp("ab")).toEqual("a.b.#")
        expect(prepareExp("(a|b)*aab")).toEqual("(a|b)*.a.a.b.#")
        expect(prepareExp("a(a|b)*aab")).toEqual("a.(a|b)*.a.a.b.#")
        expect(prepareExp("(a|c)*(a|b)*aab")).toEqual("(a|c)*.(a|b)*.a.a.b.#")
    })

})

describe("expWithinParenthesis", () => {
    it("should return empty string if given empty string", () => {
        expect(prepareExp("")).toEqual("")
    }),

    it("should throw if not starts with parenthesis", () => {
        expect(() => expWithinParenthesis("")).toThrow()
        expect(() => expWithinParenthesis("a")).toThrow()
        expect(() => expWithinParenthesis(")")).toThrow()
        expect(() => expWithinParenthesis("|")).toThrow()
        expect(() => expWithinParenthesis("*")).toThrow()
    }),


    it.each([
        ["()", "", ""],
        ["(ab)", "ab", ""],
        ["(ab)c", "ab", "c"],
        ["((a))", "(a)", ""],

    ])("should return expression within parenthesis and remainder", (exp, witin_parenthesis, remainder) => {
        expect(expWithinParenthesis(exp)).toEqual([witin_parenthesis, remainder])
    })

})