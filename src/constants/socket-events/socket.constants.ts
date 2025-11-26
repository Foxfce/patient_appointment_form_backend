export const PATIENT_EVENT = {
    UPDATE: 'patient:update',
    STATUS: 'patient:status',
}

export const ADMIN_EVENT = {
}

export const GENERAL_EVENT = {
    JOIN: 'join',
    LEAVE: 'leave',
    SNAPSHOT: 'patient:snapshot',
}

export enum PATIENT_STATUS {
    FILLING = 'Filling',
    SUBMIT = 'Submitted',
    INACTIVE = 'Inactive',
    IDLE = 'Idle',
}

export enum USER_ROLE {
    PATIENT = 'Patient',
    ADMIN = 'Admin',
}