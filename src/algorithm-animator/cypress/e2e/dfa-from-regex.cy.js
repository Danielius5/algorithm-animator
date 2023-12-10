describe('Test DFA from RegEx', () => {
    [
        // Basic
        ['a', [
            ['a', 2, true], 
            ['b', 1, false],
        ]],
        ['a|b', [
            ['a', 2, true], 
            ['c', 1, false],
        ]],
        ['aa*', [
            ['a', 2, true],
            ['aaaa', 8, true],
        ]],

        // Previous bugs
        // was incorrectly interpreted as a(b|b)c
        ['ab|bc', [
            ['ab', 4, true], 
            ['bc', 4, true],
            ['abc', 6, false]
        ]],

        // Advanced
        ['aa*bb*', [
            ['ab', 4, true], 
            ['aabb', 8, true], 
            ['aaabbb', 12, true], 
            ["a", 2, false],
        ]],
        ['b*(abb*)*', [
            ['bbbb', 8, true], 
            ['abababbab', 18, true], 
            ['bababaab', 16, false]
        ]]
    ].forEach(([regex, data]) => 
        it('Checks acceptance for regex: ' + regex, () => {
            cy.visit('/#/dfa-from-regex')
                            
            cy.get('#regex-input').type(regex)

            cy.get('#regex-build-dfa-button').click()
            cy.get("#animate-dfa-from-regex-button").click()

            for(const instance of data) {
                const [text, numberOfSteps, isAccepted] = instance;

                cy.get("#user-input-text-for-dfa").clear()
                cy.get("#user-input-text-for-dfa").type(text)
                
                // FIXME a bit of a hack as if the text is immediately rejected e.g. if regex is a|b and text is c
                // then in progress never appears
                if (isAccepted) { 
                    cy.contains('In Progress')
                }
                for(let i = 0; i < numberOfSteps; i++) {
                    cy.get("#animate-button-next").click()
                }

                cy.contains(isAccepted ? 'Accepted' : 'Rejected')
            }
        })
    )
  })