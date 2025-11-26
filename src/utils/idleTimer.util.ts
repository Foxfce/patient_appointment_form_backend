import { PATIENT_EVENT, PATIENT_STATUS } from "../constants/socket-events/socket.constants.js";
import { patientData, sessions } from "./session.util.js";

const IDLE_TIMEOUT_SECOND = 10 * 1000;
export const sessionTimers = new Map<string, NodeJS.Timeout>();

export const setIdleTimer = (sessionId: string, socket: any) => {
    if (sessionTimers.has(sessionId)) {
        clearTimeout(sessionTimers.get(sessionId));
    }

    const timer = setTimeout(() => {
        const prev = sessions.get(sessionId) || ({} as patientData);
        const newState: patientData = {
            ...prev,
            status: PATIENT_STATUS.IDLE,
            lastUpdated: Date.now()
        };
        sessions.set(sessionId, newState);
        socket.to(sessionId).emit(PATIENT_EVENT.STATUS, { 
            status: PATIENT_STATUS.IDLE, 
            lastUpdated: newState.lastUpdated 
        });

        console.log(`[IDLE] Session ${sessionId} timed out and set to IDLE.`);
        sessionTimers.delete(sessionId);
    }, IDLE_TIMEOUT_SECOND);

    sessionTimers.set(sessionId, timer);
};