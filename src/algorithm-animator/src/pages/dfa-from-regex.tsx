import { useState } from "react";
import { Collapse } from "react-bootstrap";
import { Animate } from "../components/Animate";
import { CollapseButton } from "../components/CollapseButton";
import { DFAFromTransitionTable } from "../components/DFAFromTransitionTable";
import { DFATransitionTable } from "../components/DFATransitionTable";
import { EMPTY, ENFABuildAnimator } from "../components/ENFABuildAnimator";
import { NFATransitionTable } from "../components/NFATransitionTable";
import { MainNavbar } from "../components/Navbar";
import '../globals.css';
import { getInitialDFATransitionTable } from "../helpers/DFATransitionTable";
import { getInitialENFATransitionTable } from "../helpers/NFATransitionTable";
import { State } from "../models/dfa";

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

export default function DFAFromRegex() {

    const [regex, setRegex] = useState<string>("")
    const [submit, setSubmit] = useState<boolean>(false)

    const [statesNFA, setStatesNFA] = useState<State[]>([])
    const [NFAComplete, setNFAComplete] = useState<boolean>(false)

    // const [statesDFA, setStatesDFA] = useState<State[]>([])
    // const [DFAComplete, setDFAComplete] = useState<boolean>(false)

    const [animate, setAnimate] = useState<boolean>(false)

    const [statesDFA, setStatesDFA] = useState<State[]>([])


    const [visibleENFA, setVisibleENFA] = useState<boolean>(false);
    const [visibleENFATransitionTable, setVisibleENFATransitionTable] = useState<boolean>(false);
    const [visibleDFATransitionTable, setVisibleDFATransitionTable] = useState<boolean>(false);



    const visited:Set<string> = new Set();

    let language:string[] = [];
    if (statesNFA.length > 0) {
        language = Array.from(getLanguage(statesNFA[0], visited)).sort((a, b) => b.localeCompare(a));
    }

    const languageNoEpsilon = language.filter((c) => c!= EMPTY)

    let NFATransitionTableData: Set<string>[][] = []
    let DFATransitionTableData: Set<string>[][] = []

    NFATransitionTableData = getInitialENFATransitionTable(language, statesNFA)

    if (NFATransitionTableData.length > 0 && languageNoEpsilon.length > 0) {
        DFATransitionTableData = getInitialDFATransitionTable(languageNoEpsilon, NFATransitionTableData)
    }

    function unsubmit() {
        setStatesNFA([])
        setNFAComplete(false)
        setStatesDFA([])
        setSubmit(false)
    }
    return (
        <>
        <MainNavbar />
        <br/>
        {!animate ? (
            <>
                <input onChange={(e) => {setRegex(e.target.value); unsubmit()}} value={regex}/>
                <input type="button" onClick={() => setSubmit(true)} value="build dfa" />
                {submit && (
                    <>
                        <h2>
                            Regex to ε-NFA 
                            <CollapseButton
                                setIsVisible={setVisibleENFA}
                                ariaControls="collapse-enfa"
                                isVisible={visibleENFA}
                            />
                        </h2>
                        <Collapse in={visibleENFA}>
                            <div id="collapse-enfa">
                                <ENFABuildAnimator regex={regex} states={statesNFA} setStates={setStatesNFA} NFAComplete={NFAComplete} setNFAComplete={setNFAComplete} />
                            </div>
                        </Collapse>
                        {NFAComplete && (
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
                                                <DFAFromTransitionTable DFATransitionTable={DFATransitionTableData} NFATransitionTable={NFATransitionTableData} language={language} setStates={setStatesDFA} states={statesDFA}/>
                                            </>
                                        )}
                                        <input type="button" onClick={() => setAnimate(true)} value = "animate" />
                                    </>
                                )}
                            </>
                        )}
                    </>
                )}
            </>
        ) : (
            <Animate states={statesDFA} goBack={() => setAnimate(false)}/>
        )}
        </>
    )

} 