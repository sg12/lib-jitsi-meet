import JitsiParticipant from '../../JitsiParticipant';
export interface IJibriSessionOptions {
    connection?: any;
    focusMucJid?: string;
    mode?: string;
    sessionID?: string;
    status?: string;
}
export interface IStartOptions {
    appData?: string;
    broadcastId?: string;
    focusMucJid: string;
    streamId?: string;
}
export interface IStopOptions {
    focusMucJid: string;
}
export interface IQOptions {
    action?: 'start' | 'stop';
    appData?: string;
    broadcastId?: string;
    focusMucJid: string;
    streamId?: string;
}
/**
 * Represents a recording session.
 */
export default class JibriSession {
    private _connection?;
    private _mode?;
    private _jibriJid;
    private _statusFromJicofo;
    private _sessionID?;
    private _status?;
    private _error?;
    private _liveStreamViewURL?;
    private _initiator?;
    private _terminator?;
    private _focusMucJid?;
    /**
     * Initializes a new JibriSession instance.
     *
     * @constructor
     */
    constructor(options?: IJibriSessionOptions);
    /**
     * Returns the error related to the session instance, if any.
     *
     * @returns {string|undefined}
     */
    getError(): string | undefined;
    /**
     * Returns the session ID of the session instance.
     *
     * @returns {string|undefined}
     */
    getID(): string | undefined;
    /**
     * Returns the initiator of the session instance.
     *
     * @returns {JitsiParticipant|string} The participant that started the session.
     */
    getInitiator(): JitsiParticipant | string;
    /**
     * Returns the streaming URL of the session.
     *
     * @returns {string|undefined}
     */
    getLiveStreamViewURL(): string | undefined;
    /**
     * Returns the current status of the session.
     *
     * @returns {string|undefined}
     */
    getStatus(): string | undefined;
    /**
     * @returns {string|undefined} the JID of jibri associated with this session.
     */
    getJibriJid(): string | undefined;
    /**
     * Returns the jid of the participant that stopped the session.
     *
     * @returns {JitsiParticipant|string} The participant that stopped the session.
     */
    getTerminator(): JitsiParticipant | string;
    /**
     * Returns the current recording mode of the session, such as "file".
     *
     * @returns {string}
     */
    getMode(): string;
    /**
     * Sets the last known error message related to the session.
     *
     * @param {string} error - The error string explaining why the session
     * entered an error state.
     * @returns {void}
     */
    setError(error: string): void;
    /**
     * Sets the last live stream URL for the session instance. Usually this is
     * a YouTube URL and usually this is only set for "stream" sessions.
     *
     * @param {string} url - The live stream URL associated with the session.
     * @returns {void}
     */
    setLiveStreamViewURL(url: string): void;
    /**
     * Sets the last known status for this recording session.
     *
     * @param {string} status - The new status to set.
     * @returns {void}
     */
    setStatus(status?: string): void;
    /**
     * Set the session status reported by jicofo. If a jibri is present in the room,
     * the status is always 'on'. Otherwise, we fallback to the status reported by jicofo.
     *
     * @param {string} status
     */
    setStatusFromJicofo(status: string): void;
    /**
     * Set the JID of the jibri associated with this session.
     *
     * @param {*} jibriJid
     */
    setJibriJid(jibriJid: string | null): void;
    /**
     * Sets the participant that started the session.
     * @param {JitsiParticipant | string} participant - The participant or resource id
     * if local participant.
     */
    setInitiator(participant: JitsiParticipant | string): void;
    /**
     * Sets the participant that stopped the session.
     * @param {JitsiParticipant | string} participant - The participant or the resource id
     * if local participant.
     */
    setTerminator(participant: JitsiParticipant | string): void;
    /**
     * Sends a message to start the actual recording.
     *
     * @param {Object} options - Additional arguments for starting the
     * recording.
     * @param {string} [options.appData] - Data specific to the app/service that
     * the result file will be uploaded.
     * @param {string} [options.broadcastId] - The broadcast ID of an
     * associated YouTube stream, used for knowing the URL from which the stream
     * can be viewed.
     * @param {string} options.focusMucJid - The JID of the focus participant
     * that controls recording.
     * @param {streamId} options.streamId - Necessary for live streaming, this
     * is the stream key needed to start a live streaming session with the
     * streaming service provider.
     * @returns Promise
     */
    start({ appData, broadcastId, focusMucJid, streamId }: IStartOptions): Promise<void>;
    /**
     * Sends a message to actually stop the recording session.
     *
     * @param {Object} options - Additional arguments for stopping the
     * recording.
     * @param {Object} options.focusMucJid - The JID of the focus participant
     * that controls recording.
     * @returns Promise
     */
    stop({ focusMucJid }: IStopOptions): Promise<any>;
    /**
     * Generates the message to change the status of the recording session.
     *
     * @param {string} [options.action] - The action to set the IQ
     * @param {string} [options.appData] - Data specific to the app/service that
     * the result file will be uploaded.
     * @param {string} [options.broadcastId] - The broadcast ID of an
     * associated YouTube stream, used for knowing the URL from which the stream
     * can be viewed.
     * @param {string} options.focusMucJid - The JID of the focus participant
     * that controls recording.
     * @param {streamId} options.streamId - Necessary for live streaming, this
     * is the stream key needed to start a live streaming session with the
     * streaming service provider.
     * @returns Object - The XMPP IQ message.
     */
    _createIQ({ action, appData, broadcastId, focusMucJid, streamId }: IQOptions): any;
    /**
     * Handles the error from an iq and stores the error.
     *
     * @param {Node} errorIq - The error response from an Iq.
     * @private
     * @returns {void}
     */
    _setErrorFromIq(errorIq: any): void;
    /**
     * Sets the known session ID for this recording session.
     *
     * @param {string} sessionID
     * @private
     * @returns {void}
     */
    _setSessionID(sessionID?: string): void;
}
