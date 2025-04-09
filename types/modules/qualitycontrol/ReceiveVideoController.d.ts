/**
 * This class manages the receive video contraints for a given {@link JitsiConference}. These constraints are
 * determined by the application based on how the remote video streams need to be displayed. This class is responsible
 * for communicating these constraints to the bridge over the bridge channel.
 */
export default class ReceiveVideoController {
    /**
     * Creates a new instance for a given conference.
     *
     * @param {JitsiConference} conference the conference instance for which the new instance will be managing
     * the receive video quality constraints.
     */
    constructor(conference: JitsiConference);
    _conference: JitsiConference;
    _rtc: any;
    _lastN: any;
    _maxFrameHeight: number;
    /**
     * The map that holds the max frame height requested per remote source for p2p connection.
     *
     * @type Map<string, number>
     */
    _sourceReceiverConstraints: Map<string, number>;
    /**
     * The number of bps requested from the bridge.
     */
    _assumedBandwidthBps: number;
    _lastNLimitedByCpu: boolean;
    _receiveResolutionLimitedByCpu: boolean;
    _receiverVideoConstraints: {
        assumedBandwidthBps: number;
        lastN: any;
    };
    /**
     * Returns a map of all the remote source names and the corresponding max frame heights.
     *
     * @param {JingleSessionPC} mediaSession - the media session.
     * @param {number} maxFrameHeight - the height to be requested for remote sources.
     * @returns
     */
    _getDefaultSourceReceiverConstraints(mediaSession: JingleSessionPC, maxFrameHeight: number): Map<any, any>;
    /**
     * Updates the source based constraints based on the maxHeight set.
     *
     * @param {number} maxFrameHeight - the height to be requested for remote sources.
     * @returns {void}
     */
    _updateIndividualConstraints(maxFrameHeight: number): void;
    /**
     * Returns the last set of receiver constraints that were set on the bridge channel.
     *
     * @returns {Object}
     */
    getCurrentReceiverConstraints(): any;
    /**
     * Returns the lastN value for the conference.
     *
     * @returns {number}
     */
    getLastN(): number;
    /**
     * Checks whether last-n was lowered because of a cpu limitation.
     *
     * @returns {boolean}
     */
    isLastNLimitedByCpu(): boolean;
    /**
     * Handles the {@link JitsiConferenceEvents.MEDIA_SESSION_STARTED}, that is when the conference creates new media
     * session. The preferred receive frameHeight is applied on the media session.
     *
     * @param {JingleSessionPC} mediaSession - the started media session.
     * @returns {void}
     */
    onMediaSessionStarted(mediaSession: JingleSessionPC): void;
    /**
     * Sets the assumed bandwidth bps the local participant should receive from remote participants.
     *
     * @param {number|undefined} assumedBandwidthBps - the new value.
     * @returns {void}
     */
    setAssumedBandwidthBps(assumedBandwidthBps: number | undefined): void;
    /**
     * Selects a new value for "lastN". The requested amount of videos are going to be delivered after the value is
     * in effect. Set to -1 for unlimited or all available videos.
     *
     * @param {number} value the new value for lastN.
     * @returns {void}
     */
    setLastN(value: number): void;
    /**
     * Updates the lastNLimitedByCpu field.
     *
     * @param {boolean} enabled
     * @returns {void}
     */
    setLastNLimitedByCpu(enabled: boolean): void;
    /**
     * Sets the maximum video resolution the local participant should receive from remote participants.
     *
     * @param {number|undefined} maxFrameHeight - the new value.
     * @returns {void}
     */
    setPreferredReceiveMaxFrameHeight(maxFrameHeight: number | undefined): void;
    /**
     * Sets the receiver constraints for the conference.
     *
     * @param {Object} constraints The video constraints.
     */
    setReceiverConstraints(constraints: any): void;
    /**
     * Updates the receivedResolutioLimitedByCpu field.
     *
     * @param {booem} enabled
     * @return {void}
     */
    setReceiveResolutionLimitedByCpu(enabled: booem): void;
}
