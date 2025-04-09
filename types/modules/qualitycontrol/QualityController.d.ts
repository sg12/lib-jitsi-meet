import JitsiConference from '../../JitsiConference';
import { CodecMimeType } from '../../service/RTC/CodecMimeType';
import JitsiLocalTrack from '../RTC/JitsiLocalTrack';
import TraceablePeerConnection from '../RTC/TraceablePeerConnection';
import { CodecSelection } from './CodecSelection';
import ReceiveVideoController from './ReceiveVideoController';
import SendVideoController from './SendVideoController';
declare enum QualityLimitationReason {
    BANDWIDTH = "bandwidth",
    CPU = "cpu",
    NONE = "none"
}
interface IResolution {
    height: number;
    width: number;
}
interface IOutboundRtpStats {
    codec: CodecMimeType;
    encodeTime: number;
    qualityLimitationReason: QualityLimitationReason;
    resolution: IResolution;
    timestamp: number;
}
interface ISourceStats {
    avgEncodeTime: number;
    codec: CodecMimeType;
    encodeResolution: number;
    localTrack: JitsiLocalTrack;
    qualityLimitationReason: QualityLimitationReason;
    timestamp: number;
    tpc: TraceablePeerConnection;
}
export declare class FixedSizeArray {
    private _data;
    private _maxSize;
    constructor(size: number);
    add(item: ISourceStats): void;
    get(index: number): ISourceStats | undefined;
    size(): number;
}
/**
 * QualityController class that is responsible for maintaining optimal video quality experience on the local endpoint
 * by controlling the codec, encode resolution and receive resolution of the remote video streams. It also makes
 * adjustments based on the outbound and inbound rtp stream stats reported by the underlying peer connection.
 */
export declare class QualityController {
    private _codecController;
    private _conference;
    private _enableAdaptiveMode;
    private _encodeTimeStats;
    private _isLastNRampupBlocked;
    private _lastNRampupTime;
    private _lastNRampupTimeout;
    private _limitedByCpuTimeout;
    private _receiveVideoController;
    private _sendVideoController;
    /**
     *
     * @param {JitsiConference} conference - The JitsiConference instance.
     * @param {Object} options - video quality settings passed through config.js.
     */
    constructor(conference: JitsiConference, options: {
        enableAdaptiveMode: boolean;
        jvb: object;
        lastNRampupTime: number;
        p2p: object;
    });
    /**
     * Creates a debounced function that delays the execution of the provided function until after the specified delay
     * has elapsed. Unlike typical debounce implementations, the timer does not reset when the function is called again
     * within the delay period.
     *
     * @param {Function} func - The function to be debounced.
     * @param {number} delay - The delay in milliseconds.
     * @returns {Function} - The debounced function.
     */
    _debounce(func: Function, delay: number): (...args: any) => void;
    /**
     * Adjusts the lastN value so that fewer remote video sources are received from the bridge in an attempt to improve
     * encode resolution of the outbound video streams based on cpuLimited parameter passed. If cpuLimited is false,
     * the lastN value will slowly be ramped back up to the channelLastN value set in config.js.
     *
     * @param {boolean} cpuLimited - whether the endpoint is cpu limited or not.
     * @returns boolean - Returns true if an action was taken, false otherwise.
     */
    _lowerOrRaiseLastN(cpuLimited: boolean): boolean;
    /**
     * Adjusts the requested resolution for remote video sources by updating the receiver constraints in an attempt to
     * improve the encode resolution of the outbound video streams.
     * @return {void}
     */
    _maybeLowerReceiveResolution(): void;
    /**
     * Updates the codec preference order for the local endpoint on the active media session and switches the video
     * codec if needed.
     *
     * @param {number} trackId - The track ID of the local video track for which stats have been captured.
     * @returns {boolean} - Returns true if video codec was changed.
     */
    _maybeSwitchVideoCodec(trackId: number): boolean;
    /**
     * Adjusts codec, lastN or receive resolution based on the send resolution (of the outbound streams) and limitation
     * reported by the browser in the WebRTC stats. Recovery is also attempted if the limitation goes away. No action
     * is taken if the adaptive mode has been disabled through config.js.
     *
     * @param {ISourceStats} sourceStats - The outbound-rtp stats for a local video track.
     * @returns {void}
     */
    _performQualityOptimizations(sourceStats: ISourceStats): void;
    /**
     * Processes the outbound RTP stream stats as reported by the WebRTC peerconnection and makes runtime adjustments
     * to the client for better quality experience if the adaptive mode is enabled.
     *
     * @param {TraceablePeerConnection} tpc - The underlying WebRTC peerconnection where stats have been captured.
     * @param {Map<number, IOutboundRtpStats>} stats - Outbound-rtp stream stats per SSRC.
     * @returns void
     */
    _processOutboundRtpStats(tpc: TraceablePeerConnection, stats: Map<number, IOutboundRtpStats>): void;
    /**
     * Gets the codec controller instance.
     */
    get codecController(): CodecSelection;
    /**
     * Gets the receive video controller instance.
     */
    get receiveVideoController(): ReceiveVideoController;
    /**
     * Gets the send video controller instance.
     */
    get sendVideoController(): SendVideoController;
}
export {};
