import EventEmitter from '../util/EventEmitter';
export interface IVADScore {
    deviceId: string;
    score: number;
    timestamp: Date;
}
/**
 * Detect if provided VAD score which is generated on a muted device is voice and fires an event.
 */
export default class VADTalkMutedDetection extends EventEmitter {
    private _processing;
    private _scoreArray;
    private _active;
    private _processTimeout?;
    /**
     * Creates <tt>VADTalkMutedDetection</tt>
     * @constructor
     */
    constructor();
    /**
     * Compute cumulative VAD score function called once the PROCESS_TIME_FRAME_SPAN_MS timeout has elapsed.
     * @returns {void}
     * @fires VAD_TALK_WHILE_MUTED
     */
    private _calculateVADScore;
    /**
     * Set the active state of the detection service and notify any listeners.
     *
     * @param {boolean} active
     * @fires DETECTOR_STATE_CHANGE
     */
    private _setActiveState;
    /**
     * Change the state according to the muted status of the tracked device.
     *
     * @param {boolean} isMuted - Is the device muted or not.
     */
    changeMuteState(isMuted: boolean): void;
    /**
     * Check whether or not the service is active or not.
     *
     * @returns {boolean}
     */
    isActive(): boolean;
    /**
     * Listens for {@link TrackVADEmitter} events and processes them.
     *
     * @param {Object} vadScore -VAD score emitted by {@link TrackVADEmitter}
     * @param {Date}   vadScore.timestamp - Exact time at which processed PCM sample was generated.
     * @param {number} vadScore.score - VAD score on a scale from 0 to 1 (i.e. 0.7)
     * @param {string} vadScore.deviceId - Device id of the associated track.
     * @listens VAD_SCORE_PUBLISHED
     */
    processVADScore(vadScore: IVADScore): void;
    /**
     * Reset the processing context, clear buffer, cancel the timeout trigger.
     *
     * @returns {void}
     */
    reset(): void;
}
