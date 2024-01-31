import { useState } from "react";
import { State } from "../models/dfa";
import { getInitialENFATransitionTable } from "../helpers/NFATransitionTable";
import { getInitialDFATransitionTable } from "../helpers/DFATransitionTable";
import { EMPTY } from "./ENFABuildAnimator";
import { CollapseButton } from "./CollapseButton";
import { Collapse } from "react-bootstrap";
import { NFATransitionTable } from "./NFATransitionTable";
import { DFATransitionTable } from "./DFATransitionTable";
import { DFAFromTransitionTable } from "./DFAFromTransitionTable";

function getLanguage(state: State, visited: Set<string>) {
    let set: Set<string> = new Set()

    if (visited.has(state.value)) {
        return set;
    }
    visited.add(state.value)

    for(const t of state.transitions) {
        if (t.characterMatched) {
            set.add(t.characterMatched)
        }
        
        set = new Set<string>([...set, ...getLanguage(t.stateTo, visited)])
    }
    return set;
}

interface DFAFromENFAProps {
    statesNFA: State[]
    setAnimate: React.Dispatch<React.SetStateAction<boolean>>
    statesDFA: State[]
    setStatesDFA: React.Dispatch<React.SetStateAction<State[]>>
}
export default function DFAFromENFA({statesNFA, setAnimate, statesDFA, setStatesDFA} : DFAFromENFAProps) {


    const [visibleENFATransitionTable, setVisibleENFATransitionTable] = useState<boolean>(false);
    const [visibleDFATransitionTable, setVisibleDFATransitionTable] = useState<boolean>(false);

    const visited:Set<string> = new Set();

    let language:string[] = [];
    if (statesNFA.length > 0) {
        language = Array.from(getLanguage(statesNFA[0], visited)).sort((a, b) => b.localeCompare(a));
    }

    const languageNoEpsilon = language.filter((c) => c!= EMPTY) // TODO export EMPTY to constants to avoid mess

    let NFATransitionTableData: Set<string>[][] = []
    let DFATransitionTableData: Set<string>[][] = []

    NFATransitionTableData = getInitialENFATransitionTable(language, statesNFA)

    if (NFATransitionTableData.length > 0 && languageNoEpsilon.length > 0) {
        DFATransitionTableData = getInitialDFATransitionTable(languageNoEpsilon, NFATransitionTableData)
    }

    return (
        <>
            <h2>
                ε-NFA transition table
                <CollapseButton
                    setIsVisible={setVisibleENFATransitionTable}
                    ariaControls="collapse-enfa-transition-table"
                    isVisible={visibleENFATransitionTable}
                />
            </h2>

            <Collapse in={visibleENFATransitionTable}>
                <div id="collapse-enfa-transition-table">
                    <NFATransitionTable NFAstates={statesNFA} language={language} NFATransitionTable={NFATransitionTableData}/>
                </div>
            </Collapse>

            {NFATransitionTable.length > 0 && (
                <>
                    <h2>
                        DFA transition table
                        <CollapseButton
                            setIsVisible={setVisibleDFATransitionTable}
                            ariaControls="collapse-dfa-transition-table"
                            isVisible={visibleDFATransitionTable}
                        />
                    </h2>
                    <Collapse in={visibleDFATransitionTable}>
                        <div id="collapse-DFA-transition-table">
                            <DFATransitionTable language={language} NFATransitionTable={NFATransitionTableData} DFATransitionTable={DFATransitionTableData}/>
                        </div>
                    </Collapse>
                    {DFATransitionTable.length > 0 && (
                        <>
                            <h2>Resultant DFA</h2>
                            <DFAFromTransitionTable DFATransitionTable={DFATransitionTableData} NFATransitionTable={NFATransitionTableData} language={language} setStates={setStatesDFA} states={statesDFA} nfaStates={statesNFA}/>
                        </>
                    )}
                    <input type="button" onClick={() => setAnimate(true)} value = "Animate" id="animate-dfa-from-regex-button" />
                </>
            )}
        </>
    )
}
