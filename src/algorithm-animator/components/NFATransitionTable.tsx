import { State } from "@/models/dfa";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { EMPTY } from "./ENFABuildAnimator";
import { Col, Container, Row, Table } from "react-bootstrap";

interface ENFAToDFAAnimatorParams {
    NFAstates: State[];
    NFATransitionTable: Set<string>[][];
    setNFATransitionTable: Dispatch<SetStateAction<Set<string>[][]>>
    language: string[]
}

function findAllReachableByChar(state: State, char: string, visited: Set<string>) {
    let set: Set<string> = new Set()
    if (visited.has(state.value)) {
        return set;
    }
    visited.add(state.value)
    for(const t of state.transitions) {
        if (t.characterMatched === char) {
            set.add(t.stateTo.value)
            if (char == EMPTY) {
                set = new Set<string>([...set, ...findAllReachableByChar(t.stateTo, char, visited)])
            }
        }
    }
    return set
}
function getInitialENFATransitionTable(language: string[], states: State[]){
    let table: Set<string>[][] = [[new Set(["State"]), ...language.map((c) => new Set(c))]]
    for(const state of states){
        // if (state.value === "Start") continue;
        const row:Set<string>[] = [new Set([state.value])]
        for (const char of language) {
            const visited = new Set<string>()
            const reachable = findAllReachableByChar(state, char, visited)
            if (char == EMPTY) reachable.add(state.value)
            // const res = Array.from(reachable).sort((a, b) => a.localeCompare(b));

            row.push(reachable)
        }

        table.push(row);
    }
        
    
    return table
}
export function NFATransitionTable({NFAstates, language, NFATransitionTable, setNFATransitionTable}:ENFAToDFAAnimatorParams) {
    // TODO: do step by step?
    useEffect(() => {
        setNFATransitionTable(getInitialENFATransitionTable(language, NFAstates))
    }, [])
    return (
        <>
            {NFATransitionTable.length > 0 &&
            <Container fluid>
                <Row>
                    <Col sm={2}>
                        <Table bordered>
                            <thead>
                                <tr>
                                    {NFATransitionTable[0].map((character) => <th key={[...character].join()}>{[...character].join()}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {NFATransitionTable.slice(1).map((row, ind) => {
                                    return (
                                        <tr key={ind}>
                                            {row.map((cell, index) => {
                                                return (
                                                    <>
                                                        {[...cell].length == 0 ? 
                                                        (
                                                            <td key={index}>∅</td>
                                                        )
                                                        : 
                                        
                                                        (
                                                            <td key={index}>
                                                                {[...cell].sort((a,b) => a.localeCompare(b)).join()}
                                                            </td>
                                                        )}
                                                    </>
                                                )
                                                })}
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
            }
        </>
    )
}