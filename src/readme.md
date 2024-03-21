# Finite State Automaton Animator
Finite State Automaton Animator is a tool created to help students visualise how deterministic finite automata (DFAs) work. This tool supports DFA creation from user interface or by typing in a regular expression made up of basic regular expressions involving Kleene star represented by "*", union represented by "|", and parentheses "()" to overwrite the default precedence. 

The code inside "algorithm-animator" is structured as follows:

* _cypress_ folder includes the core testing code. The app is mainly tested via end-to-end tests which are all found in here

* _src/components_ folder contains the core non-page React components of the app. They encapsulate the user interface for creating and animating DFAs

* _src/helpers_ contain helper code used by React components. These include a few useful functionalities such as creating DFA transition table as well as generating all possible permutations of states to convert NFA to ε-NFA

* _src/models_ contains State and Transition object models and related interfaces

* _src/pages_ contains React components that make up the main pages of the app - DFA from UI, DFA from RegEx and Home


## Build instructions


### Requirements

[Node.js 18](https://nodejs.org/en/about/previous-releases) with `npm` (should be included with `Node.js`) are pre-requisites.

All of the commands **must** be run from a terminal at `src/algorithm-animator`
### Build steps
To install dependencies (run once):

* Run `npm install`

To run locally:

* Run `npm run dev`
* Navigate to [http://localhost:10051/algorithm-animator](http://localhost:10051/algorithm-animator)

### Test steps

Core end-to-end tests:

* To run core tests make sure to have dev version of the app running locally in a separate terminal
* Run `npx cypress run`

Additional unit tests:
* Run `npm run test`

### Deployment
The deployment is done automatically on the merge of a pull request. The deployment only happens if all end-to-end tests pass and if production build is created successfully.