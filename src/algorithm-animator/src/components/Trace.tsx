
export enum AnimationState {
    ACCEPTED, REJECTED, IN_PROGRESS
}

const getColor = (animationState: AnimationState) => {
    if (animationState == AnimationState.ACCEPTED) {
        return "green"
    }
    if (animationState == AnimationState.REJECTED) {
        return "red"
    }
}

const getResult = (animationState: AnimationState) => {
    if (animationState == AnimationState.ACCEPTED) {
        return "Accepted"
    }
    if (animationState == AnimationState.REJECTED) {
        return "Rejected"
    }
    if (animationState == AnimationState.IN_PROGRESS) {
        return "In Progress"
    }
}

interface TraceParams {
    text?: string
    current: number
    log: string[]
    state: AnimationState
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
    return (
        <>
            <h3>
                Text:
                {letters.map(([letter, isCurrent], i) => <span className={isCurrent ? "current-letter" : ""} key={letter + isCurrent + i}>{letter}</span>
                )}
            </h3>
            <h3>
                Result: <span style={{color: getColor(state)}}>{getResult(state)}</span>
            </h3>
        </>
    );
}