# Design decisions (UI/UX)

- Use responsive grid layout (Tailwind grid-cols-1 md:grid-cols-3) so forms compress to single column on mobile and multiple columns on desktop.

- Keep patient form minimal: group name fields on top, contact info next, demographics next. Use large touch targets and clear labels.

- Staff View: left sidebar (session selector + status) and main panel with read-only key fields. Use color-coded status badges: green (active), amber (idle), blue (submitted).

- Accessibility: labels, aria-live region on staff page to announce incoming updates.

## Component Architecture

- PatientForm — handles UI + react-hook-form + emits socket events.

- StaffView — displays live snapshot, handles status badges and field highlights.

- SocketProvider (optional) — context provider to reuse a single socket instance across pages.

## Real-Time Flow

- On mount, client joins room.

- Patient: emits patient:update for field changes. Emitting is debounced and includes sessionId. Server updates snapshot and broadcasts to room.

- Staff: when joining, server sends patient:snapshot. After that staff receives patient:update and patient:status live.