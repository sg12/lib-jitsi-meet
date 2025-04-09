import { MediaType } from '../../service/RTC/MediaType';
import { VideoType } from '../../service/RTC/VideoType';
import Listenable from '../util/Listenable';
/**
 * Mock {@link TraceablePeerConnection} - add things as needed, but only things useful for all tests.
 */
export declare class MockPeerConnection {
    private id;
    private _usesUnifiedPlan;
    private peerconnection;
    private _simulcast;
    /**
     * Constructor.
     *
     * @param {string} id RTC id
     * @param {boolean} usesUnifiedPlan
     * @param {boolean} simulcast
     */
    constructor(id: string, usesUnifiedPlan: boolean, simulcast: boolean);
    /**
     * {@link TraceablePeerConnection.localDescription}.
     *
     * @returns {Object}
     */
    get localDescription(): {
        sdp: string;
    };
    /**
     * {@link TraceablePeerConnection.remoteDescription}.
     *
     * @returns {Object}
     */
    get remoteDescription(): {
        sdp: string;
    };
    /**
     * {@link TracablePeerConnection.calculateExpectedSendResolution}.
     * @param {JitsiLocalTrack} localTrack
     * @returns {number}
     */
    calculateExpectedSendResolution(localTrack: MockJitsiLocalTrack): number;
    /**
     * {@link TraceablePeerConnection.createAnswer}.
     *
     * @returns {Promise<Object>}
     */
    createAnswer(): Promise<object>;
    /**
     * {@link TraceablePeerConnection.doesTrueSimulcast}.
     * @returns {boolean}
     */
    doesTrueSimulcast(): boolean;
    /**
     * Returns the list of the codecs negotiated.
     * @returns {Array<string>}
     */
    getConfiguredVideoCodecs(): string[];
    /**
     * {@link TraceablePeerConnection.getDesiredMediaDirection}.
     */
    getDesiredMediaDirection(): string;
    /**
     * {@link TraceablePeerConnection.isSpatialScalabilityOn}.
     *
     * @returns {boolean}
     */
    isSpatialScalabilityOn(): boolean;
    /**
     * {@link TraceablePeerConnection.processLocalSdpForTransceiverInfo}.
     *
          * @returns {void}
     */
    processLocalSdpForTransceiverInfo(): void;
    /**
     * {@link TraceablePeerConnection.setLocalDescription}.
     *
     * @returns {Promise<void>}
     */
    setLocalDescription(): Promise<void>;
    /**
     * {@link TraceablePeerConnection.setRemoteDescription}.
     *
     * @returns {Promise<void>}
     */
    setRemoteDescription(): Promise<void>;
    /**
     * {@link TraceablePeerConnection.setSenderVideoConstraints}.
     *
     * Sets the sender video constraints.
     * @returns {void}
     */
    setSenderVideoConstraints(): void;
    /**
     * {@link TraceablePeerConnection.setVideoTransferActive}.
     */
    setVideoTransferActive(): boolean;
    /**
     * {@link TraceablePeerConnection.updateRemoteSources}.
     *
     * Updates the remote sources.
     * @returns {void}
     */
    updateRemoteSources(): void;
    /**
     * {@link TraceablePeerConnection.usesUnifiedPlan}.
     */
    usesUnifiedPlan(): boolean;
    /**
     * {@link TraceablePeerConnection.getLocalVideoTracks}.
     */
    getLocalVideoTracks(): any[];
}
/**
 * Mock {@link RTC} - add things as needed, but only things useful for all tests.
 */
export declare class MockRTC extends Listenable {
    private pc;
    private forwardedSources;
    /**
     * {@link RTC.createPeerConnection}.
     *
     * @returns {MockPeerConnection}
     */
    createPeerConnection(id: string, usesUnifiedPlan: boolean, simulcast: boolean): MockPeerConnection;
    /**
     * Returns the list of sources that the bridge is forwarding to the client.
     * @returns {Array<string>}
     */
    getForwardedSources(): string[];
}
/**
 * MockSignalingLayerImpl
 */
export declare class MockSignalingLayerImpl {
    private _remoteSourceState;
    /**
     * A constructor
     */
    constructor();
    /**
     * Returns the muted state, videoType and codec info received in presence.
     * @param {string} endpointId
     * @returns Object
     */
    getPeerMediaInfo(endpointId: string): object | undefined;
    /**
     * Updates the media info for peer on join/leave.
     * @param {boolean} isJoin - whether endpoint is joining or leaving the call
     * @param {string} endpointId - endpoint id
     * @param {Array<string>} codecList - new codec list published in presence
     * @param {string} codecType - legacy codec setting published in presence
     */
    setPeerMediaInfo(isJoin: boolean, endpointId: string, codecList: string[], codecType: string): void;
}
/**
 * MockTrack
 */
export declare class MockTrack {
    private height;
    /**
     * A constructor
     */
    constructor(height: number);
    /**
     * Returns height.
     * @returns {object}
     */
    getSettings(): {
        height: number;
    };
    /**
     * Gets the height value.
     * @returns {number} The height.
     */
    getHeight(): number;
}
/**
 * MockJitsiLocalTrack
 */
export declare class MockJitsiLocalTrack {
    private resolution;
    private track;
    private type;
    private videoType;
    /**
     * A constructor
     */
    constructor(height: number, mediaType: MediaType, videoType: VideoType);
    /**
     * Returns the height.
     * @returns {number}
     */
    getHeight(): number;
    /**
     * Returns the capture resolution.
     * @returns {number}
     */
    getCaptureResolution(): number;
    /**
     * Returns track.
     * @returns {MockTrack}
     */
    getTrack(): MockTrack;
    /**
     * Returns media type.
     * @returns {MediaType}
     */
    getType(): MediaType;
    /**
     * Returns video type.
     * @returns {VideoType}
     */
    getVideoType(): VideoType;
}
