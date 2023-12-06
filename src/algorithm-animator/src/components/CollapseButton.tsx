import { Dispatch, SetStateAction } from "react";
import { Button } from "react-bootstrap";


interface CollapseButtonProps {
    isVisible: boolean
    setIsVisible: Dispatch<SetStateAction<boolean>>
    ariaControls: string
}
export function CollapseButton({isVisible, setIsVisible, ariaControls}: CollapseButtonProps) {
    return (
        <Button
        onClick={() => setIsVisible(!isVisible)}
        aria-controls={ariaControls}
        aria-expanded={isVisible}
        variant="secondary"
        size="sm"
    >
        {isVisible ? "Collapse" : "Expand"}
    </Button>
    )
}