import { useEffect, useRef, useState } from "react";
import { Animate } from "../components/Animate";
import { EMPTY } from "../components/ENFABuildAnimator";
import { GraphFromDFA } from "../components/GraphFromDFA";
import { MainNavbar } from "../components/Navbar";
import { FSABuilder } from "../helpers/FSABuilder";
import { State } from "../models/dfa";
import { getAllPermutations } from "../helpers/permutations";
import DFAFromENFA from "../components/DFAFromENFA";
import { useLongPress } from "../hooks/useLongPress";

const GRAPH_ID = "g-dfa-from-ui";

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

function getStateFromEvent(event: Event) {
    const element = event.target as unknown as HTMLElement

    const parents = getParentElements(element)
    const mermaidObj = findMermaidNodeObject(parents)
    const state = mermaidObj?.id.match(/S[0-9]+/)![0]

    return { mermaidObj, state }
}

export default function DFAFromUI() {
    const [selectedStates, setSelectedStates] = useState<string[]>([])
    const [isDeleteMode, setIsDeleteMode] = useState<boolean>(false);

    const { handlers } = useLongPress({
        doOnLongPress: switchStateType,
        doOnShortPress: addEdgeBetweenStates
    })

    function switchStateType(event: Event) {
        const { state } = getStateFromEvent(event)
        dfaBuilder.current.switchType(state ?? "");
        setStates((currentStates) => [...currentStates])
    }

    function addEdgeBetweenStates(event: Event) {
        event.preventDefault();
        const { mermaidObj } = getStateFromEvent(event)
        if (!mermaidObj) return
        const state = mermaidObj.id.match(/S[0-9]+/)![0]
        setSelectedStates((currentSelectedStates) => [...currentSelectedStates, state])
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
        // else {
        //     event.preventDefault();
        //     const state = dfaBuilder.current.addState(true)
        //     setStates((currentStates) => [...currentStates, state])
        // }
    }

    useEffect(() => {
        // window.addEventListener('click', handleClicksOnFSA);
        window.addEventListener('mousedown', handlers.onMouseDown);
        window.addEventListener('mouseup', handlers.onMouseUp);
        document.addEventListener('contextmenu', handleStateDeletions)
        return () => {

            // window.removeEventListener('click', handleClicksOnFSA);
            window.removeEventListener('mousedown', handlers.onMouseDown);
            window.removeEventListener('mouseup', handlers.onMouseUp);
            document.removeEventListener('contextmenu', handleStateDeletions)
        }
    }, [handlers]);


    const [isReadOnly, _setIsReadOnly] = useState<boolean>(false);
    const isReadOnlyRef = useRef(isReadOnly);

    const setIsReadOnly = (value: boolean) => {
        isReadOnlyRef.current = value
        _setIsReadOnly(value)
    }

    const [states, setStates] = useState<string[]>([])
    const [edges, setEdges] = useState<[string, string, string][]>([])

    useEffect(() => {
        if (selectedStates.length == 2) {
            try {
                const charMatched = prompt("Desired character: ");
                if (charMatched && charMatched.length == 1) {
                    const edgeFrom = selectedStates[0]
                    const edgeTo = selectedStates[1]

                    dfaBuilder.current.addEdge(edgeFrom, edgeTo, charMatched)
                    setEdges([...edges, [edgeFrom, edgeTo, charMatched]])
                }
                else if (!charMatched || charMatched.length != 1) {
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

    function addState() {
        // const value = dfaBuilder.current.addState(isAcceptedState);
        // setStates([...states, value])
        // cleanForm();
        const state = dfaBuilder.current.addState(false)
        setStates((currentStates) => [...currentStates, state])
        return
    }

    function deleteState(stateToDelete: string) {
        dfaBuilder.current.deleteState(stateToDelete)
        setStates((currentStates) => currentStates.filter((state) => state !== stateToDelete))
        setEdges((edges) => edges.filter(([from, to, _]) => from !== stateToDelete && to !== stateToDelete))
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
                            <div className="col-lg-9">
                                <GraphFromDFA
                                    id={GRAPH_ID}
                                    newState={addState}
                                    showControlButtons 
                                    isLarge={true} 
                                    states={dfaBuilder.current.states} 
                                    selectedStates={selectedStates} 
                                    turnOnDeleteMode={() => setIsDeleteMode(true)}
                                    turnOffDeleteMode={() => setIsDeleteMode(false)}
                                    deleteMode={isDeleteMode}
                                />
                                <div>
                                    <h4 >Finalise:</h4>
                                    {isValidDFA == undefined ? (
                                        <input disabled={dfaBuilder.current.states.length == 0} className="btn btn-primary btn-sm" id="check-if-dfa-button" type="button" onClick={() => { setIsValidDFA(checkIfValidDFA(dfaBuilder.current.states)); setIsReadOnly(true); }} value="Check if this is a DFA" />
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