import {forwardRef, useCallback, useEffect, useRef, useState} from "react";
import Panel from "./Panel.jsx";
import {R1} from "./icons/TextButton.jsx";
import * as React from "react";
import {useGamepad, usePressEffect} from "../hooks/gamepad";

function VirtualKeyboardLayout({append, backspace, confirm, cancel}) {
    return <></>;
}

/**
 * Replaces a string with all asterisks except for the last character,
 * which is plain text.
 * @param v The value to secretize.
 * @returns {string} The secretized string.
 */
function secretize(v) {
    if (!v.length) {
        return "";
    } else {
        let chars = "";
        let l_ = v.length - 1;
        for(let i = 0; i < l_; i++) chars += "*";
        return chars + v[l_];
    }
}

/**
 * This is a virtual keyboard. It is triggered on a
 * @param fieldCaption The caption for the field, so the user knows what
 * are they editing.
 * @param value The initial value of the field (always a string).
 * @param onChange A callback that will be triggered when the value is
 * confirmed by the user.
 * @constructor
 */
export default forwardRef(({backTimeout = 1000}, ref) => {
    const [caption, setCaption] = useState("");
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");
    const [onChange, setOnChange] = useState({callback: null});
    const [isSecret, setIsSecret] = useState(false);
    const [closeReady, setCloseReady] = useState(false);
    const { RT } = useGamepad();
    const append = useCallback((chr) => {
        setValue(value + chr);
    }, [value, setValue]);
    const backspace = useCallback(() => {
        setValue(value.length ? value.substring(0, value.length - 1) : "");
    }, [value, setValue]);
    const confirm = useCallback(() => {
        try {
            onChange.callback(value);
        } catch {}
        setOpen(false);
    }, [value, onChange]);
    const cancel = useCallback(() => {
        // Closes the virtual keyboard, cancelling.
        setOpen(false);
    }, [setOpen]);
    const refClose = useRef();
    refClose.current = () => {
        if (closeReady) {
            setOpen(false);
        }
    }
    usePressEffect(RT, 500, refClose);
    useEffect(() => {
        setTimeout(() => setCloseReady(true), backTimeout);
    }, []);

    if (ref) {
        // The `ref` must set an object with methods such as:
        // - open(caption, isSecret, value, onChange) -> Opens the object for a component and its value.
        // - cancel() -> Cancels the edition.
        //
        // Confirming the keyboard will NOT be available by the red.
        ref.current = {
            open: (caption, isSecret, value, onChange) => {
                // Opens the virtual keyboard. Sets an initial value
                // and tracks a callback.
                setCaption(caption);
                setIsSecret(isSecret);
                setValue(value);
                setOnChange({callback: () => { onChange(value) }})
                setOpen(true);
            },
            cancel
        }
    }

    // Rendering the actual keyboard layout for good.
    if (!open) {
        return <></>;
    } else {
        return <Panel style={{position: "absolute", left: "48px", right: "48px", bottom: "208px", top: "288px"}}>
            <div className="text-blue" style={{position: "absolute", right: "48px"}}>Press <R1/> to leave</div>
            <div className="text-soft" style={{
                position: "absolute",
                top: "48px",
                left: "50%",
                transform: "translateX(-50%)",
                fontSize: "20px"
            }}>Editing: {caption}</div>

            <Panel style={{
                position: "absolute",
                top: "96px",
                left: "50%",
                width: "400px",
                transform: "translateX(-50%)"
            }}>
                <input type="text" value={isSecret ? secretize(value) : value}
                       style={{width: "100%", fontSize: "20px"}} />
            </Panel>
            <VirtualKeyboardLayout confirm={confirm} cancel={cancel}
                                   append={append} backspace={backspace} />
        </Panel>;
    }
});