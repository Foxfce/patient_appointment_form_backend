import express from 'express';
import http from 'node:http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import {
    ADMIN_EVENT,
    GENERAL_EVENT,
    PATIENT_EVENT,
    PATIENT_STATUS,
    USER_ROLE,
} from './constants/socket-events/socket.constants.js';
import { patientData, sessions } from './utils/session.util.js';
import { sessionTimers, setIdleTimer } from './utils/idleTimer.util.js';

dotenv.config();

const app = express();
const server = http.createServer(app);


const io = new Server(server, {
    cors: {
        origin: '*', // **replace with vercel domain later**
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    console.log('socket connected :', socket.id);

    // Handle join session room
    socket.on(GENERAL_EVENT.JOIN, ({ sessionId, role }) => {
        socket.join(sessionId);
        socket.data.role = role;
        socket.data.sessionId = sessionId;
        console.log(`${socket.id} joined ${sessionId} as ${role}`);

        // Send current snapshot to newly joined staff
        if (role === USER_ROLE.ADMIN) {
            const snapshot = sessions.get(sessionId) || null;
            socket.emit(GENERAL_EVENT.SNAPSHOT, snapshot);
        }

        if (role === USER_ROLE.PATIENT) {

        }
    });

    // Handle patient update form
    socket.on(PATIENT_EVENT.UPDATE, ({ sessionId, payload }) => {
        // Updating to ram
        const now = Date.now();
        const prev = sessions.get(sessionId) || {};
        const newState: patientData = {
            ...prev,
            ...payload,
            lastUpdated: now,
        };

        sessions.set(sessionId, newState);

        socket.to(sessionId).emit(PATIENT_EVENT.UPDATE, newState);
    });

    // Handle patient submitting the form
    socket.on(PATIENT_EVENT.STATUS, ({ sessionId, status }) => {
        const prev = sessions.get(sessionId) || {};
        console.log(status);
        // console.log(prev);

        const newState: patientData = {
            ...prev,
            status,
            lastUpdated: Date.now()
        };
        sessions.set(sessionId, newState);
        socket.to(sessionId).emit(PATIENT_EVENT.STATUS, { status, lastUpdated: newState.lastUpdated });

        // Reset timer each filling event
        if (status === PATIENT_STATUS.FILLING) {
            setIdleTimer(sessionId, socket);
        }

        // Remove timer when submitted
        if (status === PATIENT_STATUS.SUBMIT) {
            if (sessionTimers.has(sessionId)) {
                clearTimeout(sessionTimers.get(sessionId));
                sessionTimers.delete(sessionId);
            }
        }
    });

    // socket.on(PATIENT_EVENT.)

    socket.on('disconnect', () => {
        console.log('socket disconnect', socket.id);
        const role = socket.data.role;
        const sessionId = socket.data.sessionId;

        if (role === USER_ROLE.PATIENT) {
            const prev = sessions.get(sessionId);
            if (prev?.status === PATIENT_STATUS.SUBMIT) return;
            const newState: patientData = {
                ...prev,
                status: PATIENT_STATUS.INACTIVE,
                lastUpdated: Date.now()
            }
            sessions.set(sessionId, newState);
            io.to(sessionId).emit(PATIENT_EVENT.STATUS, { status: newState.status, lastUpdated: newState.lastUpdated });
        }
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on ${PORT}`));
