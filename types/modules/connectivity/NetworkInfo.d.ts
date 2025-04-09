import Listenable from '../util/Listenable';
export declare const NETWORK_INFO_EVENT = "NETWORK_INFO_CHANGED";
export interface ICurrentNetworkInfo {
    isOnline: boolean;
}
/**
 * Module provides information about the current status of the internet
 * connection. Lib-jitsi-meet doesn't have any logic for detecting internet
 * online/offline, but rather it relies on the information supplied by the app
 * that uses it. By default the online state is assumed and the lib acts as if
 * it was connected. See {@link JitsiMeetJS.setNetworkInfo}.
 */
export declare class NetworkInfo extends Listenable {
    private _current;
    /**
     * Creates new {@link NetworkInfo} instance.
     */
    constructor();
    /**
     * Updates the network info state.
     *
     * @param {object} state - The network info state.
     * @param {boolean} state.isOnline - {@code true} if the internet connectivity is online or {@code false}
     * otherwise.
     */
    updateNetworkInfo({ isOnline }: {
        isOnline: boolean;
    }): void;
    /**
     * Returns the online/offline internet status. By default the value is {@code true} and changes only if
     * the lib's user wires the state through {@link JitsiMeetJS.setNetworkInfo} like the jitsi-meet does. Because of
     * that any logic should still assume that the internet may be offline and should handle the failure gracefully.
     * It's only a good hint in the other way around: to pause internet operations until it comes back online.
     * @returns {boolean}
     */
    isOnline(): boolean;
}
declare const networkInfo: NetworkInfo;
export default networkInfo;
