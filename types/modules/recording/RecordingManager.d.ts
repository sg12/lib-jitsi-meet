import ChatRoom from '../xmpp/ChatRoom';
import JibriSession from './JibriSession';
export interface IRecordingOptions {
    appData?: string;
    broadcastId?: string;
    mode: string;
    streamId?: string;
}
/**
 * A class responsible for starting and stopping recording sessions and emitting
 * state updates for them.
 */
declare class RecordingManager {
    private _sessions;
    private _chatRoom;
    /**
     * Initialize {@code RecordingManager} with other objects that are necessary
     * for starting a recording.
     *
     * @param {ChatRoom} chatRoom - The chat room to handle.
     * @returns {void}
     */
    constructor(chatRoom: ChatRoom);
    /**
     * Finds an existing recording session by session ID.
     *
     * @param {string} sessionID - The session ID associated with the recording.
     * @returns {JibriSession|undefined}
     */
    getSession(sessionID: string): JibriSession | undefined;
    /**
     * Find a session with a specific jibri JID.
     *
     * @param {string} jibriJid the JID to search for.
     * @returns
     */
    getSessionByJibriJid(jibriJid: string): JibriSession | undefined;
    /**
     * Callback to invoke to parse through a presence update to find recording
     * related updates (from Jibri participant doing the recording and the
     * focus which controls recording).
     *
     * @param {Object} event - The presence data from the pubsub event.
     * @param {Node} event.presence - An XMPP presence update.
     * @param {boolean} event.fromHiddenDomain - Whether or not the update comes
     * from a participant that is trusted but not visible, as would be the case
     * with the Jibri recorder participant.
     * @returns {void}
     */
    onPresence({ fromHiddenDomain, presence }: {
        fromHiddenDomain: boolean;
        presence: Node;
    }): void;
    /**
     * Handle a participant leaving the room.
     * @param {string} jid the JID of the participant that left.
     */
    onMemberLeft(jid: string): void;
    /**
     * Start a recording session.
     *
     * @param {Object} options - Configuration for the recording.
     * @param {string} [options.appData] - Data specific to the app/service that
     * the result file will be uploaded.
     * @param {string} [optional] options.broadcastId - The channel on which a
     * live stream will occur.
     * @param {string} options.mode - The mode in which recording should be
     * started. Recognized values are "file" and "stream".
     * @param {string} [optional] options.streamId - The stream key to be used
     * for live stream broadcasting. Required for live streaming.
     * @returns {Promise} A promise for starting a recording, which will pass
     * back the session on success. The promise resolves after receiving an
     * acknowledgment of the start request success or fail.
     */
    startRecording(options: IRecordingOptions): Promise<JibriSession>;
    /**
     * Stop a recording session.
     *
     * @param {string} sessionID - The ID associated with the recording session
     * to be stopped.
     * @returns {Promise} The promise resolves after receiving an
     * acknowledgment of the stop request success or fail.
     */
    stopRecording(sessionID: string): Promise<any>;
    /**
     * Stores a reference to the passed in JibriSession.
     *
     * @param {string} session - The JibriSession instance to store.
     * @returns {void}
     */
    _addSession(session: JibriSession): void;
    /**
     * Create a new instance of a recording session and stores a reference to
     * it.
     *
     * @param {string} sessionID - The session ID of the recording in progress.
     * @param {string} status - The current status of the recording session.
     * @param {string} mode - The recording mode of the session.
     * @returns {JibriSession}
     */
    _createSession(sessionID: string, status: string, mode: string): JibriSession;
    /**
     * Notifies listeners of an update to a recording session.
     *
     * @param {JibriSession} session - The session that has been updated.
     * @param {string|undefined} initiator - The jid of the initiator of the update.
     */
    _emitSessionUpdate(session: JibriSession, initiator?: string): void;
    /**
     * Parses presence to update an existing JibriSession or to create a new
     * JibriSession.
     *
     * @param {Node} presence - An XMPP presence update.
     * @returns {void}
     */
    _handleFocusPresence(presence: Node): void;
    /**
     * Handles updates from the Jibri which can broadcast a YouTube URL that
     * needs to be updated in a JibriSession.
     *
     * @param {Node} presence - An XMPP presence update.
     * @returns {void}
     */
    _handleJibriPresence(presence: any): void;
}
export default RecordingManager;
