import JitsiConference from '../../JitsiConference';
/**
 * This module implements a discard-all insertable stream.  Use to reduce decoder CPU load for testing.
 */
export declare class LiteModeContext {
    private enabled;
    /**
     * A constructor.
     * @param {JitsiConference} conference - The conference instance for which lite mode is to be enabled.
     */
    constructor(conference: JitsiConference);
    /**
     * Setup Lite Mode for a track.
     *
     * @private
     */
    private _setupLiteModeForTrack;
}
