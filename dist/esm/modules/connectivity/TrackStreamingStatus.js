import { getLogger } from '@jitsi/logger';
import { JitsiConferenceEvents } from '../../JitsiConferenceEvents';
import * as JitsiTrackEvents from '../../JitsiTrackEvents';
import RTCEvents from '../../service/RTC/RTCEvents';
import { createTrackStreamingStatusEvent } from '../../service/statistics/AnalyticsEvents';
import browser from '../browser';
import Statistics from '../statistics/statistics';
/** Track streaming statuses. */
export var TrackStreamingStatus;
(function (TrackStreamingStatus) {
    /**
     * Status indicating that streaming is currently active.
     */
    TrackStreamingStatus["ACTIVE"] = "active";
    /**
     * Status indicating that streaming is currently inactive.
     * Inactive means the streaming was stopped on purpose from the bridge, like exiting forwarded sources or
     * adaptivity decided to drop video because of not enough bandwidth.
     */
    TrackStreamingStatus["INACTIVE"] = "inactive";
    /**
     * Status indicating that streaming is currently interrupted.
     */
    TrackStreamingStatus["INTERRUPTED"] = "interrupted";
    /**
     * Status indicating that streaming is currently restoring.
     */
    TrackStreamingStatus["RESTORING"] = "restoring";
})(TrackStreamingStatus || (TrackStreamingStatus = {}));
const logger = getLogger('modules/connectivity/TrackStreamingStatus');
/**
 * Default value of 500 milliseconds for {@link TrackStreamingStatusImpl.outOfForwardedSourcesTimeout}.
 */
const DEFAULT_NOT_IN_FORWARDED_SOURCES_TIMEOUT = 500;
/**
 * Default value of 2500 milliseconds for {@link TrackStreamingStatusImpl.p2pRtcMuteTimeout}.
 */
const DEFAULT_P2P_RTC_MUTE_TIMEOUT = 2500;
/**
 * Default value of 10000 milliseconds for {@link TrackStreamingStatusImpl.rtcMuteTimeout}.
 */
const DEFAULT_RTC_MUTE_TIMEOUT = 10000;
/**
 * The time to wait a track to be restored. Track which was out of forwarded sources should be inactive and when
 * entering forwarded sources it becomes restoring and when data is received from bridge it will become active, but if
 * no data is received for some time we set status of that track streaming to interrupted.
 */
const DEFAULT_RESTORING_TIMEOUT = 10000;
/**
 * Class is responsible for emitting JitsiTrackEvents.TRACK_STREAMING_STATUS_CHANGED events.
 */
export class TrackStreamingStatusImpl {
    /* eslint-disable max-params */
    /**
     * Calculates the new {@link TrackStreamingStatus} based on the values given for some specific remote track. It is
     * assumed that the conference is currently in the JVB mode (in contrary to the P2P mode)
     * @param isInForwardedSources - indicates whether the track is in the forwarded sources set. When set to
     * false it means that JVB is not sending any video for the track.
     * @param isRestoringTimedout - if true it means that the track has been outside of forwarded sources too
     * long to be considered {@link TrackStreamingStatus.RESTORING}.
     * @param isVideoMuted - true if the track is video muted and we should not expect to receive any video.
     * @param isVideoTrackFrozen - if the current browser support video frozen detection then it will be set to
     * true when the video track is frozen. If the current browser does not support frozen detection the it's always
     * false.
     * @return {TrackStreamingStatus} the new streaming status for the track for whom the values above were provided.
     * @private
     */
    static _getNewStateForJvbMode(isInForwardedSources, isRestoringTimedout, isVideoMuted, isVideoTrackFrozen) {
        // We are currently not checking the endpoint connection status received from the JVB.
        if (isVideoMuted) {
            // If the connection is active according to JVB and the track is video muted there is no way for the
            // connection to be inactive, because the detection logic below only makes sense for video.
            return TrackStreamingStatus.ACTIVE;
        }
        // Logic when isVideoTrackFrozen is supported
        if (browser.supportsVideoMuteOnConnInterrupted()) {
            if (!isVideoTrackFrozen) {
                // If the video is playing we're good
                return TrackStreamingStatus.ACTIVE;
            }
            else if (isInForwardedSources) {
                return isRestoringTimedout ? TrackStreamingStatus.INTERRUPTED : TrackStreamingStatus.RESTORING;
            }
            return TrackStreamingStatus.INACTIVE;
        }
        // Because this browser is incapable of detecting frozen video we must rely on the forwarded sources value
        return isInForwardedSources ? TrackStreamingStatus.ACTIVE : TrackStreamingStatus.INACTIVE;
    }
    /* eslint-enable max-params */
    /**
     * In P2P mode we don't care about any values coming from the JVB and the streaming status can be only active or
     * interrupted.
     * @param isVideoMuted - true if video muted
     * @param isVideoTrackFrozen - true if the video track for the remote track is currently frozen. If the
     * current browser does not support video frozen detection then it's always false.
     * @return {TrackStreamingStatus}
     * @private
     */
    static _getNewStateForP2PMode(isVideoMuted, isVideoTrackFrozen) {
        if (!browser.supportsVideoMuteOnConnInterrupted()) {
            // There's no way to detect problems in P2P when there's no video track frozen detection...
            return TrackStreamingStatus.ACTIVE;
        }
        return isVideoMuted || !isVideoTrackFrozen
            ? TrackStreamingStatus.ACTIVE : TrackStreamingStatus.INTERRUPTED;
    }
    /**
     * Creates new instance of <tt>TrackStreamingStatus</tt>.
     *
     * @constructor
     * @param rtc - the RTC service instance
     * @param conference - parent conference instance // TODO: Needs JitsiConference Type
     * @param {Object} options
     * @param {number} [options.p2pRtcMuteTimeout=2500] custom value for
     * {@link TrackStreamingStatusImpl.p2pRtcMuteTimeout}.
     * @param {number} [options.rtcMuteTimeout=2000] custom value for
     * {@link TrackStreamingStatusImpl.rtcMuteTimeout}.
     * @param {number} [options.outOfForwardedSourcesTimeout=500] custom value for
     * {@link TrackStreamingStatusImpl.outOfForwardedSourcesTimeout}.
     */
    constructor(rtc, conference, track, options) {
        this.rtc = rtc;
        this.conference = conference;
        this.track = track;
        this.restoringTimer = null;
        this.rtcMutedTimestamp = null;
        this.streamingStatusMap = {};
        this.trackTimer = null;
        this.outOfForwardedSourcesTimeout = typeof options.outOfForwardedSourcesTimeout === 'number'
            ? options.outOfForwardedSourcesTimeout : DEFAULT_NOT_IN_FORWARDED_SOURCES_TIMEOUT;
        this.p2pRtcMuteTimeout = typeof options.p2pRtcMuteTimeout === 'number'
            ? options.p2pRtcMuteTimeout : DEFAULT_P2P_RTC_MUTE_TIMEOUT;
        this.rtcMuteTimeout = typeof options.rtcMuteTimeout === 'number'
            ? options.rtcMuteTimeout : DEFAULT_RTC_MUTE_TIMEOUT;
        logger.info(`RtcMuteTimeout set to: ${this.rtcMuteTimeout}`);
    }
    /**
     * Gets the video frozen timeout for given source name.
     * @return how long are we going to wait since RTC video muted even, before a video track is considered
     * frozen.
     * @private
     */
    _getVideoFrozenTimeout() {
        const sourceName = this.track.getSourceName();
        return this.rtc.isInForwardedSources(sourceName)
            ? this.rtcMuteTimeout
            : this.conference.isP2PActive() ? this.p2pRtcMuteTimeout : this.outOfForwardedSourcesTimeout;
    }
    /**
     * Initializes <tt>TrackStreamingStatus</tt> and bind required event listeners.
     */
    init() {
        // Handles P2P status changes
        this._onP2PStatus = this.figureOutStreamingStatus.bind(this);
        this.conference.on(JitsiConferenceEvents.P2P_STATUS, this._onP2PStatus);
        // Used to send analytics events for the participant that left the call.
        this._onUserLeft = this.onUserLeft.bind(this);
        this.conference.on(JitsiConferenceEvents.USER_LEFT, this._onUserLeft);
        // On some browsers MediaStreamTrack trigger "onmute"/"onunmute" events for video type tracks when they stop
        // receiving data which is often a sign that remote user is having connectivity issues.
        if (browser.supportsVideoMuteOnConnInterrupted()) {
            this._onTrackRtcMuted = this.onTrackRtcMuted.bind(this);
            this.rtc.addListener(RTCEvents.REMOTE_TRACK_MUTE, this._onTrackRtcMuted);
            this._onTrackRtcUnmuted = this.onTrackRtcUnmuted.bind(this);
            this.rtc.addListener(RTCEvents.REMOTE_TRACK_UNMUTE, this._onTrackRtcUnmuted);
            // Listened which will be bound to JitsiRemoteTrack to listen for signalling mute/unmute events.
            this._onSignallingMuteChanged = this.onSignallingMuteChanged.bind(this);
            this.track.on(JitsiTrackEvents.TRACK_MUTE_CHANGED, this._onSignallingMuteChanged);
            // Used to send an analytics event when the video type changes.
            this._onTrackVideoTypeChanged = this.onTrackVideoTypeChanged.bind(this);
            this.track.on(JitsiTrackEvents.TRACK_VIDEOTYPE_CHANGED, this._onTrackVideoTypeChanged);
        }
        this._onForwardedSourcesChanged = this.onForwardedSourcesChanged.bind(this);
        this.conference.on(JitsiConferenceEvents.FORWARDED_SOURCES_CHANGED, this._onForwardedSourcesChanged);
        this._onLastNValueChanged = this.figureOutStreamingStatus.bind(this);
        this.rtc.on(RTCEvents.LASTN_VALUE_CHANGED, this._onLastNValueChanged);
    }
    /**
     * Removes all event listeners and disposes of all resources held by this instance.
     */
    dispose() {
        if (browser.supportsVideoMuteOnConnInterrupted()) {
            this.rtc.removeListener(RTCEvents.REMOTE_TRACK_MUTE, this._onTrackRtcMuted);
            this.rtc.removeListener(RTCEvents.REMOTE_TRACK_UNMUTE, this._onTrackRtcUnmuted);
            this.track.off(JitsiTrackEvents.TRACK_MUTE_CHANGED, this._onSignallingMuteChanged);
            this.track.off(JitsiTrackEvents.TRACK_VIDEOTYPE_CHANGED, this._onTrackVideoTypeChanged);
        }
        this.conference.off(JitsiConferenceEvents.FORWARDED_SOURCES_CHANGED, this._onForwardedSourcesChanged);
        this.conference.off(JitsiConferenceEvents.P2P_STATUS, this._onP2PStatus);
        this.conference.off(JitsiConferenceEvents.USER_LEFT, this._onUserLeft);
        this.rtc.removeListener(RTCEvents.LASTN_VALUE_CHANGED, this._onLastNValueChanged);
        this.clearTimeout();
        this.clearRtcMutedTimestamp();
        this.maybeSendTrackStreamingStatusEvent(Date.now());
        this.figureOutStreamingStatus();
    }
    /**
     * Changes streaming status.
     * @param newStatus
     */
    _changeStreamingStatus(newStatus) {
        if (this.track.getTrackStreamingStatus() !== newStatus) {
            const sourceName = this.track.getSourceName();
            this.track._setTrackStreamingStatus(newStatus);
            logger.debug(`Emit track streaming status(${Date.now()}) ${sourceName}: ${newStatus}`);
            // It's common for the event listeners to access the JitsiRemoteTrack. Thus pass it as a parameter here.
            this.track.emit(JitsiTrackEvents.TRACK_STREAMING_STATUS_CHANGED, this.track, newStatus);
        }
    }
    /**
     * Reset the postponed "streaming interrupted" event which was previously scheduled as a timeout on RTC 'onmute'
     * event.
     */
    clearTimeout() {
        if (this.trackTimer) {
            window.clearTimeout(this.trackTimer);
            this.trackTimer = null;
        }
    }
    /**
     * Clears the timestamp of the RTC muted event for remote video track.
     */
    clearRtcMutedTimestamp() {
        this.rtcMutedTimestamp = null;
    }
    /**
     * Checks if track is considered frozen.
     * @return <tt>true</tt> if the video has frozen or <tt>false</tt> when it's either not considered frozen
     * (yet) or if freeze detection is not supported by the current browser.
     *
     * FIXME merge this logic with NO_DATA_FROM_SOURCE event implemented in JitsiLocalTrack by extending the event to
     *       the remote track and allowing to set different timeout for local and remote tracks.
     */
    isVideoTrackFrozen() {
        if (!browser.supportsVideoMuteOnConnInterrupted()) {
            return false;
        }
        const isVideoRTCMuted = this.track.isWebRTCTrackMuted();
        const rtcMutedTimestamp = this.rtcMutedTimestamp;
        const timeout = this._getVideoFrozenTimeout();
        return isVideoRTCMuted && typeof rtcMutedTimestamp === 'number' && (Date.now() - rtcMutedTimestamp) >= timeout;
    }
    /**
     * Figures out (and updates) the current streaming status for the track identified by the source name.
     */
    figureOutStreamingStatus() {
        const sourceName = this.track.getSourceName();
        const inP2PMode = this.conference.isP2PActive();
        const isRestoringTimedOut = this._isRestoringTimedout();
        const audioOnlyMode = this.conference.getLastN() === 0;
        // NOTE Overriding videoMuted to true for audioOnlyMode should disable any detection based on video playback or
        // forwarded sources.
        const isVideoMuted = this.track.isMuted() || audioOnlyMode;
        const isVideoTrackFrozen = this.isVideoTrackFrozen();
        const isInForwardedSources = this.rtc.isInForwardedSources(sourceName);
        const newState = inP2PMode
            ? TrackStreamingStatusImpl._getNewStateForP2PMode(isVideoMuted, isVideoTrackFrozen)
            : TrackStreamingStatusImpl._getNewStateForJvbMode(isInForwardedSources, isRestoringTimedOut, isVideoMuted, isVideoTrackFrozen);
        // if the new state is not restoring clear timers and timestamps that we use to track the restoring state
        if (newState !== TrackStreamingStatus.RESTORING) {
            this._clearRestoringTimer();
        }
        logger.debug(`Figure out conn status for ${sourceName}, is video muted: ${isVideoMuted} video track frozen: ${isVideoTrackFrozen} p2p mode: ${inP2PMode} is in forwarded sources: ${isInForwardedSources} currentStatus => newStatus: ${this.track.getTrackStreamingStatus()} => ${newState}`);
        const oldStreamingStatus = this.streamingStatusMap || {};
        // Send an analytics event (guard on either the p2p flag or the streaming status has changed since the last
        // time this code block run).
        if (!('p2p' in oldStreamingStatus)
            || !('streamingStatus' in oldStreamingStatus)
            || oldStreamingStatus.p2p !== inP2PMode
            || oldStreamingStatus.streamingStatus !== newState) {
            const nowMs = Date.now();
            this.maybeSendTrackStreamingStatusEvent(nowMs);
            this.streamingStatusMap = Object.assign(Object.assign({}, oldStreamingStatus), { streamingStatus: newState, p2p: inP2PMode, startedMs: nowMs });
            // sometimes (always?) we're late to hook the TRACK_VIDEOTYPE_CHANGED event and the video type is not in
            // oldStreamingStatus.
            if (!('videoType' in this.streamingStatusMap)) {
                this.streamingStatusMap.videoType = this.track.getVideoType();
            }
        }
        this._changeStreamingStatus(newState);
    }
    /**
     * Computes the duration of the current streaming status for the track (i.e. 15 seconds in the INTERRUPTED state)
     * and sends a track streaming status event.
     * @param nowMs - The current time (in millis).
     */
    maybeSendTrackStreamingStatusEvent(nowMs) {
        const trackStreamingStatus = this.streamingStatusMap;
        if (trackStreamingStatus
            && 'startedMs' in trackStreamingStatus
            && 'videoType' in trackStreamingStatus
            && 'streamingStatus' in trackStreamingStatus
            && 'p2p' in trackStreamingStatus) {
            trackStreamingStatus.value = nowMs - trackStreamingStatus.startedMs;
            Statistics.sendAnalytics(createTrackStreamingStatusEvent(trackStreamingStatus));
        }
    }
    /**
     * On change in forwarded sources set check all leaving and entering track to change their corresponding statuses.
     *
     * @param leavingForwardedSources - The array of sourceName leaving forwarded sources.
     * @param enteringForwardedSources - The array of sourceName entering forwarded sources.
     * @param timestamp - The time in millis
     * @private
     */
    onForwardedSourcesChanged(leavingForwardedSources = [], enteringForwardedSources = [], timestamp) {
        const sourceName = this.track.getSourceName();
        // If the browser doesn't fire the mute/onmute events when the remote peer stops/starts sending media,
        // calculate the streaming status for all the tracks since it won't get triggered automatically on the track
        // that has started/stopped receiving media.
        if (!browser.supportsVideoMuteOnConnInterrupted()) {
            this.figureOutStreamingStatus();
        }
        if (leavingForwardedSources.includes(sourceName)) {
            this.track._clearEnteredForwardedSourcesTimestamp();
            this._clearRestoringTimer();
            browser.supportsVideoMuteOnConnInterrupted() && this.figureOutStreamingStatus();
        }
        if (enteringForwardedSources.includes(sourceName)) {
            // store the timestamp this track is entering forwarded sources
            this.track._setEnteredForwardedSourcesTimestamp(timestamp);
            browser.supportsVideoMuteOnConnInterrupted() && this.figureOutStreamingStatus();
        }
    }
    /**
     * Clears the restoring timer for video track and the timestamp for entering forwarded sources.
     */
    _clearRestoringTimer() {
        const rTimer = this.restoringTimer;
        if (rTimer) {
            clearTimeout(rTimer);
            this.restoringTimer = null;
        }
    }
    /**
     * Checks whether a track had stayed enough in restoring state, compares current time and the time the track
     * entered in forwarded sources. If it hasn't timedout and there is no timer added, add new timer in order to give
     * it more time to become active or mark it as interrupted on next check.
     *
     * @returns <tt>true</tt> if the track was in restoring state more than the timeout
     * ({@link DEFAULT_RESTORING_TIMEOUT}.) in order to set its status to interrupted.
     * @private
     */
    _isRestoringTimedout() {
        const enteredForwardedSourcesTimestamp = this.track._getEnteredForwardedSourcesTimestamp();
        if (enteredForwardedSourcesTimestamp
            && (Date.now() - enteredForwardedSourcesTimestamp) >= DEFAULT_RESTORING_TIMEOUT) {
            return true;
        }
        // still haven't reached timeout, if there is no timer scheduled, schedule one so we can track the restoring
        // state and change it after reaching the timeout
        const rTimer = this.restoringTimer;
        if (!rTimer) {
            this.restoringTimer = setTimeout(() => this.figureOutStreamingStatus(), DEFAULT_RESTORING_TIMEOUT);
        }
        return false;
    }
    /** Checks whether a track is the current track. */
    _isCurrentTrack(track) {
        return track.getSourceName() === this.track.getSourceName();
    }
    /**
     * Sends a last/final track streaming status event for the track of the user that left the conference.
     * @param id - The id of the participant that left the conference.
     */
    onUserLeft(id) {
        if (this.track.getParticipantId() === id) {
            this.maybeSendTrackStreamingStatusEvent(Date.now());
            this.streamingStatusMap = {};
        }
    }
    /**
     * Handles RTC 'onmute' event for the video track.
     *
     * @param track - The video track for which 'onmute' event will be processed.
     */
    onTrackRtcMuted(track) {
        if (!this._isCurrentTrack(track)) {
            return;
        }
        const sourceName = track.getSourceName();
        logger.debug(`Detector track RTC muted: ${sourceName}`, Date.now());
        this.rtcMutedTimestamp = Date.now();
        if (!track.isMuted()) {
            // If the user is not muted according to the signalling we'll give it some time, before the streaming
            // interrupted event is triggered.
            this.clearTimeout();
            // The timeout is reduced when track is not in the forwarded sources
            const timeout = this._getVideoFrozenTimeout();
            this.trackTimer = window.setTimeout(() => {
                logger.debug(`Set track RTC muted for: ${sourceName} after the timeout of ${timeout} ms`);
                this.clearTimeout();
                this.figureOutStreamingStatus();
            }, timeout);
        }
    }
    /**
     * Handles RTC 'onunmute' event for the video track.
     *
     * @param track - The video track for which 'onunmute' event will be processed.
     */
    onTrackRtcUnmuted(track) {
        if (!this._isCurrentTrack(track)) {
            return;
        }
        const sourceName = this.track.getSourceName();
        logger.debug(`Detector track RTC unmuted: ${sourceName}`, Date.now());
        this.clearTimeout();
        this.clearRtcMutedTimestamp();
        this.figureOutStreamingStatus();
    }
    /**
     * Here the signalling "mute"/"unmute" events are processed.
     *
     * @param track - The remote video track for which the signalling mute/unmute event will be
     * processed.
     */
    onSignallingMuteChanged(track) {
        if (!this._isCurrentTrack(track)) {
            return;
        }
        this.figureOutStreamingStatus();
    }
    /**
     * Sends a track streaming status event as a result of the video type changing.
     * @deprecated this will go away with full multiple streams support
     * @param type - The video type.
     */
    onTrackVideoTypeChanged(type) {
        const nowMs = Date.now();
        this.maybeSendTrackStreamingStatusEvent(nowMs);
        this.streamingStatusMap = Object.assign(Object.assign({}, this.streamingStatusMap || {}), { videoType: type, startedMs: nowMs });
    }
}
export default TrackStreamingStatusImpl;
//# sourceMappingURL=TrackStreamingStatus.js.map