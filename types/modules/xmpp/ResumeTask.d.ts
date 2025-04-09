import Strophe from 'strophe.js';
export interface INetworkInfoEvent {
    isOnline: boolean;
}
/**
 * The class contains the logic for triggering connection resume via XEP-0198 stream management.
 * It does two things, the first one is it tracks the internet online/offline status and it makes sure that
 * the reconnect is attempted only while online. The seconds thing is that it tracks the retry attempts and extends
 * the retry interval using the full jitter pattern.
 */
export default class ResumeTask {
    private _stropheConn;
    private _resumeRetryN;
    private _retryDelay;
    private _resumeTimeout;
    private _networkOnlineListener;
    /**
     * Initializes new {@code RetryTask}.
     * @param {Strophe.Connection} stropheConnection - The Strophe connection instance.
     */
    constructor(stropheConnection: Strophe.Connection);
    /**
     * @returns {number} - The amount of retries.
     */
    get retryCount(): number;
    /**
     * @returns {number|undefined} - How much the app will wait before trying to resume the XMPP connection. When
     * 'undefined' it means that no resume task was not scheduled.
     */
    get retryDelay(): number | undefined;
    /**
     * Called by {@link XmppConnection} when the connection drops and it's a signal it wants to schedule a reconnect.
     *
     * @returns {void}
     */
    schedule(): void;
    /**
     * Schedules a delayed timeout which will execute the resume action.
     * @private
     * @returns {void}
     */
    private _scheduleResume;
    /**
     * Cancels the delayed resume task.
     *
     * @private
     * @returns {void}
     */
    private _cancelResume;
    /**
     * Removes network online listener for the NETWORK_INFO_EVENT event.
     *
     * @private
     * @returns {void}
     */
    private _removeNetworkOnlineListener;
    /**
     * Resumes the XMPP connection using the stream management plugin.
     *
     * @private
     * @returns {void}
     */
    private _resumeConnection;
    /**
     * Cancels the retry task. It's called by {@link XmppConnection} when it's no longer interested in reconnecting for
     * example when the disconnect method is called.
     *
     * @returns {void}
     */
    cancel(): void;
}
