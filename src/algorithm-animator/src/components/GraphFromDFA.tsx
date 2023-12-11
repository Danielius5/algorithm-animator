import { State } from "../models/dfa"
import mermaid from 'mermaid'
import { useEffect, useState } from "react"

interface MermaidParams {
    graph: string
}
mermaid.initialize({ startOnLoad: true})


function Mermaid({graph}: MermaidParams) {
    const [loaded, setLoaded] = useState(false)
  
    useEffect(() => {
      mermaid.contentLoaded()
      setLoaded(true)
    }, [])
  
    return (
  
    <pre className={`mermaid ${!loaded ? "invisible" : ""}`} style={{width: "100%"}}>
      {graph}
    </pre>
  )
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
      isTransitionActive[key] = transition.active ?? false
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
}
export function GraphFromDFA({states, selectedStates}:GraphFromDFAParams) {
    const visited = new Set<string>();
    const graph = ["flowchart LR\n classDef finalState font-weight:bold,stroke-width:3px \n classDef currentState fill:#f00"];
    if (states.length > 0) {
      graph.push(`\n  START --> ${states[0].value}`)
    }
    for(const state of states) {
      recursiveAppendGraph(graph, state, visited, selectedStates ?? []);
    }
    const key = Math.random(); // intentional full recreation.
    return (
      <Mermaid graph={graph.join("")} key={key}></Mermaid>
    )
}

// interface TextThroughDFAParams {
//   dfa: DFA
//   text: string
// }


// function appendSteps(steps:Steps, transitions: Transition[], text: string) {
//   if (text == "") {
//     return;
//   }

//   const char = text[0];
//   for(const transition of transitions) {
//     if (transition.characterMatched == char) {
//       steps.push(transition)
//       steps.push(transition.stateTo)
//       appendSteps(steps, transition.stateTo.transitions, text.substring(1))
//       return;
//     }
//   }

// }
// export function TextThroughDFA({dfa, text}: TextThroughDFAParams) {
  
//   let steps: Steps = [];
//   appendSteps(steps, [dfa.rootTransition], text)
// }