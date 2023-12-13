describe('Test DFA from UI', () => {
    // TODO: allows creating an edge?
    // TODO: allows creating non-accepting state
    // TODO: allows creating accepting state
    // TODO: allows deleting state
    // TODO: allows animating
    it('Checks that two edges between same states get merged into one', () => {
        cy.visit('/#/dfa-from-ui')

        // Set up a state
        cy.get('#select-state-type').select("no")
        cy.get('#add-state-button').click()

        // set up first edge
        cy.get('#select-state-from').select("S1")
        cy.get('#select-state-to').select("S1")
        cy.get('#input-character-matched').type("a")
        cy.get('#add-edge-button').click()

        // set up second edge (states from/to should be auto selected the same)
        cy.get('#input-character-matched').type("b")
        cy.get('#add-edge-button').click()

        cy.get('.edgePaths path').should('have.length', 2)
    })

    it('Does not allow creating identical edges', () => {

        cy.visit('/#/dfa-from-ui')

        // Set up a state
        cy.get('#select-state-type').select("no")
        cy.get('#add-state-button').click()

        // set up first edge
        cy.get('#select-state-from').select("S1")
        cy.get('#select-state-to').select("S1")
        cy.get('#input-character-matched').type("a")
        cy.get('#add-edge-button').click()

        // set up second edge (states from/to should be auto selected the same)
        cy.get('#input-character-matched').type("a")
        cy.get('#add-edge-button').click()

        cy.on('window:alert', (str) => {
            expect(str).to.equal('This edge already exists, cannot create identical one!')
        })
    })

    it('Does not allow creating edge between non existing states', () => {
        
        cy.visit('/#/dfa-from-ui')

        // try to set up an edge without states
        cy.get('#select-state-from').select("")
        cy.get('#select-state-to').select("")
        cy.get('#input-character-matched').type("a")
        cy.get('#add-edge-button').click()

        cy.on('window:alert', (str) => {
            expect(str).to.equal('Attempted edge creation between non-existing states!')
        })
    })

    it('Does not allow creating edge without character matched', () => {
        
        cy.visit('/#/dfa-from-ui')

        // Set up a state
        cy.get('#select-state-type').select("no")
        cy.get('#add-state-button').click()

        // try to set up an edge without character matched
        cy.get('#select-state-from').select("")
        cy.get('#select-state-to').select("")
        cy.get('#add-edge-button').click()

        cy.on('window:alert', (str) => {
            expect(str).to.equal('Cannot create an edge without matching character!')
        })
    })

    it('Allows deleting an edge', () => {
        
        cy.visit('/#/dfa-from-ui')

        // Set up a state
        cy.get('#select-state-type').select("no")
        cy.get('#add-state-button').click()

        // set up edge
        cy.get('#select-state-from').select("S1")
        cy.get('#select-state-to').select("S1")
        cy.get('#input-character-matched').type("a")
        cy.get('#add-edge-button').click()

        cy.get("#S1S1a")
        cy.get("#S1S1a-delete-button").click()

        cy.get('.edgePaths path').should('have.length', 1);
        cy.get('.node').should('have.length', 2) // includes START node
    })

    it('Allows converting NFA to DFA', () => {
        
        cy.visit('/#/dfa-from-ui')

        // Set up NFA with 2 transitions matching "a", 2 transitions matching "b" and 1 transition matching c
        for (let i = 0; i < 6; i++) {
            cy.get('#select-state-type').select("no")
            cy.get('#add-state-button').click()
        }
        const edges = [
            ["S1", "S2", "a"],
            ["S1", "S3", "a"],
            ["S1", "S4", "b"],
            ["S1", "S5", "b"],
            ["S1", "S6", "c"],
        ]
        for (const [from, to, character] of edges) {
            cy.get('#select-state-from').select(from)
            cy.get('#select-state-to').select(to)
            cy.get('#input-character-matched').type(character)
            cy.get('#add-edge-button').click()
        }
        cy.get("#check-if-dfa-button").click()
        cy.get("#change-to-e-nfa-button").click()

        cy.get('.node').should('have.length', 11) //check ∈-NFA was built so states added

        cy.get("#build-from-e-nfa-button").click()

        // cy.get('#animate-dfa-from-regex-button').click()

        // cy.get("#user-input-text-for-dfa").type("text")

    })
})