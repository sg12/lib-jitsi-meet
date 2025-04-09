/**
 * @typedef {Object} JingleSessionPCOptions
 * video test ?(ask George).
 * @property {boolean} disableRtx - Described in the config.js[1].
 * @property {boolean} disableSimulcast - Described in the config.js[1].
 * @property {boolean} enableInsertableStreams - Set to true when the insertable streams constraints is to be enabled
 * on the PeerConnection.
 * @property {boolean} failICE - it's an option used in the tests. Set to
 * <tt>true</tt> to block any real candidates and make the ICE fail.
 * @property {boolean} gatherStats - Described in the config.js[1].
 * @property {object} p2p - Peer to peer related options (FIXME those could be
 * fetched from config.p2p on the upper level).
 * @property {Object} testing - Testing and/or experimental options.
 * @property {boolean} webrtcIceUdpDisable - Described in the config.js[1].
 * @property {boolean} webrtcIceTcpDisable - Described in the config.js[1].
 *
 * [1]: https://github.com/jitsi/jitsi-meet/blob/master/config.js
 */
/**
 *
 */
export default class JingleSessionPC extends JingleSession {
    /**
     * Parses 'senders' attribute of the video content.
     * @param {jQuery} jingleContents
     * @return {string|null} one of the values of content "senders" attribute
     * defined by Jingle. If there is no "senders" attribute or if the value is
     * invalid then <tt>null</tt> will be returned.
     * @private
     */
    private static parseVideoSenders;
    /**
     * Parses the source-name and max frame height value of the 'content-modify' IQ when source-name signaling
     * is enabled.
     *
     * @param {jQuery} jingleContents - A jQuery selector pointing to the '>jingle' element.
     * @returns {Object|null}
     */
    static parseSourceMaxFrameHeight(jingleContents: jQuery): any | null;
    /**
     * Creates new <tt>JingleSessionPC</tt>
     * @param {string} sid the Jingle Session ID - random string which identifies the session
     * @param {string} localJid our JID
     * @param {string} remoteJid remote peer JID
     * @param {XmppConnection} connection - The XMPP connection instance.
     * @param mediaConstraints the media constraints object passed to createOffer/Answer, as defined
     * by the WebRTC standard
     * @param pcConfig The {@code RTCConfiguration} to use for the WebRTC peer connection.
     * @param {boolean} isP2P indicates whether this instance is meant to be used in a direct, peer to
     * peer connection or <tt>false</tt> if it's a JVB connection.
     * @param {boolean} isInitiator indicates if it will be the side which initiates the session.
     * @constructor
     *
     * @implements {SignalingLayer}
     */
    constructor(sid: string, localJid: string, remoteJid: string, connection: XmppConnection, mediaConstraints: any, pcConfig: any, isP2P: boolean, isInitiator: boolean);
    /**
     * The bridge session's identifier. One Jingle session can during
     * it's lifetime participate in multiple bridge sessions managed by
     * Jicofo. A new bridge session is started whenever Jicofo sends
     * 'session-initiate'.
     *
     * @type {?string}
     * @private
     */
    private _bridgeSessionId;
    /**
     * The oldest SDP passed to {@link notifyMySSRCUpdate} while the XMPP connection was offline that will be
     * used to update Jicofo once the XMPP connection goes back online.
     * @type {SDP|undefined}
     * @private
     */
    private _cachedOldLocalSdp;
    /**
     * The latest SDP passed to {@link notifyMySSRCUpdate} while the XMPP connection was offline that will be
     * used to update Jicofo once the XMPP connection goes back online.
     * @type {SDP|undefined}
     * @private
     */
    private _cachedNewLocalSdp;
    /**
     * Stores result of {@link window.performance.now()} at the time when
     * ICE enters 'checking' state.
     * @type {number|null} null if no value has been stored yet
     * @private
     */
    private _iceCheckingStartedTimestamp;
    /**
     * Stores result of {@link window.performance.now()} at the time when
     * first ICE candidate is spawned by the peerconnection to mark when
     * ICE gathering started. That's, because ICE gathering state changed
     * events are not supported by most of the browsers, so we try something
     * that will work everywhere. It may not be as accurate, but given that
     * 'host' candidate usually comes first, the delay should be minimal.
     * @type {number|null} null if no value has been stored yet
     * @private
     */
    private _gatheringStartedTimestamp;
    /**
     * Receiver constraints (max height) set by the application per remote source. Will be used for p2p connection.
     *
     * @type {Map<string, number>}
     */
    _sourceReceiverConstraints: Map<string, number>;
    /**
     * Indicates whether or not this session is willing to send/receive
     * video media. When set to <tt>false</tt> the underlying peer
     * connection will disable local video transfer and the remote peer will
     * be will be asked to stop sending video via 'content-modify' IQ
     * (the senders attribute of video contents will be adjusted
     * accordingly). Note that this notification is sent only in P2P
     * session, because Jicofo does not support it yet. Obviously when
     * the value is changed from <tt>false</tt> to <tt>true</tt> another
     * notification will be sent to resume video transfer on the remote
     * side.
     * @type {boolean}
     * @private
     */
    private _localSendReceiveVideoActive;
    /**
     * Indicates whether or not the remote peer has video transfer active.
     * When set to <tt>true</tt> it means that remote peer is neither
     * sending nor willing to receive video. In such case we'll ask
     * our peerconnection to stop sending video by calling
     * {@link TraceablePeerConnection.setVideoTransferActive} with
     * <tt>false</tt>.
     * @type {boolean}
     * @private
     */
    private _remoteSendReceiveVideoActive;
    /**
     * Marks that ICE gathering duration has been reported already. That
     * prevents reporting it again.
     * @type {boolean}
     * @private
     */
    private _gatheringReported;
    lasticecandidate: boolean;
    closed: boolean;
    /**
     * Indicates whether or not this <tt>JingleSessionPC</tt> is used in
     * a peer to peer type of session.
     * @type {boolean} <tt>true</tt> if it's a peer to peer
     * session or <tt>false</tt> if it's a JVB session
     */
    isP2P: boolean;
    /**
     * Remote preference for the receive video max frame height.
     *
     * @type {Number|undefined}
     */
    remoteRecvMaxFrameHeight: number | undefined;
    /**
     * Number of remote video sources, in SSRC rewriting mode.
     * Used to generate next unique msid attribute.
     *
     * @type {Number}
     */
    numRemoteVideoSources: number;
    /**
     * Number of remote audio sources, in SSRC rewriting mode.
     * Used to generate next unique msid attribute.
     *
     * @type {Number}
     */
    numRemoteAudioSources: number;
    /**
     * Remote preference for the receive video max frame heights when source-name signaling is enabled.
     *
     * @type {Map<string, number>|undefined}
     */
    remoteSourceMaxFrameHeights: Map<string, number> | undefined;
    /**
     * The queue used to serialize operations done on the peerconnection after the session is established.
     * The queue is paused until the first offer/answer cycle is complete. Only track or codec related
     * operations which necessitate a renegotiation cycle need to be pushed to the modification queue.
     * These tasks will be executed after the session has been established.
     *
     * @type {AsyncQueue}
     */
    modificationQueue: AsyncQueue;
    /**
     * Flag used to guarantee that the connection established event is
     * triggered just once.
     * @type {boolean}
     */
    wasConnected: boolean;
    /**
     * Keeps track of how long (in ms) it took from ICE start to ICE
     * connect.
     *
     * @type {number}
     */
    establishmentDuration: number;
    _xmppListeners: (() => void)[];
    _removeSenderVideoConstraintsChangeListener: any;
    /**
     * Handles either Jingle 'source-add' or 'source-remove' message for this Jingle session.
     *
     * @param {boolean} isAdd <tt>true</tt> for 'source-add' or <tt>false</tt> otherwise.
     * @param {Array<Element>} elem an array of Jingle "content" elements.
     * @returns {Promise} resolved when the operation is done or rejected with an error.
     * @private
     */
    private _addOrRemoveRemoteStream;
    /**
     * See {@link addTrackToPc} and {@link removeTrackFromPc}.
     *
     * @param {boolean} isRemove <tt>true</tt> for "remove" operation or <tt>false</tt> for "add" operation.
     * @param {JitsiLocalTrack} track the track that will be added/removed.
     * @returns {Promise} resolved when the operation is done or rejected with an error.
     * @private
     */
    private _addRemoveTrack;
    /**
     * Checks whether or not this session instance is still operational.
     *
     * @returns {boolean} {@code true} if operation or {@code false} otherwise.
     * @private
     */
    private _assertNotEnded;
    /**
     * Takes in a jingle offer iq, returns the new sdp offer that can be set as remote description in the
     * peerconnection.
     *
     * @param {jquery xml element} offerIq the incoming offer.
     * @returns {SDP object} the jingle offer translated to SDP.
     * @private
     */
    private _processNewJingleOfferIq;
    /**
     * Parses the SSRC information from the source-add/source-remove element passed and updates the SSRC owners.
     *
     * @param {jquery xml element} sourceElement the source-add/source-remove element from jingle.
     * @param {boolean} isAdd true if the sources are being added, false if they are to be removed.
     * @returns {Map<string, Object>} - The map of source name to ssrcs, msid and groups.
     */
    _processSourceMapFromJingle(sourceElement: any, isAdd?: boolean): Map<string, any>;
    /**
     * Does a new offer/answer flow using the existing remote description (if not provided) and signals any new sources
     * to Jicofo or the remote peer.
     *
     * @param {string} [optionalRemoteSdp] optional, raw remote sdp to use.  If not provided, the remote sdp from the
     * peerconnection will be used.
     * @returns {Promise} promise which resolves when the o/a flow is complete with no arguments or rejects with an
     * error {string}
     * @private
     */
    private _renegotiate;
    /**
     * Sends 'content-modify' IQ in order to ask the remote peer to either stop or resume sending video media or to
     * adjust sender's video constraints.
     *
     * @returns {void}
     * @private
     */
    private _sendContentModify;
    /**
     * Sends given candidate in Jingle 'transport-info' message.
     *
     * @param {RTCIceCandidate} candidate the WebRTC ICE candidate instance
     * @returns {void}
     * @private
     */
    private _sendIceCandidate;
    /**
     * Sends given candidates in Jingle 'transport-info' message.
     *
     * @param {Array<RTCIceCandidate>} candidates an array of the WebRTC ICE candidate instances.
     * @returns {void}
     * @private
     */
    private _sendIceCandidates;
    /**
     * Sends Jingle 'session-accept' message.
     *
     * @param {function()} success callback called when we receive 'RESULT' packet for the 'session-accept'.
     * @param {function(error)} failure called when we receive an error response or when the request has timed out.
     * @returns {void}
     * @private
     */
    private _sendSessionAccept;
    /**
     * Sends 'session-initiate' to the remote peer.
     *
     * NOTE this method is synchronous and we're not waiting for the RESULT
     * response which would delay the startup process.
     *
     * @param {string} offerSdp  - The local session description which will be used to generate an offer.
     * @returns {void}
     * @private
     */
    private _sendSessionInitiate;
    /**
     * Accepts incoming Jingle 'session-initiate' and should send 'session-accept' in result.
     *
     * @param jingleOffer jQuery selector pointing to the jingle element of the offer IQ
     * @param success callback called when we accept incoming session successfully and receive RESULT packet to
     * 'session-accept' sent.
     * @param failure function(error) called if for any reason we fail to accept the incoming offer. 'error' argument
     * can be used to log some details about the error.
     * @param {Array<JitsiLocalTrack>} [localTracks] the optional list of the local tracks that will be added, before
     * the offer/answer cycle executes. We allow the localTracks to optionally be passed in so that the addition of the
     * local tracks and the processing of the initial offer can all be done atomically. We want to make sure that any
     * other operations which originate in the XMPP Jingle messages related with this session to be executed with an
     * assumption that the initial offer/answer cycle has been executed already.
     */
    acceptOffer(jingleOffer: any, success: any, failure: any, localTracks?: Array<JitsiLocalTrack>): void;
    /**
     * {@inheritDoc}
     */
    addIceCandidates(elem: any): void;
    /**
     * Handles a Jingle source-add message for this Jingle session.
     *
     * @param {Array<Element>} elem an array of Jingle "content" elements.
     * @returns {Promise} resolved when the operation is done or rejected with an error.
     */
    addRemoteStream(elem: Array<Element>): Promise<any>;
    /**
     * Adds a new track to the peerconnection. This method needs to be called only when a secondary JitsiLocalTrack is
     * being added to the peerconnection for the first time.
     *
     * @param {Array<JitsiLocalTrack>} localTracks - Tracks to be added to the peer connection.
     * @returns {Promise<void>} that resolves when the track is successfully added to the peerconnection, rejected
     * otherwise.
     */
    addTracks(localTracks?: Array<JitsiLocalTrack>): Promise<void>;
    /**
     * Adds local track back to the peerconnection associated with this session.
     *
     * @param {JitsiLocalTrack} track - the local track to be added back to the peerconnection.
     * @return {Promise} a promise that will resolve once the local track is added back to this session and
     * renegotiation succeeds (if its warranted). Will be rejected with a <tt>string</tt> that provides some error
     * details in case something goes wrong.
     * @returns {Promise<void>}
     */
    addTrackToPc(track: JitsiLocalTrack): Promise<any>;
    /**
     * Closes the underlying peerconnection and shuts down the modification queue.
     *
     * @returns {void}
     */
    close(): void;
    /**
     * @inheritDoc
     * @param {JingleSessionPCOptions} options  - a set of config options.
     * @returns {void}
     */
    doInitialize(options: JingleSessionPCOptions): void;
    failICE: boolean;
    options: JingleSessionPCOptions;
    /**
     * {@code true} if reconnect is in progress.
     * @type {boolean}
     */
    isReconnect: boolean;
    /**
     * Set to {@code true} if the connection was ever stable
     * @type {boolean}
     */
    wasstable: boolean;
    webrtcIceUdpDisable: boolean;
    webrtcIceTcpDisable: boolean;
    usesCodecSelectionAPI: boolean;
    peerconnection: any;
    /**
     * Returns the ice connection state for the peer connection.
     *
     * @returns the ice connection state for the peer connection.
     */
    getIceConnectionState(): any;
    /**
     * Returns the preference for max frame height for the remote video sources.
     *
     * @returns {Map<string, number>|undefined}
     */
    getRemoteSourcesRecvMaxFrameHeight(): Map<string, number> | undefined;
    /**
     * Creates an offer and sends Jingle 'session-initiate' to the remote peer.
     *
     * @param {Array<JitsiLocalTrack>} localTracks the local tracks that will be added, before the offer/answer cycle
     * executes (for the local track addition to be an atomic operation together with the offer/answer).
     * @returns {void}
     */
    invite(localTracks?: Array<JitsiLocalTrack>): void;
    /**
     * Enables/disables local video based on 'senders' attribute of the video conent in 'content-modify' IQ sent by the
     * remote peer. Also, checks if the sourceMaxFrameHeight (as requested by the p2p peer) or the senders attribute of
     * the video content has changed and modifies the local video resolution accordingly.
     *
     * @param {Element} jingleContents - The content of the 'content-modify' IQ sent by the remote peer.
     * @returns {void}
     */
    modifyContents(jingleContents: Element): void;
    /**
     * Method returns function(errorResponse) which is a callback to be passed to Strophe connection.sendIQ method. An
     * 'error' structure is created that is passed as 1st argument to given <tt>failureCb</tt>. The format of this
     * structure is as follows:
     * {
     *  code: {XMPP error response code}
     *  reason: {the name of XMPP error reason element or 'timeout' if the
      *          request has timed out within <tt>IQ_TIMEOUT</tt> milliseconds}
     *  source: {request.tree() that provides original request}
     *  session: {this JingleSessionPC.toString()}
     * }
     * @param request Strophe IQ instance which is the request to be dumped into the error structure.
     * @param failureCb function(error) called when error response was returned or when a timeout has occurred.
     * @returns {function(this:JingleSessionPC)}
     */
    newJingleErrorHandler(request: any, failureCb: any): (this: JingleSessionPC) => any;
    /**
     * Figures out added/removed ssrcs and sends updated IQs to the remote peer or Jicofo.
     *
     * @param oldSDP SDP object for old description.
     * @param newSDP SDP object for new description.
     * @returns {void}
     */
    notifyMySSRCUpdate(oldSDP: any, newSDP: any): void;
    /**
     * Handles the termination of the session.
     *
     * @param {string} reasonCondition - The XMPP Jingle reason condition.
     * @param {string} reasonText - The XMPP Jingle reason text.
     * @returns {void}
     */
    onTerminated(reasonCondition: string, reasonText: string): void;
    /**
     * Handles XMPP connection state changes. Resends any session updates that were cached while the XMPP connection
     * was down.
     *
     * @param {XmppConnection.Status} status - The new status.
     * @returns {void}
     */
    onXmppStatusChanged(status: Strophe.Status): void;
    /**
     * Processes the source map message received from the bridge and creates a new remote track for newly signaled
     * SSRCs or updates the source-name and owner on the remote track for an existing SSRC.
     *
     * @param {Object} message - The source map message.
     * @param {string} mediaType - The media type, 'audio' or 'video'.
     * @returns {void}
     */
    processSourceMap(message: any, mediaType: string): void;
    /**
     * Handles a Jingle source-remove message for this Jingle session.
     *
     * @param {Array<Element>} contents - An array of content elements from the source-remove message.
     * @returns {void}
     */
    removeRemoteStream(elem: any): void;
    /**
     * Handles the deletion of SSRCs associated with a remote user from the remote description when the user leaves.
     *
     * @param {string} id Endpoint id of the participant that has left the call.
     * @returns {void}
     */
    removeRemoteStreamsOnLeave(id: string): void;
    /**
     * Removes local track from the peerconnection as part of the mute operation.
     *
     * @param {JitsiLocalTrack} track the local track to be removed.
     * @return {Promise} a promise which will be resolved once the local track is removed from this session or rejected
     * with a <tt>string</tt> that the describes the error if anything goes wrong.
     */
    removeTrackFromPc(track: JitsiLocalTrack): Promise<any>;
    /**
     * Replaces <tt>oldTrack</tt> with <tt>newTrack</tt> and performs a single offer/answer cycle (if needed) after
     * both operations are done.
     * <tt>oldTrack</tt> or <tt>newTrack</tt> can be null; replacing a valid <tt>oldTrack</tt> with a null
     * <tt>newTrack</tt> effectively just removes <tt>oldTrack</tt>.
     *
     * @param {JitsiLocalTrack|null} oldTrack the current track in use to be replaced.
     * @param {JitsiLocalTrack|null} newTrack the new track to use.
     * @returns {Promise} which resolves once the replacement is complete with no arguments or rejects with an error.
     */
    replaceTrack(oldTrack: JitsiLocalTrack | null, newTrack: JitsiLocalTrack | null): Promise<any>;
    /**
     * Sets the answer received from the remote peer as the remote description.
     *
     * @param {Element} jingleAnswer - The jingle answer element.
     * @returns {void}
     * @throws {Error} if the method is called on a responder session.
     */
    setAnswer(jingleAnswer: Element): void;
    /**
     * Resumes or suspends media transfer over the underlying peer connection.
     *
     * @param {boolean} active - <tt>true</tt> to enable media transfer or <tt>false</tt> to suspend media transmission.
     * @returns {Promise}
     */
    setMediaTransferActive(active: boolean): Promise<any>;
    /**
     * This is a setRemoteDescription/setLocalDescription cycle which starts at converting Strophe Jingle IQ into
     * remote offer SDP. Once converted, setRemoteDescription, createAnswer and setLocalDescription calls follow.
     *
     * @param jingleOfferAnswerIq jQuery selector pointing to the jingle element of the offer (or answer) IQ
     * @param success callback called when sRD/sLD cycle finishes successfully.
     * @param failure callback called with an error object as an argument if we fail at any point during setRD,
     * createAnswer, setLD.
     * @param {Array<JitsiLocalTrack>} [localTracks] the optional list of the local tracks that will be added, before
     * the offer/answer cycle executes (for the local track addition to be an atomic operation together with the
     * offer/answer).
     * @returns {void}
     */
    setOfferAnswerCycle(jingleOfferAnswerIq: any, success: any, failure: any, localTracks?: Array<JitsiLocalTrack>): void;
    /**
     * Resumes or suspends video media transfer over the p2p peer connection.
     *
     * @param {boolean} videoActive <tt>true</tt> to enable video media transfer or <tt>false</tt> to suspend video
     * media transmission.
     * @return {Promise} a <tt>Promise</tt> which will resolve once the operation is done. It will be rejected with
     * an error description as a string in case anything goes wrong.
     */
    setP2pVideoTransferActive(videoActive: boolean): Promise<any>;
    /**
     * Adjust the preference for max video frame height that the local party is willing to receive. Signals
     * the remote p2p peer.
     *
     * @param {Map<string, number>} sourceReceiverConstraints - The receiver constraints per source.
     * @returns {void}
     */
    setReceiverVideoConstraint(sourceReceiverConstraints: Map<string, number>): void;
    /**
     * Sets the resolution constraint on the local video tracks.
     *
     * @param {number} maxFrameHeight - The user preferred max frame height.
     * @param {string} sourceName - The source name of the track.
     * @returns {Promise} promise that will be resolved when the operation is
     * successful and rejected otherwise.
     */
    setSenderVideoConstraint(maxFrameHeight: number, sourceName?: string): Promise<any>;
    /**
     * Updates the codecs on the peerconnection and initiates a renegotiation (if needed) for the
     * new codec config to take effect.
     *
     * @param {Array<CodecMimeType>} codecList - Preferred codecs for video.
     * @param {CodecMimeType} screenshareCodec - The preferred screenshare codec.
     * @returns {void}
     */
    setVideoCodecs(codecList: Array<CodecMimeType>, screenshareCodec: CodecMimeType): void;
    /**
     * @inheritDoc
     */
    terminate(success: any, failure: any, options: any): void;
}
/**
 * video test ?(ask George).
 */
export type JingleSessionPCOptions = {
    /**
     * - Described in the config.js[1].
     */
    disableRtx: boolean;
    /**
     * - Described in the config.js[1].
     */
    disableSimulcast: boolean;
    /**
     * - Set to true when the insertable streams constraints is to be enabled
     * on the PeerConnection.
     */
    enableInsertableStreams: boolean;
    /**
     * - it's an option used in the tests. Set to
     * <tt>true</tt> to block any real candidates and make the ICE fail.
     */
    failICE: boolean;
    /**
     * - Described in the config.js[1].
     */
    gatherStats: boolean;
    /**
     * - Peer to peer related options (FIXME those could be
     * fetched from config.p2p on the upper level).
     */
    p2p: object;
    /**
     * - Testing and/or experimental options.
     */
    testing: any;
    /**
     * - Described in the config.js[1].
     */
    webrtcIceUdpDisable: boolean;
    /**
     * - Described in the config.js[1].
     *
     * [1]: https://github.com/jitsi/jitsi-meet/blob/master/config.js
     */
    webrtcIceTcpDisable: boolean;
};
import JingleSession from './JingleSession';
import AsyncQueue from '../util/AsyncQueue';
import { CodecMimeType } from '../../service/RTC/CodecMimeType';
import XmppConnection from './XmppConnection';
