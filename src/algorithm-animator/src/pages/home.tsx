import { Animate } from '../components/Animate';
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
        <div className="row">
          <div className="col-12 mt-3">
            <div className="card">
              <div className="card-header">
                Main components
              </div>
              <div className="card-body">
                The main components of Finite State Automata are states and transitions
                <div className="row">
                  <div className="col-lg-6 mt-3">
                    <div className="card">
                      <div className="card-header">
                        States
                      </div>
                      <div className="card-body">
                        <p className="card-text">States correspond to certain stages of matching a sequence to a Regular Expression. Further matching can only happen via the transitions outgoing from the current state</p>

                        <h6 className="card-title">Non-Accepting State</h6>
                        <p className="card-text">If the DFA terminates at a non-accepting state <strong>S1</strong>, the sequence is rejected</p>
                        <GraphFromDFA id="g1" states={[{ value: "S1", isAccepted: false, transitions: [] }]} noHeight />

                        <h6 className="card-title">Accepting State</h6>
                        <p className="card-text">If the DFA terminates at an accepting state <strong>S1</strong>, and the whole sequence has been matched, the sequence is accepted</p>
                        <GraphFromDFA id="g2" states={[{ value: "S1", isAccepted: true, transitions: [] }]} noHeight />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 mt-3">
                    <div className="card">
                      <div className="card-header">
                        Transitions
                      </div>
                      <div className="card-body">
                        <p className="card-text">Transitions can exist between states corresponding to a recognised character. Transitions have 3 types:</p>

                        <h6 className="card-title">Single-Character transition</h6>
                        <p className="card-text">A transition that matches only one character</p>
                        <GraphFromDFA id="g3" states={[{ value: "S1", isAccepted: false, transitions: [{ characterMatched: "a", stateTo: { value: "S2", isAccepted: false, transitions: [] } }] }, { value: "S2", isAccepted: false, transitions: [] }]} noHeight />

                        <h6 className="card-title">Multi-Character transition</h6>
                        <p className="card-text">A transition that matches multiple characters, but only <strong>only one at a time</strong></p>
                        <GraphFromDFA id="g4" states={[{ value: "S1", isAccepted: false, transitions: [{ characterMatched: "a", stateTo: { value: "S2", isAccepted: false, transitions: [] } }, { characterMatched: "b", stateTo: { value: "S2", isAccepted: false, transitions: [] } }] }, { value: "S2", isAccepted: false, transitions: [] }]} noHeight />

                        <h6 className="card-title">Self-loop transition</h6>
                        <p className="card-text">A transition that matches one or more characters between the same state, but only <strong>only one at a time</strong></p>
                        <GraphFromDFA id="g5" states={[{ value: "S1", isAccepted: false, transitions: [{ characterMatched: "a", stateTo: { value: "S1", isAccepted: false, transitions: [] } }, { characterMatched: "b", stateTo: { value: "S1", isAccepted: false, transitions: [] } }] }]} noHeight />

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 mt-3">
            <div className="card">
              <div className="card-header">
                Determinism and Non-Determinism
              </div>
              <div className="card-body">
                <p className="card-text">
                  There are three types of Finite Automata you will see in this web application. All of these are equivalent and recognise <strong>aa*b</strong>.
                  <div className="row">
                    <div className="col-lg-4 mt-3">
                      <div className="card">
                        <div className="card-header">
                          Non-Deterministic Finite Automaton (NFA)
                        </div>
                        <div className="card-body">
                          <p className="card-text">
                            In this type of finite automaton, there can be multiple transitions outgoing from the same state with the same character that is being matched. It is non-deterministic because there is more than one path to match the character which allows a choice.
                          </p>
                          <GraphFromDFA id="g6" states={[{ value: "S1", isAccepted: false, transitions: [{ characterMatched: "a", stateTo: { value: "S1", isAccepted: false, transitions: [] } }, { characterMatched: "a", stateTo: { value: "S2", isAccepted: false, transitions: [{ characterMatched: "b", stateTo: { value: "S3", isAccepted: true, transitions: [] } }] } },] }]} />
                          <h5>Usage:</h5>
                          <p>
                            These you can currently create via User Interface. This type of NFA will NOT be created from a Regular Expression, although such functionality is a potential future direction. It is also not possible to animate them right now.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 mt-3">
                      <div className="card">
                        <div className="card-header">
                          Epsilon Non-Deterministic Finite Automaton (∈-NFA)
                        </div>
                        <div className="card-body">
                          <p className="card-text">
                            In this type of finite automaton, there is a concept of epsilon transitions which do not require to match a character to go through them. It is non-deterministic because one can consider being at the same time in all states that can be travelled to from the current state via an epsilon transition.
                          </p>
                          <GraphFromDFA id="g7" states={[{ value: "S1", isAccepted: false, transitions: [{ characterMatched: "ε", stateTo: { value: "S2", isAccepted: false, transitions: [{ characterMatched: "a", stateTo: { value: "S1", isAccepted: false, transitions: [] } }] } }, { characterMatched: "ε", stateTo: { value: "S3", isAccepted: false, transitions: [{ characterMatched: "a", stateTo: { value: "S4", isAccepted: false, transitions: [{ characterMatched: "b", stateTo: { value: "S5", isAccepted: true, transitions: [] } }] } }] } }] }]} />
                          <h5>Usage:</h5>
                          <p>
                            These are currently used as an intermediate step of creating a DFA from Regular Expression. In addition, if you create a NFA using User Interface, it will get converted into ∈-NFA as an intermediate step of converting to a DFA to reuse logic. Animation of these is not supported yet, although is a future direction.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 mt-3">
                      <div className="card">
                        <div className="card-header">
                          Deterministic Finite Automaton (DFA)
                        </div>
                        <div className="card-body">
                          <p className="card-text">
                            In this type of finite automaton, there is always at most one transition outgoing from each state for each character.
                          </p>
                          <GraphFromDFA id="g8" states={[{ value: "S1", isAccepted: false, transitions: [{ characterMatched: "a", stateTo: { value: "S2", isAccepted: false, transitions: [{ characterMatched: "a", stateTo: { value: "S2", isAccepted: false, transitions: [] } }, { characterMatched: "b", stateTo: { value: "S3", isAccepted: true, transitions: [] } }] } },] }]} />
                          <h5>Usage:</h5>
                          <p>
                            Animating DFA's is the main end-result of this tool. You can create DFA's directly from the User Interface, you can also get them created for you directly from Regular Expression. You can also animate DFA's.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 mt-3">
            <div className="card">
              <div className="card-header">
                Animation
              </div>
              <div className="card-body">
                <p className="card-text">
                  You will find an animator which will allow you go through the DFA's. There are 3 possible options how animation can go


                </p>

                <div className="row">
                  <div className="col-lg-4 mt-3">
                    <div className="card">
                      <div className="card-header">
                        Success
                      </div>
                      <div className="card-body">
                        <p className="card-text">
                          The whole sequence can be matched successfully and DFA terminates in an accepting state. You will see that the matching was successful.
                        </p>
                        <Animate id="animator-1" sequence="ab" states={[{ "value": "S1", "isAccepted": false, "transitions": [{ "characterMatched": "a", "stateTo": { "value": "S2", "isAccepted": false, "transitions": [{ "characterMatched": "a", "stateTo": { "value": "S2", "isAccepted": false, "transitions": [], "active": false }, "active": false }, { "characterMatched": "b", "stateTo": { "value": "S3", "isAccepted": true, "transitions": [], "active": false }, "active": false }], "active": false }, "active": false }], "active": true }]} />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 mt-3">
                    <div className="card">
                      <div className="card-header">
                        Failure (non-accepting state)
                      </div>
                      <div className="card-body">
                        <p className="card-text">
                          If DFA terminates in a non-accepted state, the matching will fail.
                        </p>
                        <Animate id="animator-2" sequence="a" states={[{ "value": "S1", "isAccepted": false, "transitions": [{ "characterMatched": "a", "stateTo": { "value": "S2", "isAccepted": false, "transitions": [{ "characterMatched": "a", "stateTo": { "value": "S2", "isAccepted": false, "transitions": [], "active": false }, "active": false }, { "characterMatched": "b", "stateTo": { "value": "S3", "isAccepted": true, "transitions": [], "active": false }, "active": false }], "active": false }, "active": false }], "active": true }]} />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 mt-3">
                    <div className="card">
                      <div className="card-header">
                        Failure (incomplete match)
                      </div>
                      <div className="card-body">
                        <p className="card-text">
                          If there is no transition with the current character, the DFA will fail as it is stuck in the intermediate state and cannot match the whole sequence.
                        </p>
                        <Animate id="animator-3" sequence="abc" states={[{ "value": "S1", "isAccepted": false, "transitions": [{ "characterMatched": "a", "stateTo": { "value": "S2", "isAccepted": false, "transitions": [{ "characterMatched": "a", "stateTo": { "value": "S2", "isAccepted": false, "transitions": [], "active": false }, "active": false }, { "characterMatched": "b", "stateTo": { "value": "S3", "isAccepted": true, "transitions": [], "active": false }, "active": false }], "active": false }, "active": false }], "active": true }]} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


    </>
  )
}
