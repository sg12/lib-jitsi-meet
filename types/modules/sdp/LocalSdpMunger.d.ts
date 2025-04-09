/**
 * Fakes local SDP exposed to {@link JingleSessionPC} through the local description getter. Modifies the SDP, so that
 * the stream identifiers are unique across all of the local PeerConnections and that the source names and video types
 * are injected so that Jicofo can use them to identify the sources.
 */
export default class LocalSdpMunger {
    /**
     * Creates new <tt>LocalSdpMunger</tt> instance.
     *
     * @param {TraceablePeerConnection} tpc
     * @param {string} localEndpointId - The endpoint id of the local user.
     */
    constructor(tpc: TraceablePeerConnection, localEndpointId: string);
    tpc: TraceablePeerConnection;
    localEndpointId: string;
    /**
     * Updates or adds a 'msid' attribute for the local sources in the SDP. Also adds 'sourceName' and 'videoType'
     * (if applicable) attributes. All other source attributes like 'cname', 'label' and 'mslabel' are removed since
     * these are not processed by Jicofo.
     *
     * @param {MLineWrap} mediaSection - The media part (audio or video) of the session description which will be
     * modified in place.
     * @returns {void}
     * @private
     */
    private _transformMediaIdentifiers;
    /**
     * This transformation will make sure that stream identifiers are unique across all of the local PeerConnections
     * even if the same stream is used by multiple instances at the same time. It also injects 'sourceName' and
     * 'videoType' attribute.
     *
     * @param {RTCSessionDescription} sessionDesc - The local session description (this instance remains unchanged).
     * @param {Map<string, TPCSSRCInfo>} ssrcMap - The SSRC and source map for the local tracks.
     * @return {RTCSessionDescription} - Transformed local session description
     * (a modified copy of the one given as the input).
     */
    transformStreamIdentifiers(sessionDesc: RTCSessionDescription, ssrcMap: Map<string, TPCSSRCInfo>): RTCSessionDescription;
}
