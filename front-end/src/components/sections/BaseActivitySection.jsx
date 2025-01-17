import * as React from 'react';
import { useNavigate } from "react-router-dom";
// Images
import {useGamepad, usePressEffect} from "../hooks/gamepad";
import {useEffect, useRef, useState} from "react";
import Panel from "../common/Panel.jsx";
import {L1} from "../common/icons/TextButton.jsx";

/**
 * The base activity section component.
 * @param caption The caption of the section.
 * @param children The children.
 * @param backPath The path to navigate back to.
 * @param backTimeout The timeout until the back button is active.
 * @constructor
 */
export default function BaseActivitySection({ caption, children, backPath, backTimeout = 1000 }) {
    const navigate = useNavigate();
    const { LT, LB } = useGamepad();
    const ref = useRef();
    const refBack = useRef();

    ref.current = () => {
        navigate("/");
    }
    refBack.current = () => {
        if (backPath) navigate(backPath);
    }

    usePressEffect(LT, 500, ref);
    usePressEffect(LB, backTimeout, refBack, 1000);

    return <Panel style={{position: "absolute", left: "48px", right: "48px", bottom: "208px", top: "288px"}}>
        <div className="text-red" style={{position: "absolute", left: "48px"}}>Press <L1/> to leave</div>
        <div className="text-soft text-bigger" style={{position: "absolute", top: "48px", left: "50%", transform: "translateX(-50%)"}}>{caption}</div>
        <div className="text-soft text-bigger" style={{position: "absolute", left: 0, top: 0, right: 0, bottom: 0}}>
            {children}
        </div>
    </Panel>;
}