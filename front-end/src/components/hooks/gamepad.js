import {useState, useEffect, useMemo} from 'react';
import usePrevious from "./previous";

/**
 * Gets the input from the first connected gamepad.
 * @returns {{RT: boolean, select: boolean, buttonX: boolean, buttonY: boolean, LT: boolean, start: boolean, joystick: number[], right: boolean, buttonA: boolean, down: boolean, joystickRight: number[], connected: boolean, RB: boolean, buttonB: boolean, left: boolean, LB: boolean, up: boolean}}
 */
export function useGamepad() {
    const [gamepadInfo, setGamepadInfo] = useState({ connected: false, buttonA: false, buttonB :false, buttonX: false, buttonY:false, joystick: [0, 0], joystickRight : [0,0], RB: false, LB: false, RT: false, LT: false, start: false, select: false, up: false, down: false, left: false, right: false});

    // Function to update gamepad state
    const updateGamepadState = () => {
        const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
        const gamepad = gamepads[0]; // Assuming the first gamepad

        if (gamepad) {
            const newGamepadInfo = {
                connected: true,
                buttonA: gamepad.buttons[0].pressed,
                buttonB: gamepad.buttons[1].pressed,
                buttonX: gamepad.buttons[2].pressed,
                buttonY: gamepad.buttons[3].pressed,
                joystickRight: [gamepad.axes[2], gamepad.axes[3]],
                LT: gamepad.buttons[6].pressed,
                RT: gamepad.buttons[7].pressed,
                LB: gamepad.buttons[4].pressed,
                RB: gamepad.buttons[5].pressed,

                start: gamepad.buttons[9].pressed,
                select: gamepad.buttons[8].pressed,
                up: gamepad.buttons[12].pressed,
                down: gamepad.buttons[13].pressed,
                left: gamepad.buttons[14].pressed,
                right: gamepad.buttons[15].pressed,
                joystick: [gamepad.axes[0], gamepad.axes[1]]
            };

            // Update state only if there's a change
            if (JSON.stringify(newGamepadInfo) !== JSON.stringify(gamepadInfo)) {
                setGamepadInfo(newGamepadInfo);
            }
        } else {
            if (gamepadInfo.connected) {
                setGamepadInfo({ connected: false, buttonA: false, buttonB :false, buttonX: false, buttonY:false, joystick: [0, 0], joystickRight : [0,0], RB: false, LB: false, RT: false, LT: false, start: false, select: false, up: false, down: false, left: false, right: false});
            }
        }
    };

    useEffect(() => {
        const gamepadConnected = () => {
            updateGamepadState();
        };

        const gamepadDisconnected = () => {
            setGamepadInfo({ connected : false, buttonA: false, buttonB :false, buttonX: false, buttonY:false, joystick: [0, 0], joystickRight : [0,0], RB: false, LB: false, RT: false, LT: false, start: false, select: false, up: false, down: false, left: false, right: false});
        };

        window.addEventListener('gamepadconnected', gamepadConnected);
        window.addEventListener('gamepaddisconnected', gamepadDisconnected);

        const interval = setInterval(updateGamepadState, 100);

        return () => {
            window.removeEventListener('gamepadconnected', gamepadConnected);
            window.removeEventListener('gamepaddisconnected', gamepadDisconnected);
            clearInterval(interval);
        };
    }, [gamepadInfo]);

    return gamepadInfo;
}

/**
 * Rounds an axis' value with a dead zone of 0.1 around the 0.
 * @param value The value to round.
 * @returns {number} -1, 0 or 1.
 */
export function discretizeAxis(value) {
    if (value > -0.1 && value < 0.1) {
        return 0;
    } else if (value <= -0.1) {
        return -1;
    } else {
        return 1;
    }
}