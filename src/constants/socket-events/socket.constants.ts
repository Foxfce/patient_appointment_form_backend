export const PATIENT_EVENT = {
    UPDATE: 'patient:update',
    STATUS: 'patient:status',
    STATUS_CARD: 'patient:status-card'
}

export const ADMIN_EVENT = {
    REQUEST_SESSION_LIST: 'admin:request-sessions-list',
    REQUEST_SESSION: 'admin:request-session'
}

export const GENERAL_EVENT = {
    JOIN: 'join',
    LEAVE: 'leave',
    SNAPSHOT: 'patient:snapshot',
    UPDATE_SESSION: 'update:session',
}

export enum PATIENT_STATUS {
    ACTIVE='Active',
    FILLING = 'Filling',
    SUBMIT = 'Submitted',
    IDLE = 'Idle',
    INACTIVE = 'Inactive',
}

export enum USER_ROLE {
    PATIENT = 'Patient',
    ADMIN = 'Admin',
}