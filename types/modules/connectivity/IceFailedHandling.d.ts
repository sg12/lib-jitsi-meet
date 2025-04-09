import JitsiConference from '../../JitsiConference';
/**
 * This class deals with shenanigans around JVB media session's ICE failed status handling.
 *
 * If ICE connection is not re-established within 2 secs after the internet comes back online, the client will initiate
 * a session restart via 'session-terminate'. This results in Jicofo re-inviting the participant into the conference by
 * recreating the jvb media session so that there is minimla disruption to the user by default. However, if the
 * 'enableForcedReload' option is set in config.js, the conference will be forcefully reloaded.
 */
export default class IceFailedHandling {
    private _conference;
    private _canceled;
    private _iceFailedTimeout?;
    /**
     * Creates new {@code DelayedIceFailed} task.
     * @param {JitsiConference} conference
     */
    constructor(conference: JitsiConference);
    /**
     * After making sure there's no way for the ICE connection to recover this method either sends ICE failed
     * notification to Jicofo or emits the ice failed conference event.
     * @private
     * @returns {void}
     */
    _actOnIceFailed(): void;
    /**
     * Starts the task.
     * @returns {void}
     */
    start(): void;
    /**
     * Cancels the task.
     * @returns {void}
     */
    cancel(): void;
}
