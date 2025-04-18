/**
 * The errors for the connection.
 */
export var JitsiConnectionErrors;
(function (JitsiConnectionErrors) {
    /**
     * When the conference-request to jicofo fails.
     */
    JitsiConnectionErrors["CONFERENCE_REQUEST_FAILED"] = "connection.conferenceRequestFailed";
    /**
     * Indicates that the connection was dropped with an error which was most likely
     * caused by some networking issues. The dropped term in this context means that
     * the connection was closed unexpectedly (not on user's request).
     *
     * One example is 'item-not-found' error thrown by Prosody when the BOSH session
     * times out after 60 seconds of inactivity. On the other hand 'item-not-found'
     * could also happen when BOSH request is sent to the server with the session-id
     * that is not know to the server. But this should not happen in lib-jitsi-meet
     * case as long as the service is configured correctly (there is no bug).
     */
    JitsiConnectionErrors["CONNECTION_DROPPED_ERROR"] = "connection.droppedError";
    /**
     * Not ready error. When the conference error is not ready according to jicofo.
     */
    JitsiConnectionErrors["NOT_LIVE_ERROR"] = "connection.notLiveError";
    /**
     * Not specified errors.
     */
    JitsiConnectionErrors["OTHER_ERROR"] = "connection.otherError";
    /**
     * Indicates that a password is required in order to join the conference.
     */
    JitsiConnectionErrors["PASSWORD_REQUIRED"] = "connection.passwordRequired";
    /**
     * Indicates that the connection was dropped, because of too many 5xx HTTP
     * errors on BOSH requests.
     */
    JitsiConnectionErrors["SERVER_ERROR"] = "connection.serverError";
})(JitsiConnectionErrors || (JitsiConnectionErrors = {}));
// exported for backward compatibility
export const CONFERENCE_REQUEST_FAILED = JitsiConnectionErrors.CONFERENCE_REQUEST_FAILED;
export const CONNECTION_DROPPED_ERROR = JitsiConnectionErrors.CONNECTION_DROPPED_ERROR;
export const NOT_LIVE_ERROR = JitsiConnectionErrors.NOT_LIVE_ERROR;
export const OTHER_ERROR = JitsiConnectionErrors.OTHER_ERROR;
export const PASSWORD_REQUIRED = JitsiConnectionErrors.PASSWORD_REQUIRED;
export const SERVER_ERROR = JitsiConnectionErrors.SERVER_ERROR;
//# sourceMappingURL=JitsiConnectionErrors.js.map