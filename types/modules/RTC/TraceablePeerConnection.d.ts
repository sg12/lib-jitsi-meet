/**
 * Creates new instance of 'TraceablePeerConnection'.
 *
 * @param {RTC} rtc the instance of <tt>RTC</tt> service
 * @param {number} id the peer connection id assigned by the parent RTC module.
 * @param {SignalingLayer} signalingLayer the signaling layer instance
 * @param {object} pcConfig The {@code RTCConfiguration} to use for the WebRTC peer connection.
 * @param {object} constraints WebRTC 'PeerConnection' constraints
 * @param {boolean} isP2P indicates whether or not the new instance will be used in a peer to peer connection.
 * @param {object} options <tt>TracablePeerConnection</tt> config options.
 * @param {Object} options.audioQuality - Quality settings to applied on the outbound audio stream.
 * @param {boolean} options.capScreenshareBitrate if set to true, lower layers will be disabled for screenshare.
 * @param {Array<CodecMimeType>} options.codecSettings - codec settings to be applied for video streams.
 * @param {boolean} options.disableSimulcast if set to 'true' will disable the simulcast.
 * @param {boolean} options.disableRtx if set to 'true' will disable the RTX.
 * @param {boolean} options.enableInsertableStreams set to true when the insertable streams constraints is to be
 * enabled on the PeerConnection.
 * @param {boolean} options.forceTurnRelay If set to true, the browser will generate only Relay ICE candidates.
 * @param {boolean} options.startSilent If set to 'true' no audio will be sent or received.
 * @param {Object} options.videoQuality - Quality settings to applied on the outbound video streams.
 *
 * FIXME: initially the purpose of TraceablePeerConnection was to be able to
 * debug the peer connection. Since many other responsibilities have been added
 * it would make sense to extract a separate class from it and come up with
 * a more suitable name.
 *
 * @constructor
 */
export default function TraceablePeerConnection(rtc: RTC, id: number, signalingLayer: SignalingLayer, pcConfig: object, constraints: object, isP2P: boolean, options: {
    audioQuality: any;
    capScreenshareBitrate: boolean;
    codecSettings: Array<CodecMimeType>;
    disableSimulcast: boolean;
    disableRtx: boolean;
    enableInsertableStreams: boolean;
    forceTurnRelay: boolean;
    startSilent: boolean;
    videoQuality: any;
}): void;
export default class TraceablePeerConnection {
    /**
     * Creates new instance of 'TraceablePeerConnection'.
     *
     * @param {RTC} rtc the instance of <tt>RTC</tt> service
     * @param {number} id the peer connection id assigned by the parent RTC module.
     * @param {SignalingLayer} signalingLayer the signaling layer instance
     * @param {object} pcConfig The {@code RTCConfiguration} to use for the WebRTC peer connection.
     * @param {object} constraints WebRTC 'PeerConnection' constraints
     * @param {boolean} isP2P indicates whether or not the new instance will be used in a peer to peer connection.
     * @param {object} options <tt>TracablePeerConnection</tt> config options.
     * @param {Object} options.audioQuality - Quality settings to applied on the outbound audio stream.
     * @param {boolean} options.capScreenshareBitrate if set to true, lower layers will be disabled for screenshare.
     * @param {Array<CodecMimeType>} options.codecSettings - codec settings to be applied for video streams.
     * @param {boolean} options.disableSimulcast if set to 'true' will disable the simulcast.
     * @param {boolean} options.disableRtx if set to 'true' will disable the RTX.
     * @param {boolean} options.enableInsertableStreams set to true when the insertable streams constraints is to be
     * enabled on the PeerConnection.
     * @param {boolean} options.forceTurnRelay If set to true, the browser will generate only Relay ICE candidates.
     * @param {boolean} options.startSilent If set to 'true' no audio will be sent or received.
     * @param {Object} options.videoQuality - Quality settings to applied on the outbound video streams.
     *
     * FIXME: initially the purpose of TraceablePeerConnection was to be able to
     * debug the peer connection. Since many other responsibilities have been added
     * it would make sense to extract a separate class from it and come up with
     * a more suitable name.
     *
     * @constructor
     */
    constructor(rtc: RTC, id: number, signalingLayer: SignalingLayer, pcConfig: object, constraints: object, isP2P: boolean, options: {
        audioQuality: any;
        capScreenshareBitrate: boolean;
        codecSettings: Array<CodecMimeType>;
        disableSimulcast: boolean;
        disableRtx: boolean;
        enableInsertableStreams: boolean;
        forceTurnRelay: boolean;
        startSilent: boolean;
        videoQuality: any;
    });
    /**
     * Indicates whether or not this peer connection instance is actively
     * sending/receiving audio media. When set to <tt>false</tt> the SDP audio
     * media direction will be adjusted to 'inactive' in order to suspend
     * the transmission.
     * @type {boolean}
     * @private
     */
    private audioTransferActive;
    /**
     * The DTMF sender instance used to send DTMF tones.
     *
     * @type {RTCDTMFSender|undefined}
     * @private
     */
    private _dtmfSender;
    /**
     * @typedef {Object} TouchToneRequest
     * @property {string} tones - The DTMF tones string as defined by
     * {@code RTCDTMFSender.insertDTMF}, 'tones' argument.
     * @property {number} duration - The amount of time in milliseconds that
     * each DTMF should last.
     * @property {string} interToneGap - The length of time in miliseconds to
     * wait between tones.
     */
    /**
     * TouchToneRequests which are waiting to be played. This queue is filled
     * if there are touch tones currently being played.
     *
     * @type {Array<TouchToneRequest>}
     * @private
     */
    private _dtmfTonesQueue;
    /**
     * Indicates whether or not this peer connection instance is actively
     * sending/receiving video media. When set to <tt>false</tt> the SDP video
     * media direction will be adjusted to 'inactive' in order to suspend
     * the transmission.
     * @type {boolean}
     * @private
     */
    private videoTransferActive;
    /**
     * The parent instance of RTC service which created this
     * <tt>TracablePeerConnection</tt>.
     * @type {RTC}
     */
    rtc: RTC;
    /**
     * The peer connection identifier assigned by the RTC module.
     * @type {number}
     */
    id: number;
    /**
     * Indicates whether or not this instance is used in a peer to peer
     * connection.
     * @type {boolean}
     */
    isP2P: boolean;
    /**
     * A map that holds remote tracks signaled on the peerconnection indexed by their SSRC.
     * @type {Map<number, JitsiRemoteTrack>}
     */
    remoteTracksBySsrc: Map<number, JitsiRemoteTrack>;
    /**
     * The map holds remote tracks associated with this peer connection. It maps user's JID to media type and a set of
     * remote tracks.
     * @type {Map<string, Map<MediaType, Set<JitsiRemoteTrack>>>}
     */
    remoteTracks: Map<string, Map<MediaType, Set<JitsiRemoteTrack>>>;
    /**
     * A map which stores local tracks mapped by {@link JitsiLocalTrack.rtcId}
     * @type {Map<number, JitsiLocalTrack>}
     */
    localTracks: Map<number, JitsiLocalTrack>;
    /**
     * @typedef {Object} TPCGroupInfo
     * @property {string} semantics the SSRC groups semantics
     * @property {Array<number>} ssrcs group's SSRCs in order where the first
     * one is group's primary SSRC, the second one is secondary (RTX) and so
     * on...
     */
    /**
     * @typedef {Object} TPCSSRCInfo
     * @property {Array<number>} ssrcs an array which holds all track's SSRCs
     * @property {Array<TPCGroupInfo>} groups an array stores all track's SSRC
     * groups
     */
    /**
     * Holds the info about local track's SSRCs mapped per their
     * {@link JitsiLocalTrack.rtcId}
     * @type {Map<number, TPCSSRCInfo>}
     */
    localSSRCs: Map<number, {
        /**
         * an array which holds all track's SSRCs
         */
        ssrcs: Array<number>;
        /**
         * an array stores all track's SSRC
         * groups
         */
        groups: {
            /**
             * the SSRC groups semantics
             */
            semantics: string;
            /**
             * group's SSRCs in order where the first
             * one is group's primary SSRC, the second one is secondary (RTX) and so
             * on...
             */
            ssrcs: Array<number>;
        }[];
    }>;
    /**
     * The set of remote SSRCs seen so far.
     * Distinguishes new SSRCs from those that have been remapped.
     * @type {Set<number>}
     */
    remoteSSRCs: Set<number>;
    /**
     * Mapping of source-names and their associated SSRCs that have been signaled by the JVB.
     * @type {Map<string, number>}
     */
    remoteSources: Map<string, number>;
    /**
     * The local ICE username fragment for this session.
     */
    localUfrag: any;
    /**
     * The remote ICE username fragment for this session.
     */
    remoteUfrag: any;
    /**
     * The DTLS transport object for the PeerConnection.
     * Note: this assume only one shared transport exists because we bundled
     *       all streams on the same underlying transport.
     */
    _dtlsTransport: RTCDtlsTransport;
    /**
     * The signaling layer which operates this peer connection.
     * @type {SignalingLayer}
     */
    signalingLayer: SignalingLayer;
    _peerVideoTypeChanged: any;
    _peerMutedChanged: any;
    options: {
        audioQuality: any;
        capScreenshareBitrate: boolean;
        codecSettings: Array<CodecMimeType>;
        disableSimulcast: boolean;
        disableRtx: boolean;
        enableInsertableStreams: boolean;
        forceTurnRelay: boolean;
        startSilent: boolean;
        videoQuality: any;
    };
    peerconnection: RTCPeerConnection;
    tpcUtils: TPCUtils;
    updateLog: any[];
    stats: {};
    statsinterval: number;
    /**
     * Flag used to indicate if low fps screenshare is desired.
     */
    _capScreenshareBitrate: boolean;
    /**
     * Codec preferences set for the peerconnection through config.js.
     */
    codecSettings: CodecMimeType[];
    /**
     * Flag used to indicate if the codecs are configured using the codec selection API without having the need to
     * trigger a renegotiation for the change to be effective.
     */
    _usesCodecSelectionAPI: any;
    /**
     * Indicates whether an audio track has ever been added to the peer connection.
     */
    _hasHadAudioTrack: boolean;
    /**
     * Indicates whether a video track has ever been added to the peer connection.
     */
    _hasHadVideoTrack: boolean;
    /**
     * @type {number} The max number of stats to keep in this.stats. Limit to
     * 300 values, i.e. 5 minutes; set to 0 to disable
     */
    maxstats: number;
    simulcast: SdpSimulcast;
    /**
     * Munges local SDP provided to the Jingle Session in order to prevent from
     * sending SSRC updates on attach/detach and mute/unmute (for video).
     * @type {LocalSdpMunger}
     */
    localSdpMunger: LocalSdpMunger;
    /**
     * TracablePeerConnection uses RTC's eventEmitter
     * @type {EventEmitter}
     */
    eventEmitter: EventEmitter;
    rtxModifier: RtxModifier;
    /**
     * The height constraints to be applied on the sender per local video source (source name as the key).
     * @type {Map<string, number>}
     */
    _senderMaxHeights: Map<string, number>;
    /**
     * Holds the RTCRtpTransceiver mids that the local tracks are attached to, mapped per their
     * {@link JitsiLocalTrack.rtcId}.
     * @type {Map<string, string>}
     */
    localTrackTransceiverMids: Map<string, string>;
    /**
     * Holds the SSRC map for the local tracks mapped by their source names.
     *
     * @type {Map<string, TPCSourceInfo>}
     * @property {string} msid - The track's MSID.
     * @property {Array<string>} ssrcs - The SSRCs associated with the track.
     * @property {Array<TPCGroupInfo>} groups - The SSRC groups associated with the track.
     */
    _localSsrcMap: Map<string, TPCSourceInfo>;
    /**
     * Holds the SSRC map for the remote tracks mapped by their source names.
     *
     * @type {Map<string, TPCSourceInfo>}
     * @property {string} mediaType - The media type of the track.
     * @property {string} msid - The track's MSID.
     * @property {Array<TPCGroupInfo>} groups - The SSRC groups associated with the track.
     * @property {Array<string>} ssrcList - The SSRCs associated with the track.
     * @property {VideoType} videoType - The videoType of the track (undefined for audio tracks).
     */
    _remoteSsrcMap: Map<string, TPCSourceInfo>;
    trace: (what: any, info: any) => void;
    onicecandidate: any;
    onTrack: (evt: any) => void;
    onsignalingstatechange: any;
    oniceconnectionstatechange: any;
    onnegotiationneeded: any;
    onconnectionstatechange: any;
    ondatachannel: any;
    _lastVideoSenderUpdatePromise: Promise<void>;
    private _processStat;
    /**
     * Forwards the {@link peerconnection.iceConnectionState} state except that it
     * will convert "completed" into "connected" where both mean that the ICE has
     * succeeded and is up and running. We never see "completed" state for
     * the JVB connection, but it started appearing for the P2P one. This method
     * allows to adapt old logic to this new situation.
     * @return {string}
     */
    getConnectionState(): string;
    private getDesiredMediaDirection;
    /**
     * Returns the list of RTCRtpReceivers created for the source of the given media type associated with
     * the set of remote endpoints specified.
     * @param {Array<string>} endpoints list of the endpoints
     * @param {string} mediaType 'audio' or 'video'
     * @returns {Array<RTCRtpReceiver>} list of receivers created by the peerconnection.
     */
    _getReceiversByEndpointIds(endpoints: Array<string>, mediaType: string): Array<RTCRtpReceiver>;
    /**
     * Tells whether or not this TPC instance has spatial scalability enabled.
     * @return {boolean} <tt>true</tt> if spatial scalability is enabled and active or
     * <tt>false</tt> if it's turned off.
     */
    isSpatialScalabilityOn(): boolean;
    /**
     * Handles remote source mute and unmute changed events.
     *
     * @param {string} sourceName - The name of the remote source.
     * @param {boolean} isMuted - The new mute state.
     */
    _sourceMutedChanged(sourceName: string, isMuted: boolean): void;
    /**
     * Handles remote source videoType changed events.
     *
     * @param {string} sourceName - The name of the remote source.
     * @param {boolean} isMuted - The new value.
     */
    _sourceVideoTypeChanged(sourceName: string, videoType: any): void;
    /**
     * Obtains audio levels of the remote audio tracks by getting the source information on the RTCRtpReceivers.
     * The information relevant to the ssrc is updated each time a RTP packet constaining the ssrc is received.
     * @param {Array<string>} speakerList list of endpoint ids for which audio levels are to be gathered.
     * @returns {Object} containing ssrc and audio level information as a key-value pair.
     */
    getAudioLevels(speakerList?: Array<string>): any;
    /**
     * Checks if the browser is currently doing true simulcast where in three different media streams are being sent to the
     * bridge. Currently this happens always for VP8 and only if simulcast is enabled for VP9/AV1/H264.
     *
     * @param {JitsiLocalTrack} localTrack - The local video track.
     * @returns {boolean}
     */
    doesTrueSimulcast(localTrack: JitsiLocalTrack): boolean;
    /**
     * Returns the SSRCs associated with a given local video track.
     *
     * @param {JitsiLocalTrack} localTrack
     * @returns
     */
    getLocalVideoSSRCs(localTrack: JitsiLocalTrack): any[];
    /**
     * Obtains local tracks for given {@link MediaType}. If the <tt>mediaType</tt>
     * argument is omitted the list of all local tracks will be returned.
     * @param {MediaType} [mediaType]
     * @return {Array<JitsiLocalTrack>}
     */
    getLocalTracks(mediaType?: MediaType): Array<JitsiLocalTrack>;
    /**
     * Retrieves the local video tracks.
     *
     * @returns {Array<JitsiLocalTrack>} - local video tracks.
     */
    getLocalVideoTracks(): Array<JitsiLocalTrack>;
    /**
     * Obtains all remote tracks currently known to this PeerConnection instance.
     *
     * @param {string} [endpointId] - The track owner's identifier (MUC nickname)
     * @param {MediaType} [mediaType] - The remote tracks will be filtered by their media type if this argument is
     * specified.
     * @return {Array<JitsiRemoteTrack>}
     */
    getRemoteTracks(endpointId?: string, mediaType?: MediaType): Array<JitsiRemoteTrack>;
    /**
     * Returns the remote sourceInfo for a given source name.
     *
     * @param {string} sourceName - The source name.
     * @returns {TPCSourceInfo}
     */
    getRemoteSourceInfoBySourceName(sourceName: string): TPCSourceInfo;
    /**
     * Returns a map of source names and their associated SSRCs for the remote participant.
     *
     * @param {string} id Endpoint id of the remote participant.
     * @returns {Map<string, TPCSourceInfo>} The map of source names and their associated SSRCs.
     */
    getRemoteSourceInfoByParticipant(id: string): Map<string, TPCSourceInfo>;
    /**
     * Returns the target bitrates configured for the local video source.
     *
     * @param {JitsiLocalTrack} - The local video track.
     * @returns {Object}
     */
    getTargetVideoBitrates(localTrack: any): any;
    /**
     * Tries to find {@link JitsiTrack} for given SSRC number. It will search both local and remote tracks bound to this
     * instance.
     * @param {number} ssrc
     * @return {JitsiTrack|null}
     */
    getTrackBySSRC(ssrc: number): JitsiTrack | null;
    /**
     * Tries to find SSRC number for given {@link JitsiTrack} id. It will search
     * both local and remote tracks bound to this instance.
     * @param {string} id
     * @return {number|null}
     */
    getSsrcByTrackId(id: string): number | null;
    /**
     * Called on "track added" and "stream added" PeerConnection events (because we
     * handle streams on per track basis). Finds the owner and the SSRC for
     * the track and passes that to ChatRoom for further processing.
     * @param {MediaStream} stream the WebRTC MediaStream instance which is
     * the parent of the track
     * @param {MediaStreamTrack} track the WebRTC MediaStreamTrack added for remote
     * participant.
     * @param {RTCRtpTransceiver} transceiver the WebRTC transceiver that is created
     * for the remote participant in unified plan.
     */
    _remoteTrackAdded(stream: MediaStream, track: MediaStreamTrack, transceiver?: RTCRtpTransceiver): void;
    /**
     * Initializes a new JitsiRemoteTrack instance with the data provided by the signaling layer and SDP.
     *
     * @param {string} ownerEndpointId - The owner's endpoint ID (MUC nickname)
     * @param {String} sourceName - The track's source name
     * @param {Object} trackDetails - The track's details.
     * @param {MediaType} trackDetails.mediaType - media type, 'audio' or 'video'.
     * @param {boolean} trackDetails.muted - The initial muted status.
     * @param {number} trackDetails.ssrc - The track's main SSRC number.
     * @param {MediaStream} trackDetails.stream - The WebRTC stream instance.
     * @param {MediaStreamTrack} trackDetails.track - The WebRTC track instance.
     * @param {VideoType} trackDetails.videoType - The track's type of the video (if applicable).
     */
    _createRemoteTrack(ownerEndpointId: string, sourceName: string, trackDetails: {
        mediaType: MediaType;
        muted: boolean;
        ssrc: number;
        stream: MediaStream;
        track: MediaStreamTrack;
        videoType: VideoType;
    }): void;
    /**
     * Handles remote media track removal.
     *
     * @param {MediaStream} stream - WebRTC MediaStream instance which is the parent of the track.
     * @param {MediaStreamTrack} track - WebRTC MediaStreamTrack which has been removed from the PeerConnection.
     * @returns {void}
     */
    _remoteTrackRemoved(stream: MediaStream, track: MediaStreamTrack): void;
    /**
     * Removes and disposes given <tt>JitsiRemoteTrack</tt> instance. Emits {@link RTCEvents.REMOTE_TRACK_REMOVED}.
     *
     * @param {JitsiRemoteTrack} toBeRemoved - The remote track to be removed.
     * @returns {void}
     */
    _removeRemoteTrack(toBeRemoved: JitsiRemoteTrack): void;
    /**
     * Processes the local SDP and creates an SSRC map for every local track.
     *
     * @param {string} localSDP - SDP from the local description.
     * @returns {void}
     */
    _processAndExtractSourceInfo(localSDP: string): void;
    /**
     *
     * @param {JitsiLocalTrack} localTrack
     */
    getLocalSSRC(localTrack: JitsiLocalTrack): number;
    _getSSRC(rtcId: any): {
        /**
         * an array which holds all track's SSRCs
         */
        ssrcs: Array<number>;
        /**
         * an array stores all track's SSRC
         * groups
         */
        groups: {
            /**
             * the SSRC groups semantics
             */
            semantics: string;
            /**
             * group's SSRCs in order where the first
             * one is group's primary SSRC, the second one is secondary (RTX) and so
             * on...
             */
            ssrcs: Array<number>;
        }[];
    };
    private isSharingLowFpsScreen;
    /**
     * Checks if screensharing is in progress.
     *
     * @returns {boolean}  Returns true if a desktop track has been added to the peerconnection, false otherwise.
     */
    _isSharingScreen(): boolean;
    /**
     * Add {@link JitsiLocalTrack} to this TPC.
     * @param {JitsiLocalTrack} track
     * @param {boolean} isInitiator indicates if the endpoint is the offerer.
     * @returns {Promise<void>} - resolved when done.
     */
    addTrack(track: JitsiLocalTrack, isInitiator?: boolean): Promise<void>;
    /**
     * Adds local track to the RTCPeerConnection.
     *
     * @param {JitsiLocalTrack} track the track to be added to the pc.
     * @return {Promise<boolean>} Promise that resolves to true if the underlying PeerConnection's state has changed and
     * renegotiation is required, false if no renegotiation is needed or Promise is rejected when something goes wrong.
     */
    addTrackToPc(track: JitsiLocalTrack): Promise<boolean>;
    private _assertTrackBelongs;
    /**
     * Returns the codecs in the current order of preference as configured on the peerconnection.
     *
     * @param {RTCSessionDescription} - The local description to be used.
     * @returns {Array}
     */
    getConfiguredVideoCodecs(description: any): any[];
    /**
     * Enables or disables simulcast for screenshare based on the frame rate requested for desktop track capture.
     *
     * @param {number} maxFps framerate to be used for desktop track capture.
     */
    setDesktopSharingFrameRate(maxFps: number): void;
    /**
     * Sets the codec preference on the peerconnection. The codec preference goes into effect when
     * the next renegotiation happens for older clients that do not support the codec selection API.
     *
     * @param {Array<CodecMimeType>} codecList - Preferred codecs for video.
     * @param {CodecMimeType} screenshareCodec - The preferred codec for screenshare.
     * @returns {boolean} - Returns true if the codec settings were updated, false otherwise.
     */
    setVideoCodecs(codecList: Array<CodecMimeType>, screenshareCodec: CodecMimeType): boolean;
    /**
     * Remove local track from this TPC.
     * @param {JitsiLocalTrack} localTrack the track to be removed from this TPC.
     *
     * FIXME It should probably remove a boolean just like {@link removeTrackFromPc}
     *       The same applies to addTrack.
     */
    removeTrack(localTrack: JitsiLocalTrack): void;
    /**
     * Returns the receiver corresponding to the given MediaStreamTrack.
     *
     * @param {MediaSreamTrack} track - The media stream track used for the search.
     * @returns {RTCRtpReceiver|undefined} - The found receiver or undefined if no receiver
     * was found.
     */
    findReceiverForTrack(track: MediaSreamTrack): RTCRtpReceiver | undefined;
    /**
     * Returns the sender corresponding to the given MediaStreamTrack.
     *
     * @param {MediaSreamTrack} track - The media stream track used for the search.
     * @returns {RTCRtpSender|undefined} - The found sender or undefined if no sender
     * was found.
     */
    findSenderForTrack(track: MediaSreamTrack): RTCRtpSender | undefined;
    /**
     * Processes the local description SDP and caches the mids of the mlines associated with the given tracks.
     *
     * @param {Array<JitsiLocalTrack>} localTracks - local tracks that are added to the peerconnection.
     * @returns {void}
     */
    processLocalSdpForTransceiverInfo(localTracks: Array<JitsiLocalTrack>): void;
    /**
     * Replaces <tt>oldTrack</tt> with <tt>newTrack</tt> from the peer connection.
     * Either <tt>oldTrack</tt> or <tt>newTrack</tt> can be null; replacing a valid
     * <tt>oldTrack</tt> with a null <tt>newTrack</tt> effectively just removes
     * <tt>oldTrack</tt>
     *
     * @param {JitsiLocalTrack|null} oldTrack - The current track in use to be replaced on the pc.
     * @param {JitsiLocalTrack|null} newTrack - The new track to be used.
     * @param {boolean} isMuteOperation - Whether the operation is a mute/unmute operation.
     * @returns {Promise<boolean>} - If the promise resolves with true, renegotiation will be needed.
     * Otherwise no renegotiation is needed.
     */
    replaceTrack(oldTrack: JitsiLocalTrack | null, newTrack: JitsiLocalTrack | null, isMuteOperation?: boolean): Promise<boolean>;
    /**
     * Removes local track from the RTCPeerConnection.
     *
     * @param {JitsiLocalTrack} localTrack the local track to be removed.
     * @return {Promise<boolean>} Promise that resolves to true if the underlying PeerConnection's state has changed and
     * renegotiation is required, false if no renegotiation is needed or Promise is rejected when something goes wrong.
     */
    removeTrackFromPc(localTrack: JitsiLocalTrack): Promise<boolean>;
    /**
     * Updates the remote source map with the given source map for adding or removing sources.
     *
     * @param {Map<string, TPCSourceInfo>} sourceMap - The map of source names to their corresponding SSRCs.
     * @param {boolean} isAdd - Whether the sources are being added or removed.
     * @returns {void}
     */
    updateRemoteSources(sourceMap: Map<string, TPCSourceInfo>, isAdd: boolean): void;
    /**
     * Returns true if the codec selection API is used for switching between codecs for the video sources.
     *
     * @returns {boolean}
     */
    usesCodecSelectionAPI(): boolean;
    createDataChannel(label: any, opts: any): RTCDataChannel;
    private _adjustRemoteMediaDirection;
    /**
     * Returns the codec to be used for screenshare based on the supported codecs and the preferred codec requested
     * through config.js setting.
     *
     * @param {CodecMimeType} defaultCodec - the preferred codec for video tracks.
     * @returns {CodecMimeType}
     */
    _getPreferredCodecForScreenshare(defaultCodec: CodecMimeType): CodecMimeType;
    /**
     * Sets up the _dtlsTransport object and initializes callbacks for it.
     */
    _initializeDtlsTransport(): void;
    /**
     * Returns the expected send resolution for a local video track based on what encodings are currently active.
     *
     * @param {JitsiLocalTrack} localTrack - The local video track.
     * @returns {number}
     */
    calculateExpectedSendResolution(localTrack: JitsiLocalTrack): number;
    /**
     * Configures the stream encodings for the audio tracks that are added to the peerconnection.
     *
     * @param {JitsiLocalTrack} localAudioTrack - The local audio track.
     * @returns {Promise} promise that will be resolved when the operation is successful and rejected otherwise.
     */
    configureAudioSenderEncodings(localAudioTrack?: JitsiLocalTrack): Promise<any>;
    /**
     * Configures the RTCRtpEncodingParameters of the outbound rtp stream associated with the given track.
     *
     * @param {JitsiLocalTracj} localTrack - The local track whose outbound stream needs to be configured.
     * @returns {Promise} - A promise that resolves when the operation is successful, rejected otherwise.
     */
    _configureSenderEncodings(localTrack: JitsiLocalTracj): Promise<any>;
    /**
     * Enables/disables the streams by changing the active field on RTCRtpEncodingParameters for a given RTCRtpSender.
     *
     * @param {RTCRtpSender} sender - the sender associated with a MediaStreamTrack.
     * @param {boolean} enable - whether the streams needs to be enabled or disabled.
     * @returns {Promise} - A promise that resolves when the operation is successful, rejected otherwise.
     */
    _enableSenderEncodings(sender: RTCRtpSender, enable: boolean): Promise<any>;
    /**
     * Configures the stream encodings depending on the video type, scalability mode and the bitrate settings for the codec
     * that is currently selected.
     *
     * @param {JitsiLocalTrack} - The local track for which the sender encodings have to configured.
     * @param {CodecMimeType} - The preferred codec for the video track.
     * @returns {Promise} promise that will be resolved when the operation is successful and rejected otherwise.
     */
    configureVideoSenderEncodings(localVideoTrack: any, codec: any): Promise<any>;
    /**
     * Set the simulcast stream encoding properties on the RTCRtpSender.
     *
     * @param {JitsiLocalTrack} localTrack - the current track in use for which the encodings are to be set.
     * @returns {Promise<void>} - resolved when done.
     */
    _setEncodings(localTrack: JitsiLocalTrack): Promise<void>;
    /**
     * Munges the provided description to update the codec order, set the max bitrates (for VP9 K-SVC), set stereo flag
     * and update the DD Header extensions for AV1.
     *
     * @param {RTCSessionDescription} description - The description to be munged.
     * @returns {RTCSessionDescription} - The munged description.
     */
    _mungeDescription(description: RTCSessionDescription): RTCSessionDescription;
    /**
     * Sets the local description on the peerconnection.
     *
     * @param {RTCSessionDescription} description - The local description to be set.
     * @returns {Promise<void>} - Resolved when the operation is successful and rejected with an error otherwise.
     */
    setLocalDescription(description: RTCSessionDescription): Promise<void>;
    /**
     * Sets the remote description on the peerconnection.
     *
     * @param {RTCSessionDescription} description - The remote description to be set.
     * @returns {Promise<void>} - Resolved when the operation is successful and rejected with an error otherwise.
     */
    setRemoteDescription(description: RTCSessionDescription): Promise<void>;
    /**
     * Changes the resolution of the video stream that is sent to the peer based on the resolution requested by the peer
     * and user preference, sets the degradation preference on the sender based on the video type, configures the maximum
     * bitrates on the send stream.
     *
     * @param {number} frameHeight - The max frame height to be imposed on the outgoing video stream.
     * @param {JitsiLocalTrack} - The local track for which the sender constraints have to be applied.
     * @param {preferredCodec} - The video codec that needs to be configured on the sender associated with the video source.
     * @returns {Promise} promise that will be resolved when the operation is successful and rejected otherwise.
     */
    setSenderVideoConstraints(frameHeight: number, localVideoTrack: any, preferredCodec: any): Promise<any>;
    /**
     * Returns a wrapped-up promise so that the setParameters() call on the RTCRtpSender for video sources are chained.
     * This is needed on Chrome as it resets the transaction id after executing setParameters() and can affect the next on
     * the fly updates if they are not chained.
     * https://chromium.googlesource.com/external/webrtc/+/master/pc/rtp_sender.cc#340
     * @param {Function} nextFunction - The function to be called when the last video sender update promise is settled.
     * @returns {Promise}
     */
    _updateVideoSenderParameters(nextFunction: Function): Promise<any>;
    /**
     * Configures the video stream with resolution / degradation / maximum bitrates
     *
     * @param {number} frameHeight - The max frame height to be imposed on the outgoing video stream.
     * @param {JitsiLocalTrack} - The local track for which the sender constraints have to be applied.
     * @param {preferredCodec} - The video codec that needs to be configured on the sender associated with the video source.
     * @returns {Promise} promise that will be resolved when the operation is successful and rejected otherwise.
     */
    _updateVideoSenderEncodings(frameHeight: number, localVideoTrack: any, preferredCodec: any): Promise<any>;
    /**
     * Resumes or suspends media on the peerconnection by setting the active state on RTCRtpEncodingParameters
     * associated with all the senders that have a track attached to it.
     *
     * @param {boolean} enable - whether outgoing media needs to be enabled or disabled.
     * @param {string} mediaType - media type, 'audio' or 'video', if neither is passed, all outgoing media will either
     * be enabled or disabled.
     * @returns {Promise} - A promise that is resolved when the change is succesful on all the senders, rejected
     * otherwise.
     */
    setMediaTransferActive(enable: boolean, mediaType: string): Promise<any>;
    /**
     * Enables/disables outgoing video media transmission on this peer connection. When disabled the stream encoding's
     * active state is enabled or disabled to send or stop the media.
     * @param {boolean} active <tt>true</tt> to enable video media transmission or <tt>false</tt> to disable. If the value
     * is not a boolean the call will have no effect.
     * @return {Promise} A promise that is resolved when the change is succesful, rejected otherwise.
     * @public
     */
    public setVideoTransferActive(active: boolean): Promise<any>;
    /**
     * Sends DTMF tones if possible.
     *
     * @param {string} tones - The DTMF tones string as defined by {@code RTCDTMFSender.insertDTMF}, 'tones' argument.
     * @param {number} duration - The amount of time in milliseconds that each DTMF should last. It's 200ms by default.
     * @param {number} interToneGap - The length of time in miliseconds to wait between tones. It's 200ms by default.
     *
     * @returns {void}
     */
    sendTones(tones: string, duration?: number, interToneGap?: number): void;
    private _onToneChange;
    /**
     * Closes underlying WebRTC PeerConnection instance and removes all remote
     * tracks by emitting {@link RTCEvents.REMOTE_TRACK_REMOVED} for each one of
     * them.
     */
    close(): void;
    createAnswer(constraints: any): Promise<any>;
    createOffer(constraints: any): Promise<any>;
    _createOfferOrAnswer(isOffer: any, constraints: any): Promise<any>;
    /**
     * Extract primary SSRC from given {@link TrackSSRCInfo} object.
     * @param {TrackSSRCInfo} ssrcObj
     * @return {number|null} the primary SSRC or <tt>null</tt>
     */
    _extractPrimarySSRC(ssrcObj: TrackSSRCInfo): number | null;
    /**
     * Track the SSRCs seen so far.
     * @param {number} ssrc - SSRC.
     * @return {boolean} - Whether this is a new SSRC.
     */
    addRemoteSsrc(ssrc: number): boolean;
    addIceCandidate(candidate: any): Promise<void>;
    /**
     * Obtains call-related stats from the peer connection.
     *
     * @returns {Promise<Object>} Promise which resolves with data providing statistics about
     * the peerconnection.
     */
    getStats(): Promise<any>;
    /**
     * Creates a text representation of this <tt>TraceablePeerConnection</tt>
     * instance.
     * @return {string}
     */
    toString(): string;
}
import { CodecMimeType } from '../../service/RTC/CodecMimeType';
import JitsiRemoteTrack from './JitsiRemoteTrack';
import { MediaType } from '../../service/RTC/MediaType';
import { TPCUtils } from './TPCUtils';
import SdpSimulcast from '../sdp/SdpSimulcast';
import LocalSdpMunger from '../sdp/LocalSdpMunger';
import RtxModifier from '../sdp/RtxModifier';
import { VideoType } from '../../service/RTC/VideoType';
