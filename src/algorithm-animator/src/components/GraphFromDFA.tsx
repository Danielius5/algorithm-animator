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


function recursiveAppendGraph(graph: string[], state: State, visited: Set<string>) {
  if (visited.has(state.value)) {
    return;
  }
  if (state.isAccepted) {
    graph.push(`\n  ${state.value}:::finalState`)
  }
  if (state.active) {
    graph.push(`\n  ${state.value}:::currentState`)
  }

  graph.push(`\n  ${state.value}`)
  visited.add(state.value)

  for (const transition of state.transitions) {
    if (transition.characterMatched) {
      graph.push(`\n  ${state.value} ${transition.active ? "==" : "--"} ${transition.characterMatched} ${transition.active ? "==>" : "-->"} ${transition.stateTo.value}`)
    } else {
      graph.push(`\n  ${state.value} ${transition.active ? "==>" : "-->"} ${transition.stateTo.value}`)

    }
    recursiveAppendGraph(graph, transition.stateTo, visited);
  }
}

interface GraphFromDFAParams {
  states: State[]
}
export function GraphFromDFA({states}:GraphFromDFAParams) {
    const visited = new Set<string>();
    const graph = ["flowchart LR\n classDef finalState font-weight:bold,stroke-width:3px \n classDef currentState fill:#f00"];
    for(const state of states) {
      recursiveAppendGraph(graph, state, visited);
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