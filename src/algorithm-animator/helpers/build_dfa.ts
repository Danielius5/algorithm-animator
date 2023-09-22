import { Tree } from "@/models/tree"
// (a|b)*aa
// (a|b)*a.a
// (a|b)*.a.a
let alphanumerics = new Set()
alphanumerics.add("a")
alphanumerics.add("b")
alphanumerics.add("#")

export function prepareExp(exp:string) {
    if (exp.length == 0) {
        return ""
    }

    exp = exp += "#"

    let resultant_exp = ""
    for(let i = 0; i < exp.length; i++) {
        const current = exp[i]

        resultant_exp += current
        if (i < exp.length) {
            const next = exp[i + 1]
            if (current == "*") {
                resultant_exp += "."
            }
            else if (current == ")" && alphanumerics.has(next)) {
                resultant_exp += "."
            }
            else if (alphanumerics.has(current) && alphanumerics.has(next)) {
                resultant_exp += "."
            }
            else if (next =="(") {
                resultant_exp += "."
            }
        }
    }
    return resultant_exp
}
export function buildSyntaxTree(exp: string)  {
    let tree: Tree = {value: "1"}
    return tree
}