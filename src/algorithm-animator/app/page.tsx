"use client"
import mermaid from 'mermaid'
import { useEffect, useState } from 'react'

mermaid.initialize({ startOnLoad: true})

interface MermaidParams {
  graph: string
}
function Mermaid({graph}: MermaidParams) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    mermaid.contentLoaded()
    setLoaded(true)
  }, [])

  return (

  <pre className={`mermaid ${!loaded ? "invisible" : ""}`} style={{width: "600px", height:"500px"}}>
    {graph}
  </pre>
)
}

export default function Home() {
  let graph = `
  ---
  title: Graph
  ---
  flowchart LR
      S1((S1))
      S2((S2))
      S3((S3))
      S4(((S4)))
      S1 -->|a|S2
      S1 --> S3
      S2 --> S3
      S3 --> S2
      S2 --> S4
      S3 --> S4
      S4 -->|a,b|S4
      `
  let graph2 = `
      ---
      title: Graph
      ---
      stateDiagram-v2
          [*] --> S1
      
          S1 --> S2: A
          S1 --> S3: B
          S2 --> S4: A
          S3 --> S4: B
          S2 --> S3: B
          S3 --> S2: A
          S4 --> S4: A, B
          S4::: finalState
          classDef finalState fill:#009,color:white,font-weight:bold
          `
  return (
    <>
      <Mermaid graph={graph}></Mermaid>
      <Mermaid graph={graph2}></Mermaid>
    </>
  )
}
