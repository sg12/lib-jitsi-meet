/**
 * The default log storage implementation.
 */
export default class DefaultLogStorage {
    private rtcStats;
    /**
     * Creates new instance of <tt>DefaultLogStorage</tt>.
     * @param rtcStats - The RTCStats instance.
     */
    constructor(rtcStats: any);
    /**
     * The DefaultLogStorage is ready when the RTCStats is ready.
     *
     * @returns {boolean} <tt>true</tt> when this storage is ready or
     * <tt>false</tt> otherwise.
     */
    isReady(): any;
    /**
     * Called by the <tt>LogCollector</tt> to store a series of log lines into
     * batch.
     *
     * @param {Array<string|Object>} logEntries - An array containing strings
     * representing log lines or aggregated lines objects.
     * @returns {void}
     */
    storeLogs(logEntries: Array<string | any>): void;
}
