/**
 * The moderator/focus responsible for direct communication with jicofo
 */
export default class Moderator extends Listenable {
    /**
     * Constructs moderator.
     * @param xmpp The xmpp.
     */
    constructor(xmpp: any);
    getNextTimeout: (reset: any) => number;
    getNextErrorTimeout: (reset: any) => number;
    options: any;
    sipGatewayEnabled: boolean;
    xmpp: any;
    connection: any;
    targetJid: any;
    targetUrl: any;
    mode: string;
    focusUserJids: Set<any>;
    /**
     * Check whether the supplied jid is a known jid for focus.
     * @param jid
     * @returns {boolean}
     */
    isFocusJid(jid: any): boolean;
    /**
     * Is sip gw enabled.
     * @returns {boolean}
     */
    isSipGatewayEnabled(): boolean;
    /**
     * Create a conference request based on the configured options and saved Settings.
     *
     * A conference request has the following format:
     * {
     *   room: "room@example.com",
     *   sessionId: "foo", // optional
     *   machineUdi: "bar", // optional
     *   identity: "baz", // optional
     *   properties: { } // map string to string
     * }
     *
     * It can be encoded in either JSON or and IQ.
     *
     * @param roomJid - The room jid for which to send conference request.
     *
     * @returns the created conference request.
     */
    _createConferenceRequest(roomJid: any): {
        properties: {
            startAudioMuted: any;
            startVideoMuted: any;
            rtcstatsEnabled: boolean;
        };
        machineUid: string;
        room: any;
    };
    /**
     * Create a conference request and encode it as an IQ.
     *
     * @param roomJid - The room jid for which to send conference request.
     */
    _createConferenceIq(roomJid: any): any;
    /**
     * Parses a conference IQ.
     * @param resultIq the result IQ that is received.
     * @returns {{properties: {}}} Returns an object with the parsed properties.
     * @private
     */
    private _parseConferenceIq;
    /**
     * Allocates the conference focus.
     * @param roomJid - The room jid for which to send conference request.
     * @returns {Promise} - Resolved when Jicofo allows to join the room. It's never
     * rejected, and it'll keep on pinging Jicofo forever.
     */
    sendConferenceRequest(roomJid: any): Promise<any>;
    conferenceRequestSent: boolean;
    /**
     * Handles success response for conference IQ.
     * @param roomJid
     * @param conferenceRequest
     * @param callback
     * @param errorCallback
     * @private
     */
    private _handleSuccess;
    /**
     * Handles error response for conference IQ.
     * @param roomJid
     * @param sessionError
     * @param notAuthorized
     * @param callback
     * @param errorCallback
     * @private
     */
    private _handleError;
    /**
     * Invoked by {@link #sendConferenceRequest} upon its request receiving an xmpp error result.
     *
     * @param roomJid - The room jid used to send conference request.
     * @param error - the error result of the request that {@link sendConferenceRequest} sent
     * @param {Function} callback - the function to be called back upon the
     * successful allocation of the conference focus
     * @param errorCallback
     */
    _handleIqError(roomJid: any, error: any, callback: Function, errorCallback: any): void;
    /**
     * Invoked by {@link #sendConferenecRequest} upon its request receiving a
     * success (i.e. non-error) result.
     *
     * @param roomJid - The room jid used to send conference request.
     * @param result - the success (i.e. non-error) result of the request that {@link #sendConferenecRequest} sent
     * @param {Function} callback - the function to be called back upon the
     * successful allocation of the conference focus
     * @param errorCallback
     */
    _handleIqSuccess(roomJid: any, result: any, callback: Function, errorCallback: any): void;
    /**
     * Authenticate by sending a conference IQ.
     * @param roomJid The room jid.
     * @returns {Promise<unknown>}
     */
    authenticate(roomJid: any): Promise<unknown>;
    /**
     * Logout by sending conference IQ.
     * @param callback
     */
    logout(callback: any): void;
}
import Listenable from '../util/Listenable';
