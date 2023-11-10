"use client"
import DFAFromRegex from '@/pages/dfa-from-regex'
import mermaid from 'mermaid'
import React from 'react';
import { useEffect, useState } from 'react'

import ReactDOM, { createRoot } from 'react-dom/client';
import { BrowserRouter, Link, RouterProvider, createBrowserRouter } from 'react-router-dom';

mermaid.initialize({ startOnLoad: true})

export default function Home() {
  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
  }, [])
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
    {/* {isClient && <DFAFromUI /> } */}
    {isClient && <DFAFromRegex /> }
      {/* <Mermaid graph={graph}></Mermaid> */}
      {/* <Mermaid graph={graph2}></Mermaid> */}
    </>
  )
}
