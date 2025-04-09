/**
 * A global module for accessing information about different feature flags state.
 */
declare class FeatureFlags {
    private _runInLiteMode;
    private _ssrcRewriting;
    /**
     * Configures the module.
     *
     * @param {object} flags - The feature flags.
     * @param {boolean=} flags.runInLiteMode - Enables lite mode for testing to disable media decoding.
     * @param {boolean=} flags.ssrcRewritingEnabled - Use SSRC rewriting.
     */
    init(flags: {
        runInLiteMode?: boolean | undefined;
        ssrcRewritingEnabled?: boolean | undefined;
    }): void;
    /**
     * Checks if the run in lite mode is enabled.
     * This will cause any media to be received and not decoded. (Insertable streams are used to discard
     * all media before it is decoded). This can be used for various test scenarios.
     *
     * @returns {boolean}
     */
    isRunInLiteModeEnabled(): boolean;
    /**
     * Checks if the clients supports re-writing of the SSRCs on the media streams by the bridge.
     * @returns {boolean}
     */
    isSsrcRewritingSupported(): boolean;
}
declare const _default: FeatureFlags;
export default _default;
