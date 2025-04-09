import { IWatchRTCConfiguration } from './interfaces';
/**
 * Class that controls the watchRTC flow, because it overwrites and proxies global function it should only be
 * initialized once.
 */
declare class WatchRTCHandler {
    options?: IWatchRTCConfiguration;
    /**
     * Initialize watchRTC, it overwrites GUM and PeerConnection global functions and adds a proxy over them
     * used to capture stats.
     *
     * @param {Object} options - Init options.
     * @returns {void}
     */
    init(options: any): void;
    /**
     * Begin watchRTC session considering roomName and userName if already not available
     *
     * @param {string} roomName - The room name we are currently in.
     * @param {string} userName - The user name. This value is obtained from
     * JitsiConference.prototype.myUserId
     * @returns {void}
     */
    start(roomName: string, userName: string): void;
}
declare const _default: WatchRTCHandler;
export default _default;
