import { prepareExp } from "./build_dfa"

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