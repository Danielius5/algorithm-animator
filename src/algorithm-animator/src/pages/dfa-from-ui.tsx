import { useEffect, useRef, useState } from "react";
import { Animate } from "../components/Animate";
import { EMPTY } from "../components/ENFABuildAnimator";
import { GraphFromDFA } from "../components/GraphFromDFA";
import { MainNavbar } from "../components/Navbar";
import { DFABuilder } from "../helpers/dfa_builder";
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
export default function DFAFromUI () {
    const [selectedStates, setSelectedStates] = useState<string[]>([])

    function handleClicksOnFSA(event: Event) {
        //@ts-expect-error does not like types..
        const element: HTMLElement = event.target

        const parents = getParentElements(element)
        const mermaidObj = findMermaidNodeObject(parents)
        const isElementCanvas = element.classList.contains("mermaid") && element.nodeName === "PRE"
        if (isElementCanvas) {
            event.preventDefault();
            const isAccepting = confirm("Make it an accepting state?") ?? false
            const state = dfaBuilder.current.addState(isAccepting)
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

    function disableContextMenu(event: Event) {
    
        //@ts-expect-error does not like types..
        const element: HTMLElement = event.target
    
        const parents = getParentElements(element)
        const mermaidObj = findMermaidNodeObject(parents)

        if (mermaidObj) {
            event.preventDefault()
            const stateToDelete = extractStateFromElementId(mermaidObj.id)
            dfaBuilder.current.deleteState(stateToDelete)
            setStates((currentStates) => currentStates.filter((state) => state !== stateToDelete))
            setEdges((edges) => edges.filter(([from, to, _]) => from !== stateToDelete && to !== stateToDelete))
        }
    }

    useEffect(() => {         
        window.addEventListener('click', handleClicksOnFSA);
        document.addEventListener('contextmenu', disableContextMenu)

        return () => {

          window.removeEventListener('click', handleClicksOnFSA);
          document.removeEventListener('contextmenu', disableContextMenu)
        }
    }, []);


    const [isAcceptedState, setIsAcceptedState] = useState<boolean>(false);


    const [edgeFrom, setEdgeFrom] = useState<string>("");
    const [edgeTo, setEdgeTo] = useState<string>("");
    const [charToMatch, setCharToMatch] = useState<string>("");

    const [states, setStates] = useState<string[]>([])
    const [edges, setEdges] = useState<[string, string, string][]>([])

    useEffect(() => {
        if (selectedStates.length == 2) {
            try{
                const charMatched = prompt("Desired character: ");
                if (charMatched) {
                    const edgeFrom = selectedStates[0]
                    const edgeTo = selectedStates[1]

                    dfaBuilder.current.addEdge(edgeFrom, edgeTo, charMatched)
                    setEdges([...edges, [edgeFrom,edgeTo, charMatched]])
                }
            } catch(err) {
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

    const dfaBuilder = useRef<DFABuilder>(new DFABuilder())

    function cleanForm() {
        setCharToMatch("");
    }
    function addEdge() {
        try{
            dfaBuilder.current.addEdge(edgeFrom, edgeTo, charToMatch);
            setEdges([...edges, [edgeFrom,edgeTo, charToMatch]])
            cleanForm();
        } catch(err) {
            // ignore errors from creating edge, just stop next steps
        }
    }
    function addState() {
        const value = dfaBuilder.current.addState(isAcceptedState); 
        setStates([...states, value])
        cleanForm();
    }
    function deleteEdge(from: string, to: string, characterMatched: string, el: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
        el.preventDefault();
        dfaBuilder.current.deleteEdge(from, to, characterMatched);
        setEdges(edges.filter(([eFrom, eTo, eCharacterMatched]) => from != eFrom || to != eTo || characterMatched != eCharacterMatched))
    }

    // function deleteState(state: string) {
    //     dfaBuilder.current.deleteState(state);
    //     setStates(states.filter((st) => st !== state))    
    // }

    function checkIfValidDFA(states: State[]) {
        for(const state of states) {
            const transitionsByCharacter = new Set()
            for (const tr of state.transitions) {
                if (transitionsByCharacter.has(tr.characterMatched)){
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
        for(const state of dfaBuilder.current.states) {
            const transitionsByCharacter: Record<string, string[]> = {}
            for (const tr of state.transitions) {
                if (tr.characterMatched) {
                    const existingStates = transitionsByCharacter[tr.characterMatched] || []
                    transitionsByCharacter[tr.characterMatched] = [...existingStates, tr.stateTo.value]
                }
            }
            const permutations: [string, string][][] = []
            getAllPermutations(Object.entries(transitionsByCharacter), 0, [], permutations)
            console.log(permutations, transitionsByCharacter)
            if (permutations.length > 1) {
                state.transitions = []
                newEdges = newEdges.filter(([from, _, __]) => from !== state.value)

                for(const permutation of permutations) {
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
            <br/>
            {!animate ? (
                <>
                    <div>
                        Add a State:
                        {/* <input value={stateName} type="text" onChange={(obj) => setStateName(obj.target.value)}  placeholder="State Name"/> */}
                        <select id="select-state-type" defaultValue="no" onChange={(obj) => setIsAcceptedState(obj.target.value == "yes" ? true : false)}>
                            <option id="select-state-type-not-accepted" value = "no">Not Accepted State</option>
                            <option id="select-state-type-accepted" value = "yes">Accepted State</option>
                        </select>
                        <input type="button" onClick={() => addState()} value="Add State" id="add-state-button"/>
                        <br/>

                        Add an Edge:
                        <select onChange={(obj) => setEdgeFrom(obj.target.value)} style={{width: "200px"}} id="select-state-from">
                            <option value = "">---</option>
                            {states.map((state) => {
                                return <option value={state} key={state}>{state}</option>
                            })}
                        </select>
                        <select defaultValue={edgeFrom} onChange={(obj) => setEdgeTo(obj.target.value)} style={{width: "200px"}} id="select-state-to">
                            <option value = "">---</option>
                            {states.map((state) => {
                                return <option value={state} key={state}>{state}</option>
                            })}
                        </select>
                        <input value={charToMatch} type="text" onChange={(obj) => setCharToMatch(obj.target.value)} placeholder="Character" id="input-character-matched"/>
                        <input type="button" onClick={() => addEdge()} value="Add Edge" id="add-edge-button"/>
                        <br/>
                        Edges:
                        {edges.map(([from, to,char]) => {
                            return <div key={from + to + char} id={from + to + char}>{from} ---{'>'} {to}, {char} <a href="#" onClick={(el) => deleteEdge(from, to, char, el)} id={from + to + char+ "-delete-button"}>delete</a></div>
                        })}
                    </div>

                    <div>
                        <GraphFromDFA states={dfaBuilder.current.states} selectedStates={selectedStates}/>
                    </div>
                    { isValidDFA == undefined ? (
                        <input id="check-if-dfa-button" type="button" onClick={() => setIsValidDFA(checkIfValidDFA(dfaBuilder.current.states))} value = "Check if valid DFA" />
                        ) : (isValidDFA ? (
                            <>
                            Deterministic
                            <input type="button" onClick={() => setAnimate(true)} value = "animate" />
                            </>
                            
                        ) : (
                            <>
                                Non-deterministic <br/>
                                {showButtonNFAToENFA ? (
                                    <input id="change-to-e-nfa-button" type="button" onClick={() => {NFAToEpsilonNFA(); setShowButtonNFAToENFA(false)}} value = "Change to ∈-NFA" />
                                ) : (
                                        <> {!buildDFA ? (
                                            <input id="build-from-e-nfa-button" type="button" onClick={() => setBuildDFA(true)} value = "Build DFA from ∈-NFA" />
                                        ) : (
                                            <DFAFromENFA statesNFA={dfaBuilder.current.states} setAnimate={setAnimate} statesDFA={statesDFA} setStatesDFA={setStatesDFA}/>
                                        )}
                                    </>
                                )}
                                
                            </>
                        ))
                    }
                        
                </>
            ) : (
                <>
                    {statesDFA.length > 0 && <Animate states={statesDFA} goBack={() => setAnimate(false)}/>}
                    {statesDFA.length == 0 && <Animate states={dfaBuilder.current.states} goBack={() => setAnimate(false)}/>}
                </>
            ) }
    </div>
    )}