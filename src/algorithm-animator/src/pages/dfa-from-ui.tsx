import { useRef, useState } from "react";
import { Animate } from "../components/Animate";
import { EMPTY } from "../components/ENFABuildAnimator";
import { GraphFromDFA } from "../components/GraphFromDFA";
import { MainNavbar } from "../components/Navbar";
import { DFABuilder } from "../helpers/dfa_builder";
import { State } from "../models/dfa";


export default function DFAFromUI () {

    const [isAcceptedState, setIsAcceptedState] = useState<boolean>(false);


    const [edgeFrom, setEdgeFrom] = useState<string>("");
    const [edgeTo, setEdgeTo] = useState<string>("");
    const [charToMatch, setCharToMatch] = useState<string>("");

    const [states, setStates] = useState<string[]>([])
    const [edges, setEdges] = useState<[string, string, string][]>([])

    
    const [isValidDFA, setIsValidDFA] = useState<boolean | undefined>(undefined)
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
        } catch(err) {}
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

    // function NFAToEpsillonNFA(states: State[]) {
    //     for(const state of states) {
    //         const transitionsByCharacter = new Map<string, State[]>()
    //         for (const tr of state.transitions) {
    //             if (tr.characterMatched) {
    //                 const existingStates = transitionsByCharacter.get(tr.characterMatched) || []
    //                 transitionsByCharacter.set(tr.characterMatched, [...existingStates, tr.stateTo])
    //             }
    //         }
    //         transitionsByCharacter.forEach((states, character) => {
    //         // if () {
                
    //         // }
    //         })
    //     }

    // }
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
                        <GraphFromDFA states={dfaBuilder.current.states} />
                    </div>
                    { isValidDFA == undefined ? (
                        <input type="button" onClick={() => setIsValidDFA(checkIfValidDFA(dfaBuilder.current.states))} value = "Check if valid DFA" />
                        ) : (isValidDFA ? (
                            <>
                            Deterministic
                            <input type="button" onClick={() => setAnimate(true)} value = "animate" />
                            </>
                            
                        ) : (
                            <>Non-deterministic</>
                        ))
                    }
                        
                </>
            ) : (
                <Animate states={dfaBuilder.current.states} goBack={() => setAnimate(false)}/>
            ) }
    </div>
    )}