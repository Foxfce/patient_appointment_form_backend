import { GENERAL_EVENT, PATIENT_STATUS, USER_ROLE } from "../constants/socket-events/socket.constants.js";
import { io } from "../server.js";

export type sessionId = string;
export type socketId = string ;

export type patientData = {
    lastUpdated: number,
    status: PATIENT_STATUS,
};

// In Memory store for testing
export const sessions = new Map<sessionId, patientData>();
export const currentSessions = new Map<socketId, {sessionId: sessionId, status : PATIENT_STATUS}>();


const MAX_SESSIONS = 60;

export function trimSessions() {
    // Trim currentSessions
    while (currentSessions.size > MAX_SESSIONS) {
        const oldestKey = currentSessions.keys().next().value; 
        currentSessions.delete(oldestKey);
    }

    // Trim sessions (if you want this too)
    while (sessions.size > MAX_SESSIONS) {
        const oldestKey = sessions.keys().next().value;
        sessions.delete(oldestKey);
    }

    // Emit updated list to admin
    const arrAllSession = Array.from(currentSessions.values());
    io.to(USER_ROLE.ADMIN).emit(GENERAL_EVENT.UPDATE_SESSION, arrAllSession);
}