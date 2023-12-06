interface TraceParams {
    text?: string
    current: number
    log: string[]
    state: string
}
function buildText(text: string, current: number) {
    const letters:[string, boolean][] = [];
    for (let i = 0; i < text.length; i++) {
        const pair: [string, boolean] = [text[i], false];
        if (i == current) {
            pair[1] = true;
        }
        letters.push(pair)
    }
    return letters

}
export function Trace({text, current, state} : TraceParams) {
    let letters: [string, boolean][] = [];
    const textWithEmpty = " " + text
    if (text) {
        letters = buildText(textWithEmpty, current);
    }
    console.log(letters)
    return (
        <>
            <br/>
            Text:
            {letters.map(([letter, isCurrent], i) => <span className={isCurrent ? "current-letter" : ""} key={letter + isCurrent + i}>{letter}</span>
            )}
            <br/>
            Result: {state}
        </>
    );
}