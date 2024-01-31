import { GraphFromDFA } from '../components/GraphFromDFA';
import { MainNavbar } from '../components/Navbar';


// mermaid.initialize({ startOnLoad: true})

export default function Home() {


  return (
    <>
      <MainNavbar />

      <div className="container">
        <div className="row mt-3">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                Finite State Automaton Animator
              </div>
              <div className="card-body">
                <p className="card-text">Here you will find a tool intending to help you understand Deterministic Finite Automata (DFA). Here you can <a href="/algorithm-animator/#/dfa-from-ui">build DFA's yourself from user interface and animate them</a>, you can also <a href="/algorithm-animator/#/dfa-from-regex">build them directly from a Regular Expression</a> </p>
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-6">
            <div className="card">
              <div className="card-header">
                States
              </div>
              <div className="card-body">
                <h5 className="card-title">States</h5>
                <p className="card-text">States correspond to certain stages of matching a sequence to a Regular Expression. Further matching can only happen via the transitions outgoing from the current state</p>

                <h6 className="card-title">Non-Accepting State</h6>
                <p className="card-text">If the DFA terminates at a non-accepting state <strong>S1</strong>, the sequence is rejected</p>
                <GraphFromDFA isStatic={true} id="g1" states={[{ value: "S1", isAccepted: false, transitions: [] }]} noHeight />

                <h6 className="card-title">Accepting State</h6>
                <p className="card-text">If the DFA terminates at an accepting state <strong>S1</strong>, and the whole sequence has been matched, the sequence is accepted</p>
                <GraphFromDFA isStatic={true} id="g2" states={[{ value: "S1", isAccepted: true, transitions: [] }]} noHeight />
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="card">
              <div className="card-header">
                Transitions
              </div>
              <div className="card-body">
                <h5>Transitions</h5>
                <p className="card-text">Transitions can exist between states corresponding to a recognised character. Transitions have 3 types:</p>

                <h6 className="card-title">Single-Character transition</h6>
                <p className="card-text">A transition that matches only one character</p>
                <GraphFromDFA isStatic={true} id="g3" states={[{ value: "S1", isAccepted: false, transitions: [{ characterMatched: "a", stateTo: { value: "S2", isAccepted: false, transitions: [] } }] }, { value: "S2", isAccepted: false, transitions: [] }]} noHeight />

                <h6 className="card-title">Multi-Character transition</h6>
                <p className="card-text">A transition that matches multiple characters, but only <strong>only one at a time</strong></p>
                <GraphFromDFA isStatic={true} id="g4" states={[{ value: "S1", isAccepted: false, transitions: [{ characterMatched: "a", stateTo: { value: "S2", isAccepted: false, transitions: [] } }, { characterMatched: "b", stateTo: { value: "S2", isAccepted: false, transitions: [] } }] }, { value: "S2", isAccepted: false, transitions: [] }]} noHeight />

                <h6 className="card-title">Self-loop transition</h6>
                <p className="card-text">A transition that matches one or more characters between the same state, but only <strong>only one at a time</strong></p>
                <GraphFromDFA isStatic={true} id="g5" states={[{ value: "S1", isAccepted: false, transitions: [{ characterMatched: "a", stateTo: { value: "S1", isAccepted: false, transitions: [] } }, { characterMatched: "b", stateTo: { value: "S1", isAccepted: false, transitions: [] } }] }]} noHeight />

              </div>
            </div>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                Determinism and Non-Determinism
              </div>
              <div className="card-body">
                <p className="card-text">
                  There are three types of Finite Automata you will see in this web application
                  <div className="row mt-3">
                    <div className="col-4">
                      <div className="card">
                        <div className="card-header">
                          Non-Deterministic Finite Automaton (NFA)
                        </div>
                        <div className="card-body">
                          <p className="card-text">
                            In this type of finite automaton, there can be multiple transitions outgoing from the same state with the same character that is being matched. It is non-deterministic because there is more than one path to match the string which allows a choice.
                          </p>
                          <GraphFromDFA isStatic={true} id="g6" states={[{ value: "S1", isAccepted: false, transitions: [{ characterMatched: "a", stateTo: { value: "S2", isAccepted: false, transitions: [] } }, { characterMatched: "a", stateTo: { value: "S3", isAccepted: false, transitions: [{ characterMatched: "b", stateTo: { value: "S4", isAccepted: true, transitions: [] } }] } }] }, { value: "S2", isAccepted: false, transitions: [] }, { value: "S3", isAccepted: false, transitions: [] }, { value: "S4", isAccepted: true, transitions: [] }]} />
                        </div>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="card">
                        <div className="card-header">
                          Epsilon Non-Deterministic Finite Automaton (∈-NFA)
                        </div>
                        <div className="card-body">
                          <p className="card-text">
                            In this type of finite automaton, there is a concept of epsilon transitions which do not require to match a character to go through them. It is non-deterministic because one can consider being at the same time in multiple states connected by an epsilon transition
                          </p>
                          <GraphFromDFA isStatic={true} id="g6" states={[{ value: "S1", isAccepted: false, transitions: [{ characterMatched: "a", stateTo: { value: "S2", isAccepted: false, transitions: [] } }, { characterMatched: "a", stateTo: { value: "S3", isAccepted: false, transitions: [] } }] }, { value: "S2", isAccepted: false, transitions: [] }, { value: "S3", isAccepted: false, transitions: [] }]} />
                        </div>
                      </div>
                    </div>
                  </div>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>


    </>
  )
}
