/**
 * A class that provides methods for comparing the source information present in two different SDPs so that the delta
 * can be signaled to Jicofo via 'source-remove' or 'source-add'.
 */
export class SDPDiffer {
    /**
     * Constructor.
     *
     * @param {SDP} mySdp - the new SDP.
     * @param {SDP} othersSdp - the old SDP.
     * @param {boolean} isP2P - Whether the SDPs belong to a p2p peerconnection.
     */
    constructor(mySdp: SDP, othersSdp: SDP, isP2P?: boolean);
    isP2P: boolean;
    mySdp: SDP;
    othersSdp: SDP;
    /**
     * Returns a map of the sources that are present in 'othersSdp' but not in 'mySdp'.
     *
     * @returns {*}
     */
    getNewMedia(): any;
    /**
     * Adds the diff source info to the provided IQ stanza.
     *
     * @param {*} modify - Stanza IQ.
     * @returns {boolean}
     */
    toJingle(modify: any): boolean;
}
