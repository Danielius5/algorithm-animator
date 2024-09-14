import { State } from "../models/dfa"
import mermaid, { RenderResult } from 'mermaid'
import { useEffect, useState } from "react"

interface MermaidParams {
    graph: string
    id: string
    isLarge?: boolean
    noHeight?: boolean
    deleteMode?: boolean
}

  function Mermaid({graph, isLarge, noHeight, id, deleteMode}: MermaidParams) {
    const [render, setRender] = useState<null | RenderResult>(null);
    useEffect(() => {
      const asyncChild = async () => {
        const result = await mermaid.render(id, graph)
        setRender(result)
      }
      asyncChild()
    }, [])

    if (render) {
      return (
        <pre className={`mm ${isLarge? "mm-large" : ""} ${noHeight? "no-height" : ""} ${deleteMode ? "deleteMode" : ""}`} id={id} dangerouslySetInnerHTML={{__html: render.svg}}></pre>
      )
    }
  } 

function recursiveAppendGraph(graph: string[], state: State, visited: Set<string>, selectedStates: string[]) {
  if (visited.has(state.value)) {
    return;
  }
  if (state.isAccepted) {
    graph.push(`\n  ${state.value}:::finalState`)
  }
  if (state.active) {
    graph.push(`\n  ${state.value}:::currentState`)
  }
  if (selectedStates.includes(state.value)){
    graph.push(`\n  ${state.value}:::selectedState`)
  }
  graph.push(`\n  ${state.value}`)
  visited.add(state.value)
  const transitionsToCharacters:Record<string, string[]> = {}
  const isTransitionAdded:Record<string, boolean> = {}
  const isTransitionActive:Record<string, boolean> = {}

  for (const transition of state.transitions) {
    if (transition.characterMatched) {
      const key = state.value + "_" + transition.stateTo.value
      if (!transitionsToCharacters[key]) {
        transitionsToCharacters[key] = []
      }
      transitionsToCharacters[key].push(transition.characterMatched)
      isTransitionAdded[key] = false
      isTransitionActive[key] = isTransitionActive[key] || (transition.active ?? false)
    }
    recursiveAppendGraph(graph, transition.stateTo, visited, selectedStates);
  }

  Object.entries(transitionsToCharacters).map(([states, characters]) => {
    if (!isTransitionAdded[states]) {
      const [fromState, toState] = states.split("_")
      const charactersJoined = characters.join(",")
      const isActive = isTransitionActive[states]
      graph.push(`\n  ${fromState} ${isActive ? "==" : "--"} ${charactersJoined} ${isActive ? "==>" : "-->"} ${toState}`)
      
      isTransitionAdded[states] = true
    
    }
  })
}

interface GraphFromDFAParams {
  states: State[]
  selectedStates?: string[]
  isLarge?: boolean
  noHeight?: boolean
  id: string
  showControlButtons?: boolean
  newState?: () => void
  turnOnDeleteMode?: () => void
  turnOffDeleteMode?: () => void
  deleteMode?: boolean
}
export function GraphFromDFA({states, selectedStates, isLarge, noHeight, id, showControlButtons, newState, turnOnDeleteMode, deleteMode, turnOffDeleteMode}:GraphFromDFAParams) {

    const visited = new Set<string>();
    const graph = ["flowchart LR\n classDef finalState font-weight:bold,stroke-width:3px \n classDef currentState fill:#f00"];
    if (states.length > 0) {
      graph.push(`\n  START --> ${states[0].value}`)
    }
    for(const state of states) {
      recursiveAppendGraph(graph, state, visited, selectedStates ?? []);
    }

    return (
      <>
        {showControlButtons &&  (
          <div className="row">
            {!deleteMode ? (
              <>
                <div className="col-4 p-1">
                  <button className="btn w-100 btn-primary btn-lg rounded-0" onClick={newState}>New state</button>
                </div>
                <div className="col-4 p-1">
                  <button className="btn w-100 btn-danger btn-lg rounded-0" onClick={turnOnDeleteMode}>Delete...</button>
                </div>
                <div className="col-4 p-1">
                  <button className="btn w-100 btn-success btn-lg rounded-0">Finalise</button>
                </div>
              </>
            ): (
              <div className="col-12 p-1">
                <button className="btn w-100 btn-danger btn-lg rounded-0" onClick={turnOffDeleteMode}>Turn off Delete Mode</button>
              </div>
            )}
          </div>
        )}
        <div className="row">
          <div className="col-12 mt-2">
            <Mermaid deleteMode={deleteMode} id={id} graph={graph.join("")} key={graph.join("").length} isLarge={isLarge} noHeight={noHeight}></Mermaid>
          </div>
        </div>
      </>
    )
}
