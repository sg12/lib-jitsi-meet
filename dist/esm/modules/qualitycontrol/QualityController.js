import { getLogger } from '@jitsi/logger';
import { JitsiConferenceEvents } from '../../JitsiConferenceEvents';
import RTCEvents from '../../service/RTC/RTCEvents';
import { DEFAULT_LAST_N, LAST_N_UNLIMITED, VIDEO_CODECS_BY_COMPLEXITY, VIDEO_QUALITY_LEVELS } from '../../service/RTC/StandardVideoQualitySettings';
import { isValidNumber } from '../util/MathUtil';
import { CodecSelection } from './CodecSelection';
import ReceiveVideoController from './ReceiveVideoController';
import SendVideoController from './SendVideoController';
const logger = getLogger('modules/qualitycontrol/QualityController');
// Period for which the client will wait for the cpu limitation flag to be reset in the peerconnection stats before it
// attempts to rectify the situation by attempting a codec switch.
const LIMITED_BY_CPU_TIMEOUT = 60000;
// The min. value that lastN will be set to while trying to fix video qaulity issues.
const MIN_LAST_N = 3;
var QualityLimitationReason;
(function (QualityLimitationReason) {
    QualityLimitationReason["BANDWIDTH"] = "bandwidth";
    QualityLimitationReason["CPU"] = "cpu";
    QualityLimitationReason["NONE"] = "none";
})(QualityLimitationReason || (QualityLimitationReason = {}));
/* eslint-disable require-jsdoc */
export class FixedSizeArray {
    constructor(size) {
        this._maxSize = size;
        this._data = [];
    }
    add(item) {
        if (this._data.length >= this._maxSize) {
            this._data.shift();
        }
        this._data.push(item);
    }
    get(index) {
        if (index < 0 || index >= this._data.length) {
            throw new Error('Index out of bounds');
        }
        return this._data[index];
    }
    size() {
        return this._data.length;
    }
}
/* eslint-enable require-jsdoc */
/**
 * QualityController class that is responsible for maintaining optimal video quality experience on the local endpoint
 * by controlling the codec, encode resolution and receive resolution of the remote video streams. It also makes
 * adjustments based on the outbound and inbound rtp stream stats reported by the underlying peer connection.
 */
export class QualityController {
    /**
     *
     * @param {JitsiConference} conference - The JitsiConference instance.
     * @param {Object} options - video quality settings passed through config.js.
     */
    constructor(conference, options) {
        var _a;
        this._conference = conference;
        const { jvb, p2p } = options;
        this._codecController = new CodecSelection(conference, { jvb,
            p2p });
        this._enableAdaptiveMode = (_a = options.enableAdaptiveMode) !== null && _a !== void 0 ? _a : true;
        this._encodeTimeStats = new Map();
        this._isLastNRampupBlocked = false;
        this._lastNRampupTime = options.lastNRampupTime;
        this._receiveVideoController = new ReceiveVideoController(conference);
        this._sendVideoController = new SendVideoController(conference);
        this._conference.on(JitsiConferenceEvents._MEDIA_SESSION_STARTED, (session) => {
            this._codecController.selectPreferredCodec(session);
            this._receiveVideoController.onMediaSessionStarted(session);
            this._sendVideoController.onMediaSessionStarted(session);
        });
        this._conference.on(JitsiConferenceEvents._MEDIA_SESSION_ACTIVE_CHANGED, () => this._sendVideoController.configureConstraintsForLocalSources());
        this._conference.on(JitsiConferenceEvents.CONFERENCE_VISITOR_CODECS_CHANGED, (codecList) => this._codecController.updateVisitorCodecs(codecList));
        // Debounce the calls to codec selection when there is a burst of joins and leaves.
        const debouncedSelectCodec = this._debounce(() => this._codecController.selectPreferredCodec(this._conference.jvbJingleSession), 1000);
        this._conference.on(JitsiConferenceEvents.USER_JOINED, debouncedSelectCodec.bind(this));
        this._conference.on(JitsiConferenceEvents.USER_LEFT, debouncedSelectCodec.bind(this));
        this._conference.rtc.on(RTCEvents.SENDER_VIDEO_CONSTRAINTS_CHANGED, (videoConstraints) => this._sendVideoController.onSenderConstraintsReceived(videoConstraints));
        this._conference.on(JitsiConferenceEvents.ENCODE_TIME_STATS_RECEIVED, (tpc, stats) => this._processOutboundRtpStats(tpc, stats));
    }
    /**
     * Creates a debounced function that delays the execution of the provided function until after the specified delay
     * has elapsed. Unlike typical debounce implementations, the timer does not reset when the function is called again
     * within the delay period.
     *
     * @param {Function} func - The function to be debounced.
     * @param {number} delay - The delay in milliseconds.
     * @returns {Function} - The debounced function.
     */
    _debounce(func, delay) {
        return function (...args) {
            /* eslint-disable @typescript-eslint/no-invalid-this */
            if (!this._timer) {
                this._timer = setTimeout(() => {
                    this._timer = null;
                    func.apply(this, args);
                }, delay);
            }
            /* eslint-enable @typescript-eslint/no-invalid-this */
        };
    }
    /**
     * Adjusts the lastN value so that fewer remote video sources are received from the bridge in an attempt to improve
     * encode resolution of the outbound video streams based on cpuLimited parameter passed. If cpuLimited is false,
     * the lastN value will slowly be ramped back up to the channelLastN value set in config.js.
     *
     * @param {boolean} cpuLimited - whether the endpoint is cpu limited or not.
     * @returns boolean - Returns true if an action was taken, false otherwise.
     */
    _lowerOrRaiseLastN(cpuLimited) {
        const lastN = this.receiveVideoController.getLastN();
        let newLastN = lastN;
        if (cpuLimited && (lastN !== LAST_N_UNLIMITED && lastN <= MIN_LAST_N)) {
            return false;
        }
        // If channelLastN is not set or set to -1 in config.js, the client will ramp up lastN to only up to 25.
        let { channelLastN = DEFAULT_LAST_N } = this._conference.options.config;
        channelLastN = channelLastN === LAST_N_UNLIMITED ? DEFAULT_LAST_N : channelLastN;
        if (cpuLimited) {
            const videoStreamsReceived = this._conference.getForwardedSources().length;
            newLastN = Math.floor(videoStreamsReceived / 2);
            if (newLastN < MIN_LAST_N) {
                newLastN = MIN_LAST_N;
            }
            // Increment lastN by 1 every LAST_N_RAMPUP_TIME (60) secs.
        }
        else if (lastN < channelLastN) {
            newLastN++;
        }
        if (newLastN === lastN) {
            return false;
        }
        const isStillLimitedByCpu = newLastN < channelLastN;
        this.receiveVideoController.setLastNLimitedByCpu(isStillLimitedByCpu);
        logger.info(`QualityController - setting lastN=${newLastN}, limitedByCpu=${isStillLimitedByCpu}`);
        this.receiveVideoController.setLastN(newLastN);
        return true;
    }
    /**
     * Adjusts the requested resolution for remote video sources by updating the receiver constraints in an attempt to
     * improve the encode resolution of the outbound video streams.
     * @return {void}
     */
    _maybeLowerReceiveResolution() {
        const currentConstraints = this.receiveVideoController.getCurrentReceiverConstraints();
        const individualConstraints = currentConstraints.constraints;
        let maxHeight = 0;
        if (individualConstraints && Object.keys(individualConstraints).length) {
            for (const value of Object.values(individualConstraints)) {
                const v = value;
                maxHeight = Math.max(maxHeight, v.maxHeight);
            }
        }
        const currentLevel = VIDEO_QUALITY_LEVELS.findIndex(lvl => lvl.height <= maxHeight);
        // Do not lower the resolution to less than 180p.
        if (VIDEO_QUALITY_LEVELS[currentLevel].height === 180) {
            return;
        }
        this.receiveVideoController.setPreferredReceiveMaxFrameHeight(VIDEO_QUALITY_LEVELS[currentLevel + 1].height);
    }
    /**
     * Updates the codec preference order for the local endpoint on the active media session and switches the video
     * codec if needed.
     *
     * @param {number} trackId - The track ID of the local video track for which stats have been captured.
     * @returns {boolean} - Returns true if video codec was changed.
     */
    _maybeSwitchVideoCodec(trackId) {
        const stats = this._encodeTimeStats.get(trackId);
        const { codec, encodeResolution, localTrack } = stats.get(stats.size() - 1);
        const codecsByVideoType = VIDEO_CODECS_BY_COMPLEXITY[localTrack.getVideoType()];
        const codecIndex = codecsByVideoType.findIndex(val => val === codec.toLowerCase());
        // Do nothing if the encoder is using the lowest complexity codec already.
        if (codecIndex === codecsByVideoType.length - 1) {
            return false;
        }
        if (!this._limitedByCpuTimeout) {
            this._limitedByCpuTimeout = window.setTimeout(() => {
                this._limitedByCpuTimeout = undefined;
                const updatedStats = this._encodeTimeStats.get(trackId);
                const latestSourceStats = updatedStats.get(updatedStats.size() - 1);
                const expectedSendResolution = Math.min(localTrack.maxEnabledResolution, localTrack.getCaptureResolution());
                // If the encoder is still limited by CPU, switch to a lower complexity codec.
                if (latestSourceStats.qualityLimitationReason === QualityLimitationReason.CPU
                    || encodeResolution < expectedSendResolution) {
                    return this.codecController.changeCodecPreferenceOrder(localTrack, codec);
                }
            }, LIMITED_BY_CPU_TIMEOUT);
        }
        return false;
    }
    /**
     * Adjusts codec, lastN or receive resolution based on the send resolution (of the outbound streams) and limitation
     * reported by the browser in the WebRTC stats. Recovery is also attempted if the limitation goes away. No action
     * is taken if the adaptive mode has been disabled through config.js.
     *
     * @param {ISourceStats} sourceStats - The outbound-rtp stats for a local video track.
     * @returns {void}
     */
    _performQualityOptimizations(sourceStats) {
        // Do not attempt run time adjustments if the adaptive mode is disabled.
        if (!this._enableAdaptiveMode) {
            return;
        }
        const { encodeResolution, localTrack, qualityLimitationReason, tpc } = sourceStats;
        // Older browser versions might not report the resolution in the stats.
        if (!isValidNumber(encodeResolution)) {
            return;
        }
        const trackId = localTrack.rtcId;
        if (encodeResolution === tpc.calculateExpectedSendResolution(localTrack)) {
            if (this._limitedByCpuTimeout) {
                window.clearTimeout(this._limitedByCpuTimeout);
                this._limitedByCpuTimeout = undefined;
            }
            if (qualityLimitationReason === QualityLimitationReason.NONE
                && this.receiveVideoController.isLastNLimitedByCpu()) {
                if (!this._lastNRampupTimeout && !this._isLastNRampupBlocked) {
                    // Ramp up the number of received videos if CPU limitation no longer exists. If the cpu
                    // limitation returns as a consequence, do not attempt to ramp up again, continue to
                    // increment the lastN value otherwise until it is equal to the channelLastN value.
                    this._lastNRampupTimeout = window.setTimeout(() => {
                        this._lastNRampupTimeout = undefined;
                        const updatedStats = this._encodeTimeStats.get(trackId);
                        const latestSourceStats = updatedStats.get(updatedStats.size() - 1);
                        if (latestSourceStats.qualityLimitationReason === QualityLimitationReason.CPU) {
                            this._isLastNRampupBlocked = true;
                        }
                        else {
                            this._lowerOrRaiseLastN(false /* raise */);
                        }
                    }, this._lastNRampupTime);
                }
            }
            return;
        }
        // Do nothing if the limitation reason is bandwidth since the browser will dynamically adapt the outbound
        // resolution based on available uplink bandwith. Otherwise,
        // 1. Switch the codec to the lowest complexity one incrementally.
        // 2. Switch to a lower lastN value, cutting the receive videos by half in every iteration until
        // MIN_LAST_N value is reached.
        // 3. Lower the receive resolution of individual streams up to 180p.
        if (qualityLimitationReason === QualityLimitationReason.CPU) {
            if (this._lastNRampupTimeout) {
                window.clearTimeout(this._lastNRampupTimeout);
                this._lastNRampupTimeout = undefined;
                this._isLastNRampupBlocked = true;
            }
            const codecSwitched = this._maybeSwitchVideoCodec(trackId);
            if (!codecSwitched && !this._limitedByCpuTimeout) {
                const lastNChanged = this._lowerOrRaiseLastN(true /* lower */);
                if (!lastNChanged) {
                    this.receiveVideoController.setReceiveResolutionLimitedByCpu(true);
                    this._maybeLowerReceiveResolution();
                }
            }
        }
    }
    /**
     * Processes the outbound RTP stream stats as reported by the WebRTC peerconnection and makes runtime adjustments
     * to the client for better quality experience if the adaptive mode is enabled.
     *
     * @param {TraceablePeerConnection} tpc - The underlying WebRTC peerconnection where stats have been captured.
     * @param {Map<number, IOutboundRtpStats>} stats - Outbound-rtp stream stats per SSRC.
     * @returns void
     */
    _processOutboundRtpStats(tpc, stats) {
        var _a;
        const activeSession = this._conference.getActiveMediaSession();
        // Process stats only for the active media session.
        if (activeSession.peerconnection !== tpc) {
            return;
        }
        const statsPerTrack = new Map();
        for (const ssrc of stats.keys()) {
            const { codec, encodeTime, qualityLimitationReason, resolution, timestamp } = stats.get(ssrc);
            const track = tpc.getTrackBySSRC(ssrc);
            const trackId = track.rtcId;
            let existingStats = statsPerTrack.get(trackId);
            const encodeResolution = Math.min(resolution === null || resolution === void 0 ? void 0 : resolution.height, resolution === null || resolution === void 0 ? void 0 : resolution.width);
            const ssrcStats = {
                encodeResolution,
                encodeTime,
                qualityLimitationReason
            };
            if (existingStats) {
                existingStats.codec = codec;
                existingStats.timestamp = timestamp;
                existingStats.trackStats.push(ssrcStats);
            }
            else {
                existingStats = {
                    codec,
                    timestamp,
                    trackStats: [ssrcStats]
                };
                statsPerTrack.set(trackId, existingStats);
            }
        }
        // Aggregate the stats for multiple simulcast streams with different SSRCs but for the same video stream.
        for (const trackId of statsPerTrack.keys()) {
            const { codec, timestamp, trackStats } = statsPerTrack.get(trackId);
            const totalEncodeTime = trackStats
                .map((stat) => stat.encodeTime)
                .reduce((totalValue, currentValue) => totalValue + currentValue, 0);
            const avgEncodeTime = totalEncodeTime / trackStats.length;
            const { qualityLimitationReason = QualityLimitationReason.NONE } = (_a = trackStats
                .find((stat) => stat.qualityLimitationReason !== QualityLimitationReason.NONE)) !== null && _a !== void 0 ? _a : {};
            const encodeResolution = trackStats
                .map((stat) => stat.encodeResolution)
                .reduce((resolution, currentValue) => Math.max(resolution, currentValue), 0);
            const localTrack = this._conference.getLocalVideoTracks().find(t => t.rtcId === trackId);
            const exisitingStats = this._encodeTimeStats.get(trackId);
            const sourceStats = {
                avgEncodeTime,
                codec,
                encodeResolution,
                qualityLimitationReason,
                localTrack,
                timestamp,
                tpc
            };
            if (exisitingStats) {
                exisitingStats.add(sourceStats);
            }
            else {
                // Save stats for only the last 5 mins.
                const data = new FixedSizeArray(300);
                data.add(sourceStats);
                this._encodeTimeStats.set(trackId, data);
            }
            logger.debug(`Encode stats for ${localTrack}: codec=${codec}, time=${avgEncodeTime},`
                + `resolution=${encodeResolution}, qualityLimitationReason=${qualityLimitationReason}`);
            this._performQualityOptimizations(sourceStats);
        }
    }
    /**
     * Gets the codec controller instance.
     */
    get codecController() {
        return this._codecController;
    }
    /**
     * Gets the receive video controller instance.
     */
    get receiveVideoController() {
        return this._receiveVideoController;
    }
    /**
     * Gets the send video controller instance.
     */
    get sendVideoController() {
        return this._sendVideoController;
    }
}
//# sourceMappingURL=QualityController.js.map