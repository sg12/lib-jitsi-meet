export const SOURCE_INFO_PRESENCE_ELEMENT: "SourceInfo";
/**
 * Default XMPP implementation of the {@link SignalingLayer} interface. Obtains
 * the data from the MUC presence.
 */
export default class SignalingLayerImpl extends SignalingLayer {
    /**
     * A map that stores SSRCs of remote streams and the corresponding jid and source name.
     * FIXME: This map got filled and never cleaned and can grow during long
     * conference
     * @type {Map<number, { endpointId: string, sourceName: string }>} maps SSRC number to jid and source name.
     */
    ssrcOwners: Map<number, {
        endpointId: string;
        sourceName: string;
    }>;
    /**
     *
     * @type {ChatRoom|null}
     */
    chatRoom: ChatRoom | null;
    /**
     * @type {Map<SourceName, SourceInfo>}
     * @private
     */
    private _localSourceState;
    /**
     * @type {Map<EndpointId, Map<SourceName, SourceInfo>>}
     * @private
     */
    private _remoteSourceState;
    /**
     * Adds <SourceInfo> element to the local presence.
     *
     * @returns {void}
     * @private
     */
    private _addLocalSourceInfoToPresence;
    /**
     * Binds event listeners to the chat room instance.
     * @param {ChatRoom} room
     * @private
     * @returns {void}
     */
    private _bindChatRoomEventHandlers;
    _audioMuteHandler: (node: any, from: any) => void;
    _videoMuteHandler: (node: any, from: any) => void;
    _videoTypeHandler: (node: any, from: any) => void;
    _sourceInfoHandler: (node: any, mucNick: any) => void;
    _memberLeftHandler: (jid: any) => void;
    /**
     * Check is given endpoint has advertised <SourceInfo/> in it's presence which means that the source name signaling
     * is used by this endpoint.
     *
     * @param {EndpointId} endpointId
     * @returns {boolean}
     */
    _doesEndpointSendNewSourceInfo(endpointId: EndpointId): boolean;
    /**
     * Logs a debug or error message to console depending on whether SSRC rewriting is enabled or not.
     * Owner changes are permitted only when SSRC rewriting is enabled.
     *
     * @param {string} message - The message to be logged.
     * @returns {void}
     */
    _logOwnerChangedMessage(message: string): void;
    /**
     * @inheritDoc
     */
    getPeerMediaInfo(owner: any, mediaType: any, sourceName: any): any;
    /**
     * @inheritDoc
     */
    getPeerSourceInfo(owner: any, sourceName: any): any;
    /**
     * @inheritDoc
     */
    getSSRCOwner(ssrc: any): string;
    /**
     * @inheritDoc
     */
    getTrackSourceName(ssrc: any): string;
    /**
     * @inheritDoc
     */
    removeSSRCOwners(ssrcList: any): void;
    /**
     * Sets the <tt>ChatRoom</tt> instance used and binds presence listeners.
     * @param {ChatRoom} room
     */
    setChatRoom(room: ChatRoom): void;
    /**
     * @inheritDoc
     */
    setSSRCOwner(ssrc: any, newEndpointId: any, newSourceName: any): void;
    /**
     * @inheritDoc
     */
    setTrackMuteStatus(sourceName: any, muted: any): false | void;
    /**
     * @inheritDoc
     */
    setTrackVideoType(sourceName: any, videoType: any): false | void;
    /**
     * @inheritDoc
     */
    updateSsrcOwnersOnLeave(id: any): void;
}
import SignalingLayer from '../../service/RTC/SignalingLayer';
