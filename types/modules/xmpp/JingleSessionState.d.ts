export declare enum JingleSessionState {
    /**
     * The active Jingle session state as defined in XEP-0166
     * (after 'session-invite'/'session-accept').
     */
    ACTIVE = "active",
    /**
     * The ended Jingle session state as defined in XEP-0166
     * (after 'session-terminate').
     */
    ENDED = "ended",
    /**
     * The pending Jingle session state which means the session as defined in
     * XEP-0166(before 'session-invite/session-accept' took place).
     */
    PENDING = "pending"
}
export declare const PENDING = JingleSessionState.PENDING;
export declare const ACTIVE = JingleSessionState.ACTIVE;
export declare const ENDED = JingleSessionState.ENDED;
