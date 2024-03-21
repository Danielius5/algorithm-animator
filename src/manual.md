# User manual 	

There are three main pages in this application.

1. [Home/documentation page](https://danielius5.github.io/algorithm-animator/) provides the necessary context for users unfamiliar with the concept of DFAs. It attempts to build up knowledge from the basic building blocks of an automaton - states and transitions, to the concepts of determinism and non-determinism. Finally, it allows the user to play around with hardcoded DFA animations to see the outcomes possible when animating the DFA.

2. [Build from UI page](https://danielius5.github.io/algorithm-animator/#/dfa-from-ui) allows the user to build a finite-state automaton via using a user interface. The user can do that via the side panel or by clicking on a canvas. Left click on an empty space in canvas will create a non-accepting state, right click will create an accepting state, left click on two states will create a transition between them and right click on a state will delete it. Created DFAs can be animated with custom sequences. If a created automaton is non-deterministic, it will first get converted to deterministic.

3. [Build from RegEx page](https://danielius5.github.io/algorithm-animator/#/dfa-from-regex) allows user to enter a custom regular expression to build a corresponding DFA. This tool supports basic regular expressions involving Kleene star represented by "*", union represented by "|", and parentheses "()" to overwrite the default precedence. Any other character will be treated like a matched character. Escaping is not yet supported. Example regular expressions:
    1. (a|ba*ba*)* - accepts a sequence with an even number of “b”, i.e., {a, bb, abb, ababa, . . . }
    2. 0|1(0|1)* - accepts binary numbers with no leading zeros - {0, 1, 10, 11, ...}
    3. 0*1*2*3*4*5*6*7*8*9* - allows sequences with non-decreasing digits - {0,01,0011,00123,...}

    Regular expressions will get converted to DFAs which can then be animated with custom sequences.
