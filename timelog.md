# Timelog

* PROJECT NAME
* YOUR NAME
* STUDENT_ID
* SUPERVISOR NAME

## Guidance

* This file contains the time log for your project. It will be submitted along with your final dissertation.
* **YOU MUST KEEP THIS UP TO DATE AND UNDER VERSION CONTROL.**
* This timelog should be filled out honestly, regularly (daily) and accurately. It is for *your* benefit.
* Follow the structure provided, grouping time by weeks.  Quantise time to the half hour.

## Week 1

### 20 Sep 2023

* *1.5 hour* Set up pre-commit githook to remind me update timelog on every commit

### 21 Sep 2023

* *1.0 hour* Read Algorithmics 1 slides and other online materials about DFA's and redo exercises from Algorithmics 1
* *3.0 hours* Experimented building a static DFA using Cytoscape JS.
* *1.0 hours* Experimented building a static DFA using Sigma.js
* *0.5 hours* Experimented building a static DFA using React Flow
* *1.0 hours* Experimented building a static DFA using Mermaid JS
* *0.5 hours* Added Mermaid JS to a new React project
* *2.5 hours* Read about converting regular expressions to DFA and started trying to implement an algorithm to build a syntax tree out of regex
* *1.0 hours* Wrote weekly report

### 4 Oct 2023
* *1.0 hour* Try to do first  steps on converting regex to syntax tree
* *5.0 hour* Developed a basic UI to create a DFA

### 13 Oct 2023
* *1.0 hour* Change styles to flexbox, get rid of input for state name 
* *5.0 hours* Made it possible to build graph from UI and animate in a basic way (emphasising states and transitions) as well as showed whether the hardcoded text was accepted or rejected
* *3.0 hours* Started working on converting regex to ∈-NFA. Basic regex (no parentheses, "or" with only one char) can be converted to NFA.

### 24 Oct 2023
* *15.0 hours* Past weeks worked on converting regex to ∈-NFA. Unfortunately I did not commit as the solution was always half-working. Now it seems reasonably well-behaved and I want this state as backup.
* *3.0 hours* Looked at algorithm to convert ∈-NFA to DFA as well as tried to improve animation (work in progress)
* *1.0 hours* Implemented ∈-NFA transition table
* *5.0 hours* Implemented DFA transition table and built DFA
* *0.5 hours* Added empty set symbol

### 9 Nov 2023
* *1.5 hours* Corrected bug of multiple branches with the same characted for failing state for "ab*"

### 10 Nov 2023
* *3 hours* Fixed priority of operations, fixed a bug where ac|ab* worker where ab*|ac did not]
* *2 hours* Connected basic UI with animation
* *2 hours* Improved animation of text going through DFA

### 17 Nov 2023
* *4 hours* Allow animation from RegEx, fix bugs (aa* having disattached failing state, all DFA's having epsilon transition at the beginning, etc.)
* *0.5 hours* Check if user input UI is deterministic or not

### 30 Nov 2023
* *3 hours* Adding react bootstrap and recognision of DFA / NDFA from UI

### 6 Dec 2023
* *2 hours* Refactor code, change NextJS to Vite
* *1.5 hour* Further cleanup

### 7 Dec 2023
* *0.5 hours* Set up basic github workflow for deploying to pages
* *1.0 hour* Fix deployment, routing, have website page deployed properly.
* *3.0 hours* Add e2e tests that run locally (time corrected as 2.0 hours was wrong)

### 8 Dec 2023
* *0.5 hours* Read about dependabot, set up dependabot
* *1.5 hours* Cosmetic fix of merging multiple transitions between identical states into one, also dont allow identical transitions

### 10 Dec 2023
* *3.0 hours* Fix deleting of edges, add UI e2e tests, fix unhandled errors 
* *3.0 hours* Find a way to allow creating edges by clicking on nodes and entering the character to match

### 11 Dec 2023
* *0.5 hours* Improve stability of edge creation via clicks on states, sort error that allows creating edge without character 
* *1.5 hours* Allow deletions via clicks 

## 12 Dec 2023
* *4 hours* Allow NFA -> ∈-NFA conversion from user input

## 23 Dec 2023
* *3.5 hours* Experimenting / Improving UI 

## 25 Dec 2023
* *4 hours* Further improving UI / wrestling with routing...