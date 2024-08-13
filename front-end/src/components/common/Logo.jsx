import * as React from 'react';
import full from "../../images/full.png";

export default function Logo() {
    return <img src={full} alt="Logo" style={{
        position: "absolute", left: "50%", top: "0",
        transform: "translate(-50%, -25%) scale(0.5, 0.5)"
    }} />
}