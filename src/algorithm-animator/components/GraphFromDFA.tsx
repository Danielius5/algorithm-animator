import { DFA, State, Steps, Transition } from "@/models/dfa"
import { useEffect, useState } from "react"
import mermaid from 'mermaid'

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
  graph.push(`\n  ${state.value}`)
  visited.add(state.value)

  for (const transition of state.transitions) {

    graph.push(`\n  ${state.value} --> ${transition.stateTo.value}: ${transition.characterMatched}`)
    recursiveAppendGraph(graph, transition.stateTo, visited);
  }
}

interface GraphFromDFAParams {
  states: State[]
}
export function GraphFromDFA({states}:GraphFromDFAParams) {
    let visited = new Set<string>();
    let graph = ["stateDiagram-v2\n [*] --> S1 \n classDef finalState font-weight:bold,stroke-width:3px"];
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