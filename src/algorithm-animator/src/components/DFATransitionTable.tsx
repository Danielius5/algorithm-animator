import { Col, Container, Row, Table } from "react-bootstrap";

interface DFATransitionTableParams {
    NFATransitionTable: Set<string>[][];
    DFATransitionTable: Set<string>[][];
    language: string[]
}


export function DFATransitionTable({NFATransitionTable, DFATransitionTable: DFATransitionTableState}:DFATransitionTableParams) {
    if (NFATransitionTable[1] === undefined) {
        return []
    }
    return (
        <>
            {DFATransitionTableState.length > 0 &&
                <Container fluid>
                    <Row>
                        <Col sm={2}>
                            <Table bordered>
                                <thead>
                                    <tr>
                                        {DFATransitionTableState[0].map((character) => <th key={[...character].join()}>{[...character].join()}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {DFATransitionTableState.slice(1).map((row, ind) => {
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

