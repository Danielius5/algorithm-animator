import { Tree } from "@/models/tree"

let alphanumerics = new Set()
alphanumerics.add("a")
alphanumerics.add("b")
alphanumerics.add("#")

export function prepareExp(exp:string) {
    if (exp.length == 0) {
        return ""
    }

    exp = exp + "#"

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
export function expWithinParenthesis(exp: string) {
    if (exp[0] != "(") {
        throw new Error("failed to parse regex")
    }
    let pos = 1;
    let sum = 1;

    for (let i = pos; i < exp.length; i++) {
        if (exp[i] == ")") sum -=1;
        if (exp[i] == "(") sum +=1;
        if (sum == 0) {
            pos = i;
            break;
        }
    }
    if (sum != 0) {
        throw new Error("failed to parse regex")
    }
    return [exp.substring(1,pos), exp.substring(pos + 1)]
}
export function buildSyntaxTree(exp: string)  {
    let tree: Tree = {value: "1"}
    return tree
}