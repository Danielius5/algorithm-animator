import { DFABuilder } from "@/helpers/dfa_builder";
import { useRef, useState } from "react";
import { GraphFromDFA } from "../components/GraphFromDFA";
import { GraphAnimator } from "../components/GraphAnimator";
import { Trace } from "../components/Trace";

export function DFAFromUI () {
    const [stateName, setStateName] = useState<string>("");
    const [isAcceptedState, setIsAcceptedState] = useState<boolean>(false);


    const [edgeFrom, setEdgeFrom] = useState<string>("");
    const [edgeTo, setEdgeTo] = useState<string>("");
    const [charToMatch, setCharToMatch] = useState<string>("");

    const [states, setStates] = useState<string[]>(["S1"])
    const [edges, setEdges] = useState<[string, string, string][]>([])

    const [currentLetter, setCurrentLetter] = useState<number>(0)
    const [currentState, setCurrentState] = useState<string>("In Progress")

    const dfaBuilder = useRef<DFABuilder>(new DFABuilder())

    function cleanForm() {
        setStateName("");
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
    return (
        <div className="grid-container">
            <div className="grid-item">
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
            <div className="grid-item">
                <Trace text="aab" current={currentLetter} log={[]} state={currentState}/>
            </div>
            <div className="grid-item">
                {/* <GraphFromDFA states={dfaBuilder.current.states} /> */}
                <GraphAnimator states={dfaBuilder.current.states} text="aab" setCurrentLetter={setCurrentLetter} setCurrentState={setCurrentState}/>
            </div>
        </div>
    )
}