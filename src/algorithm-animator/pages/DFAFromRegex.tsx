import { ENFABuildAnimator } from "@/components/DFABuildAnimator";
import { State } from "@/models/dfa";
import { useState } from "react";


export function DFAFromRegex () {
    const [statesNFA, setStatesNFA] = useState<State[]>([])
    return <ENFABuildAnimator regex="a*" states={statesNFA} setStates={setStatesNFA}/>
} 