/**
 * A model for keeping track of each user's total
 * time as a dominant speaker. The model also
 * keeps track of the user's last known name
 * in case the user has left the meeting,
 * which is also tracked.
 */
class SpeakerStats {
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
    constructor(userId, displayName, isLocalStats) {
        this._userId = userId;
        this.setDisplayName(displayName);
        this._isLocalStats = isLocalStats || false;
        this.setDominantSpeaker(false, false);
        this.totalDominantSpeakerTime = 0;
        this._dominantSpeakerStart = 0;
        this._isDominantSpeaker = false;
        this._isSilent = false;
        this._hasLeft = false;
        this._faceLandmarks = [];
    }
    /**
     * Get the user id being tracked.
     *
     * @returns {string} The user id.
     */
    getUserId() {
        return this._userId;
    }
    /**
     * Get the name of the user being tracked.
     *
     * @returns {string} The user name.
     */
    getDisplayName() {
        return this.displayName;
    }
    /**
     * Updates the last known name of the user being tracked.
     *
     * @param {string} newName - The user name.
     * @returns {void}
     */
    setDisplayName(newName) {
        this.displayName = newName;
    }
    /**
     * Returns true if the stats are tracking the local user.
     *
     * @returns {boolean}
     */
    isLocalStats() {
        return this._isLocalStats;
    }
    /**
     * Returns true if the tracked user is currently a dominant speaker.
     *
     * @returns {boolean}
     */
    isDominantSpeaker() {
        return this._isDominantSpeaker;
    }
    /**
     * Returns true if the tracked user is currently a dominant speaker.
     *
     * @param {boolean} isNowDominantSpeaker - If true, the user will be accumulating time
     * as dominant speaker. If false, the user will not accumulate time
     * and will record any time accumulated since starting as dominant speaker.
     * @param {boolean} silence - Indicates whether the dominant speaker is silent or not.
     * @returns {void}
     */
    setDominantSpeaker(isNowDominantSpeaker, silence) {
        if (!this.isDominantSpeaker() && isNowDominantSpeaker && !silence) {
            this._dominantSpeakerStart = Date.now();
        }
        else if (this.isDominantSpeaker()) {
            if (!isNowDominantSpeaker) {
                if (!this._isSilent) {
                    const now = Date.now();
                    const timeElapsed = now - this._dominantSpeakerStart;
                    this.totalDominantSpeakerTime += timeElapsed;
                    this._dominantSpeakerStart = 0;
                }
            }
            else if (this._isSilent && !silence) {
                this._dominantSpeakerStart = Date.now();
            }
            else if (!this._isSilent && silence) {
                const now = Date.now();
                const timeElapsed = now - this._dominantSpeakerStart;
                this.totalDominantSpeakerTime += timeElapsed;
                this._dominantSpeakerStart = 0;
            }
        }
        this._isDominantSpeaker = isNowDominantSpeaker;
        this._isSilent = silence;
    }
    /**
     * Get how long the tracked user has been dominant speaker.
     *
     * @returns {number} - The speaker time in milliseconds.
     */
    getTotalDominantSpeakerTime() {
        let total = this.totalDominantSpeakerTime;
        if (this.isDominantSpeaker() && !this._isSilent) {
            total += Date.now() - this._dominantSpeakerStart;
        }
        return total;
    }
    /**
     * Get whether or not the user is still in the meeting.
     *
     * @returns {boolean} True if the user is no longer in the meeting.
     */
    hasLeft() {
        return this._hasLeft;
    }
    /**
     * Set the user as having left the meeting.
     *
     * @returns {void}
     */
    markAsHasLeft() {
        this._hasLeft = true;
        this.setDominantSpeaker(false, false);
    }
    /**
     * Gets the face landmarks of the user.
     *
     * @returns {IFaceLandmarks[]}
     */
    getFaceLandmarks() {
        return this._faceLandmarks;
    }
    /**
     * Sets the face landmarks of the user.
     *
     * @param {IFaceLandmarks[]} faceLandmarks - object with face expressions.
     * @returns {void}
     */
    setFaceLandmarks(faceLandmarks) {
        this._faceLandmarks = faceLandmarks;
    }
    /**
     * Adds new face landmarks to speaker stats.
     *
     * @param  {IFaceLandmarks} faceLandmarks
     */
    addFaceLandmarks(faceLandmarks) {
        this._faceLandmarks.push(faceLandmarks);
    }
}
export default SpeakerStats;
//# sourceMappingURL=SpeakerStats.js.map