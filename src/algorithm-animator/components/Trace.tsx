interface TraceParams {
    text?: string
    current: number
    log: string[]
    state: string
}
function buildText(text: string, current: number) {
    let letters:[string, boolean][] = [];
    for (let i = 0; i < text.length; i++) {
        let pair: [string, boolean] = [text[i], false];
        if (i == current) {
            pair[1] = true;
        }
        letters.push(pair)
    }
    return letters

}
export function Trace({text, current, log, state} : TraceParams) {
    let letters: [string, boolean][] = [];

    if (text) {
        letters = buildText(text, current);
    }
    return (
        <>
        Text: aab <br/>
        {/* Word:<br/>
        {letters.map(([letter, isCurrent]) => <span className={isCurrent ? "current-letter" : ""} key={letter + isCurrent}>{letter}</span>
        )} */}
        Result: {state}
        </>
    );
}