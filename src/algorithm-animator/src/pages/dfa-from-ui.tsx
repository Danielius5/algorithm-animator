import { DFABuilder } from "../helpers/dfa_builder";
import { useEffect, useRef, useState } from "react";
import { GraphFromDFA } from "../components/GraphFromDFA";
import { Animate } from "../components/Animate";
import { State } from "../models/dfa";
import { EMPTY } from "../components/ENFABuildAnimator";
import { MainNavbar } from "../components/Navbar";


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
        dfaBuilder.current.addEdge(edgeFrom, edgeTo, charToMatch);
        setEdges([...edges, [edgeFrom,edgeTo, charToMatch]])
        cleanForm();
    }
    function addState() {
        const value = dfaBuilder.current.addState(isAcceptedState); 
        setStates([...states, value])
        cleanForm();
    }
    function deleteEdge(from: string, to: string, characterMatched: string) {
        dfaBuilder.current.deleteEdge(from, to, characterMatched);
        setEdges(edges.filter(([eFrom, eTo, eCharacterMatched]) => from != eFrom || to != eTo || characterMatched != eCharacterMatched))
    }

    function checkIfValidDFA(states: State[]) {
        for(let state of states) {
            let transitionsByCharacter = new Set()
            for (let tr of state.transitions) {
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

    function NFAToEpsillonNFA(states: State[]) {
        for(let state of states) {
            let transitionsByCharacter = new Map<string, State[]>()
            for (let tr of state.transitions) {
                if (tr.characterMatched) {
                    let existingStates = transitionsByCharacter.get(tr.characterMatched) || []
                    transitionsByCharacter.set(tr.characterMatched, [...existingStates, tr.stateTo])
                }
            }
            transitionsByCharacter.forEach((states, character) => {
            // if () {
                
            // }
            })
        }

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
                        <select defaultValue="no" onChange={(obj) => setIsAcceptedState(obj.target.value == "yes" ? true : false)}>
                            <option value = "no">Not Accepted State</option>
                            <option value = "yes">Accepted State</option>
                        </select>
                        <input type="button" onClick={() => addState()} value="Add State"/>
                        <br/>

                        Add an Edge:
                        <select onChange={(obj) => setEdgeFrom(obj.target.value)} style={{width: "200px"}}>
                            <option value = "">---</option>
                            {states.map((state) => {
                                return <option value={state} key={state}>{state}</option>
                            })}
                        </select>
                        <select defaultValue={edgeFrom} onChange={(obj) => setEdgeTo(obj.target.value)} style={{width: "200px"}}>
                            <option value = "">---</option>
                            {states.map((state) => {
                                return <option value={state} key={state}>{state}</option>
                            })}
                        </select>
                        <input value={charToMatch} type="text" onChange={(obj) => setCharToMatch(obj.target.value)} placeholder="Character"/>
                        <input type="button" onClick={() => addEdge()} value="Add Edge"/>
                        <br/>
                        Edges:
                        {edges.map(([from, to,char]) => {
                            return <div key={from + to + char}>{from} ---{'>'} {to}, {char} <a href="#" onClick={() => deleteEdge(from, to, char)}>delete</a></div>
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