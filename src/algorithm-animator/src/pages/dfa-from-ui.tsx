import { useEffect, useRef, useState } from "react";
import { Animate } from "../components/Animate";
import { EMPTY } from "../components/ENFABuildAnimator";
import { GraphFromDFA } from "../components/GraphFromDFA";
import { MainNavbar } from "../components/Navbar";
import { FSABuilder } from "../helpers/FSABuilder";
import { State } from "../models/dfa";
import { getAllPermutations } from "../helpers/permutations";
import DFAFromENFA from "../components/DFAFromENFA";

// Idea of iterating over parent elements taken and modified from here: https://stackoverflow.com/a/8729274
function getParentElements(element: HTMLElement) {
    let parent: HTMLElement | null = element;
    const allParents = [];
    while (parent) {
        allParents.push(parent);

        parent = parent.parentElement;
    }
    return allParents
}

function findMermaidNodeObject(elements: HTMLElement[]) {
    return elements.find((element) => /flowchart-S[0-9]+-[0-9]+/.test(element.id))
}
function extractStateFromElementId(id: string) {
    return id.match(/S[0-9]+/)![0]
}
export default function DFAFromUI() {
    const [selectedStates, setSelectedStates] = useState<string[]>([])

    function handleClicksOnFSA(event: Event) {
        if (isReadOnlyRef.current) return;

        //@ts-expect-error does not like types..
        const element: HTMLElement = event.target

        const parents = getParentElements(element)
        const mermaidObj = findMermaidNodeObject(parents)
        const isElementCanvas = element.classList.contains("mermaid") && element.nodeName === "PRE"
        if (isElementCanvas) {
            event.preventDefault();
            const state = dfaBuilder.current.addState(false)
            setStates((currentStates) => [...currentStates, state])
            return
        }
        if (mermaidObj) {
            event.preventDefault();
            const state = mermaidObj.id.match(/S[0-9]+/)![0]
            setSelectedStates((currentSelectedStates) => [...currentSelectedStates, state])
            return
        }

    }

    function handleStateDeletions(event: Event) {
        if (isReadOnlyRef.current) return;

        //@ts-expect-error does not like types..
        const element: HTMLElement = event.target

        const parents = getParentElements(element)
        const mermaidObj = findMermaidNodeObject(parents)

        if (mermaidObj) {
            event.preventDefault()
            const stateToDelete = extractStateFromElementId(mermaidObj.id)
            deleteState(stateToDelete)
        }
        else {
            event.preventDefault();
            const state = dfaBuilder.current.addState(true)
            setStates((currentStates) => [...currentStates, state])
        }
    }

    useEffect(() => {
        window.addEventListener('click', handleClicksOnFSA);
        document.addEventListener('contextmenu', handleStateDeletions)

        return () => {

            window.removeEventListener('click', handleClicksOnFSA);
            document.removeEventListener('contextmenu', handleStateDeletions)
        }
    }, []);


    const [isAcceptedState, setIsAcceptedState] = useState<boolean>(false);
    const [isReadOnly, _setIsReadOnly] = useState<boolean>(false);
    const isReadOnlyRef = useRef(isReadOnly);

    const setIsReadOnly = (value:boolean) => {
        isReadOnlyRef.current = value
        _setIsReadOnly(value)
    } 

    const [edgeFrom, setEdgeFrom] = useState<string>("");
    const [edgeTo, setEdgeTo] = useState<string>("");
    const [charToMatch, setCharToMatch] = useState<string>("");

    const [states, setStates] = useState<string[]>([])
    const [edges, setEdges] = useState<[string, string, string][]>([])

    useEffect(() => {
        if (selectedStates.length == 2) {
            try {
                const charMatched = prompt("Desired character: ");
                if (charMatched && charMatched.length==1) {
                    const edgeFrom = selectedStates[0]
                    const edgeTo = selectedStates[1]

                    dfaBuilder.current.addEdge(edgeFrom, edgeTo, charMatched)
                    setEdges([...edges, [edgeFrom, edgeTo, charMatched]])
                }
                else if (!charMatched || charMatched.length!=1) {
                    alert("Character matched needs to be of length 1!")
                }
            } catch (err) {
                // ignore errors from creating edge, just stop next steps
            }
            setSelectedStates([])
        }

    }, [selectedStates]);

    const [isValidDFA, setIsValidDFA] = useState<boolean | undefined>(undefined)
    const [showButtonNFAToENFA, setShowButtonNFAToENFA] = useState<boolean>(true)
    const [buildDFA, setBuildDFA] = useState<boolean>(false)
    const [statesDFA, setStatesDFA] = useState<State[]>([])


    const [animate, setAnimate] = useState<boolean>(false)

    const dfaBuilder = useRef<FSABuilder>(new FSABuilder())

    function cleanForm() {
        setCharToMatch("");
    }
    function addEdge() {
        try {
            dfaBuilder.current.addEdge(edgeFrom, edgeTo, charToMatch);
            setEdges([...edges, [edgeFrom, edgeTo, charToMatch]])
            cleanForm();
        } catch (err) {
            // ignore errors from creating edge, just stop next steps
        }
    }
    function addState() {
        const value = dfaBuilder.current.addState(isAcceptedState);
        setStates([...states, value])
        cleanForm();
    }
    function deleteEdge(from: string, to: string, characterMatched: string, el: React.MouseEvent<HTMLElement, MouseEvent>) {
        el.preventDefault();
        dfaBuilder.current.deleteEdge(from, to, characterMatched);
        setEdges(edges.filter(([eFrom, eTo, eCharacterMatched]) => from != eFrom || to != eTo || characterMatched != eCharacterMatched))
    }

    function deleteState(stateToDelete: string) {
        dfaBuilder.current.deleteState(stateToDelete)
        setStates((currentStates) => currentStates.filter((state) => state !== stateToDelete))
        setEdges((edges) => edges.filter(([from, to, _]) => from !== stateToDelete && to !== stateToDelete))
    }
    const sortEdges = (a:[string,string,string], b: [string,string,string]) => {
        const [from1, to1, char1] = a;
        const [from2, to2, char2] = b;

        const from1No = parseInt(from1.match(/[0-9]+/)![0])
        const from2No = parseInt(from2.match(/[0-9]+/)![0])
        const to1No   = parseInt(to1.match(/[0-9]+/)![0])
        const to2No   = parseInt(to2.match(/[0-9]+/)![0])
        
        const key1 = from1No * 1000 + to1No
        const key2 = from2No * 1000 + to2No

        if (key1 != key2) 
            return key1 - key2;

        return char1.localeCompare(char2);
    }
    function checkIfValidDFA(states: State[]) {
        for (const state of states) {
            const transitionsByCharacter = new Set()
            for (const tr of state.transitions) {
                if (transitionsByCharacter.has(tr.characterMatched)) {
                    return false; // 2 transitions with same character - non deterministic
                }
                if (tr.characterMatched == EMPTY) {
                    return false; // found an epsillon transition - non deterministic
                }
                transitionsByCharacter.add(tr.characterMatched)
            }
        }

        return true;
    }

    function NFAToEpsilonNFA() {
        const newStates = states
        let newEdges = edges
        for (const state of dfaBuilder.current.states) {
            const transitionsByCharacter: Record<string, string[]> = {}
            for (const tr of state.transitions) {
                if (tr.characterMatched) {
                    const existingStates = transitionsByCharacter[tr.characterMatched] || []
                    transitionsByCharacter[tr.characterMatched] = [...existingStates, tr.stateTo.value]
                }
            }
            const permutations: [string, string][][] = []
            getAllPermutations(Object.entries(transitionsByCharacter), 0, [], permutations)

            if (permutations.length > 1) {
                state.transitions = []
                newEdges = newEdges.filter(([from, _, __]) => from !== state.value)

                for (const permutation of permutations) {
                    const newStateValue = dfaBuilder.current.addState(false)
                    dfaBuilder.current.addEdge(state.value, newStateValue, EMPTY)
                    newStates.push(newStateValue)

                    // move existing transitions to new state
                    for (const [character, stateTo] of permutation) {
                        dfaBuilder.current.addEdge(newStateValue, stateTo, character)
                        newEdges.push([newStateValue, stateTo, character])
                    }
                }


            }

        }
        setStates(newStates)
        setEdges(newEdges)
    }
    return (
        <div>
            <MainNavbar />
            <br />
            {!animate ? (
                <>
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-lg-3">
                                <h4>Add a State:</h4>
                                <div className="container-fluid">
                                    <div className="row">
                                        <div className="col-9">
                                            <div className="form-check form-switch mb-3">
                                                <input className="form-check-input" role="switch" type="checkbox" checked={isAcceptedState} disabled={isReadOnly} onChange={() => setIsAcceptedState(!isAcceptedState)} id="is-accepting-select" />
                                                <label className="form-check-label" htmlFor="is-accepting-select"> Accepting?</label>
                                            </div>
                                        </div>
                                        <div className="col-3  px-1">
                                            <input className="btn btn-primary btn-sm form-control" type="button" disabled={isReadOnly} onClick={() => addState()} value="Add" id="add-state-button" />
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <h4>Add an Edge:</h4>
                                    <div className="container-fluid">
                                        <div className="row">
                                            <div className="col-3 p-0 text-center">
                                                <label className="form-label" htmlFor="select-state-from">From:</label>
                                            </div>
                                            <div className="col-3 p-0 text-center">
                                                <label className="form-label" htmlFor="select-state-to">To:</label>
                                            </div>
                                            <div className="col-3 p-0 text-center">
                                                <label className="form-label" htmlFor="input-character-matched">Char:</label>
                                            </div>
                                            <div className="col-3 p-0"></div>
                                        </div>
                                        <div className="row">
                                            <div className="col-3 px-1">
                                                <div className="mb-1">
                                                    <select className="form-select form-select-sm" disabled={isReadOnly} onChange={(obj) => setEdgeFrom(obj.target.value)} id="select-state-from">
                                                        <option value="">---</option>
                                                        {states.map((state) => {
                                                            return <option value={state} key={state}>{state}</option>
                                                        })}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="col-3 px-1">
                                                <div className="mb-1">
                                                    <select className="form-select form-select-sm" disabled={isReadOnly} defaultValue={edgeFrom} onChange={(obj) => setEdgeTo(obj.target.value)} id="select-state-to">
                                                        <option value="">---</option>
                                                        {states.map((state) => {
                                                            return <option value={state} key={state}>{state}</option>
                                                        })}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="col-3 px-1">
                                                <div className="mb-3">
                                                    <input className="form-control form-control-sm" maxLength={1} value={charToMatch} disabled={isReadOnly} type="text" onChange={(obj) => setCharToMatch(obj.target.value)} placeholder="" id="input-character-matched" />
                                                </div>
                                            </div>
                                            <div className="col-3 px-1">
                                                <div className="mb-3">
                                                    <input className="btn btn-primary btn-sm form-control" type="button" disabled={isReadOnly} onClick={() => addEdge()} value="Add" id="add-edge-button" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row sized-box">
                                            <div className="col-4 px-0">
                                                <h4>States:</h4>
                                                {dfaBuilder.current.states.map((state) => {
                                                    return <div key={state.value} id={`state-${state.value}`}>{state.value} <button disabled={isReadOnly} className="btn btn-danger btn-xs" onClick={() => deleteState(state.value)} id={`${state.value}-state-delete-button`}>DEL</button></div>
                                                })}
                                            </div>
                                            <div className="col-8 px-0">
                                                <h4>Edges:</h4>
                                                {edges
                                                .sort(sortEdges)
                                                .map(([from, to, char]) => {
                                                    return <div key={from + to + char} id={from + to + char}>{from} —{char}{'→'} {to} <button disabled={isReadOnly} className="btn btn-danger btn-xs" onClick={(el) => deleteEdge(from, to, char, el)} id={from + to + char + "-delete-button"}>DEL</button></div>
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <div className="col-lg-9">
                                <GraphFromDFA id="g-dfa-from-ui" isLarge={true} states={dfaBuilder.current.states} selectedStates={selectedStates} />
                                <div>
                                    <h4>Finalise:</h4>
                                    {isValidDFA == undefined ? (
                                        <input disabled={dfaBuilder.current.states.length == 0} className="btn btn-primary btn-sm" id="check-if-dfa-button" type="button" onClick={() => {setIsValidDFA(checkIfValidDFA(dfaBuilder.current.states)); setIsReadOnly(true);}} value="Check if this is a DFA" />
                                    ) : (isValidDFA ? (
                                        <>
                                            This is a DFA and can be animated <br />
                                            <input className="btn btn-primary btn-sm" type="button" onClick={() => setAnimate(true)} value="Animate" />
                                        </>

                                    ) : (
                                        <>
                                            This is a NFA and it needs to be converted to ∈-NFA and then to DFA to be animated  <br />
                                            {showButtonNFAToENFA ? (
                                                <input className="btn btn-primary btn-sm" id="change-to-e-nfa-button" type="button" onClick={() => { NFAToEpsilonNFA(); setShowButtonNFAToENFA(false) }} value="Change to ∈-NFA" />
                                            ) : (
                                                <> {!buildDFA ? (
                                                    <input className="btn btn-primary btn-sm" id="build-from-e-nfa-button" type="button" onClick={() => setBuildDFA(true)} value="Build DFA from ∈-NFA" />
                                                ) : (
                                                    <DFAFromENFA statesNFA={dfaBuilder.current.states} setAnimate={setAnimate} statesDFA={statesDFA} setStatesDFA={setStatesDFA} />
                                                )}
                                                </>
                                            )}

                                        </>
                                    ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                </>
            ) : (
                <>
                    {statesDFA.length > 0 && <Animate states={statesDFA} />}
                    {statesDFA.length == 0 && <Animate states={dfaBuilder.current.states} />}
                </>
            )}
        </div>
    )
}