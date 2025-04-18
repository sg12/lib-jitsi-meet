/**
 * Interface for face landmarks.
 */
interface IFaceLandmarks {
    duration: number;
    faceExpression: string;
}
/**
 * A model for keeping track of each user's total
 * time as a dominant speaker. The model also
 * keeps track of the user's last known name
 * in case the user has left the meeting,
 * which is also tracked.
 */
declare class SpeakerStats {
    private _userId;
    private displayName;
    private _isLocalStats;
    private totalDominantSpeakerTime;
    private _dominantSpeakerStart;
    private _isDominantSpeaker;
    private _isSilent;
    private _hasLeft;
    private _faceLandmarks;
    /**
     * Initializes a new SpeakerStats instance.
     *
     * @constructor
     * @param {string} userId - The id of the user being tracked.
     * @param {string} displayName - The name of the user being tracked.
     * @param {boolean} isLocalStats - True if the stats model tracks
     * the local user.
     * @returns {void}
     */
    constructor(userId: string, displayName: string, isLocalStats: boolean);
    /**
     * Get the user id being tracked.
     *
     * @returns {string} The user id.
     */
    getUserId(): string;
    /**
     * Get the name of the user being tracked.
     *
     * @returns {string} The user name.
     */
    getDisplayName(): string;
    /**
     * Updates the last known name of the user being tracked.
     *
     * @param {string} newName - The user name.
     * @returns {void}
     */
    setDisplayName(newName: string): void;
    /**
     * Returns true if the stats are tracking the local user.
     *
     * @returns {boolean}
     */
    isLocalStats(): boolean;
    /**
     * Returns true if the tracked user is currently a dominant speaker.
     *
     * @returns {boolean}
     */
    isDominantSpeaker(): boolean;
    /**
     * Returns true if the tracked user is currently a dominant speaker.
     *
     * @param {boolean} isNowDominantSpeaker - If true, the user will be accumulating time
     * as dominant speaker. If false, the user will not accumulate time
     * and will record any time accumulated since starting as dominant speaker.
     * @param {boolean} silence - Indicates whether the dominant speaker is silent or not.
     * @returns {void}
     */
    setDominantSpeaker(isNowDominantSpeaker: boolean, silence: boolean): void;
    /**
     * Get how long the tracked user has been dominant speaker.
     *
     * @returns {number} - The speaker time in milliseconds.
     */
    getTotalDominantSpeakerTime(): number;
    /**
     * Get whether or not the user is still in the meeting.
     *
     * @returns {boolean} True if the user is no longer in the meeting.
     */
    hasLeft(): boolean;
    /**
     * Set the user as having left the meeting.
     *
     * @returns {void}
     */
    markAsHasLeft(): void;
    /**
     * Gets the face landmarks of the user.
     *
     * @returns {IFaceLandmarks[]}
     */
    getFaceLandmarks(): IFaceLandmarks[];
    /**
     * Sets the face landmarks of the user.
     *
     * @param {IFaceLandmarks[]} faceLandmarks - object with face expressions.
     * @returns {void}
     */
    setFaceLandmarks(faceLandmarks: IFaceLandmarks[]): void;
    /**
     * Adds new face landmarks to speaker stats.
     *
     * @param  {IFaceLandmarks} faceLandmarks
     */
    addFaceLandmarks(faceLandmarks: IFaceLandmarks): void;
}
export default SpeakerStats;
