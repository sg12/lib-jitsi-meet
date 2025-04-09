/**
 * Custom semi-mock implementation for the Proxy connection service.
 */
export default class CustomSignalingLayer extends SignalingLayer {
    /**
     * A map that stores SSRCs of remote streams.
     * @type {Map<number, string>} maps SSRC number to jid
     */
    ssrcOwners: Map<number, string>;
    /**
     *
     * @type {ChatRoom|null}
     */
    chatRoom: ChatRoom | null;
    /**
     * @inheritDoc
     */
    getPeerMediaInfo(owner: any, mediaType: any, sourceName: any): {};
    /**
     * @inheritDoc
     */
    getPeerSourceInfo(owner: any, sourceName: any): any;
    /**
     * @inheritDoc
     */
    getSSRCOwner(ssrc: any): string;
    /**
     * @inheritDoc
     */
    getTrackSourceName(ssrc: any): any;
    /**
     * @inheritDoc
     */
    removeSSRCOwners(ssrcList: any): void;
    /**
     * Sets the <tt>ChatRoom</tt> instance used.
     * @param {ChatRoom} room
     */
    setChatRoom(room: ChatRoom): void;
    /**
     * @inheritDoc
     */
    setSSRCOwner(ssrc: any, endpointId: any): void;
    /**
     * @inheritDoc
     */
    setTrackMuteStatus(sourceName: any, muted: any): boolean;
    /**
     * @inheritDoc
     */
    setTrackVideoType(sourceName: any, videoType: any): boolean;
    /**
     * @inheritDoc
     */
    updateSsrcOwnersOnLeave(id: any): void;
}
import SignalingLayer from '../../service/RTC/SignalingLayer';
