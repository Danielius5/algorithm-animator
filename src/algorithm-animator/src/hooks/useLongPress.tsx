import { useRef, useState } from "react";

type PRESS_TYPE = "short" | "long";

interface UseLongPressProps {
    doOnShortPress: (e: Event) => void
    doOnLongPress: (e:Event) => void
}

export function useLongPress({ doOnLongPress, doOnShortPress }: UseLongPressProps) {
    const [pressType, setPressType] = useState<PRESS_TYPE | null>(null);

    const timerRef = useRef<NodeJS.Timeout>();
    const isLongPress = useRef<boolean>();

    function handleOnMouseDown(e: Event) {
        isLongPress.current = false;
        timerRef.current = setTimeout(() => {
            isLongPress.current = true
            doOnLongPress(e);
        }, 500)
    }

    function handleOnMouseUp(e: Event) {
        clearTimeout(timerRef.current);
        if (!isLongPress.current) {
            doOnShortPress(e);
        }
    }
    return {
        handlers: {
            onMouseDown: handleOnMouseDown,
            onMouseUp: handleOnMouseUp,
        }
    }
}