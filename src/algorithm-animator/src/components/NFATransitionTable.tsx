import { Col, Container, Row, Table } from "react-bootstrap";
import { State } from "../models/dfa";

interface ENFAToDFAAnimatorParams {
    NFAstates: State[];
    NFATransitionTable: Set<string>[][];
    language: string[]
}


export function NFATransitionTable({NFATransitionTable}:ENFAToDFAAnimatorParams) {

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