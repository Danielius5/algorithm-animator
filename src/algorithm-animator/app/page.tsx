"use client"
import { MainNavbar } from '@/components/Navbar';
import DFAFromRegex from '@/pages/dfa-from-regex'
import mermaid from 'mermaid'
import React from 'react';
import { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';


// mermaid.initialize({ startOnLoad: true})

export default function Home() {

  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <>
      {isClient && (
        <>
          <MainNavbar />
          <br/>

          
        </>
        )
      }
    </>
  )
}
