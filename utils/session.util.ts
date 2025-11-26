import { PATIENT_STATUS } from "../constants/socket-events/socket.constants";

export type sessionId = string;

export type patientData = {
    lastUpdated: number,
    status: PATIENT_STATUS,
};

// In Memory store for testing
export const sessions = new Map<sessionId, patientData>();