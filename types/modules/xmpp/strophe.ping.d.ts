import { Strophe } from 'strophe.js';
import ConnectionPlugin from './ConnectionPlugin';
export interface IPingOptions {
    interval?: number;
    threshold?: number;
    timeout?: number;
}
export interface IPingConnectionPluginOptions {
    getTimeSinceLastServerResponse: () => number;
    onPingThresholdExceeded: () => void;
    pingOptions?: IPingOptions;
}
/**
 * XEP-0199 ping plugin.
 *
 * Registers "urn:xmpp:ping" namespace under Strophe.NS.PING.
 */
export default class PingConnectionPlugin extends ConnectionPlugin {
    failedPings: number;
    _onPingThresholdExceeded: () => void;
    _getTimeSinceLastServerResponse: () => number;
    pingInterval: number;
    pingTimeout: number;
    pingThreshold: number;
    pingTimestampsToKeep: number;
    pingExecIntervals: number[];
    intervalId: number | null;
    _lastServerCheck: number;
    /**
     * Constructs new object
     * @param {Object} options
     * @param {Function} options.onPingThresholdExceeded - Callback called when ping fails too many times (controlled
     * by the {@link PING_THRESHOLD} constant).
     * @param {Function} options.getTimeSinceLastServerResponse - A function to obtain the last seen
     * response from the server.
     * @param {Object} options.pingOptions - The ping options if any.
     * @constructor
     */
    constructor({ getTimeSinceLastServerResponse, onPingThresholdExceeded, pingOptions }: IPingConnectionPluginOptions);
    /**
     * Initializes the plugin. Method called by Strophe.
     * @param connection Strophe connection instance.
     */
    init(connection: Strophe.Connection): void;
    /**
     * Sends "ping" to given <tt>jid</tt>
     * @param jid the JID to which ping request will be sent.
     * @param success callback called on success.
     * @param error callback called on error.
     * @param timeout ms how long are we going to wait for the response. On
     * timeout <tt>error<//t> callback is called with undefined error argument.
     */
    ping(jid: string, success: (result: any) => void, error: (err: any) => void, timeout: number): void;
    /**
     * Starts to send ping in given interval to specified remote JID.
     * This plugin supports only one such task and <tt>stopInterval</tt>
     * must be called before starting a new one.
     * @param remoteJid remote JID to which ping requests will be sent to.
     */
    startInterval(remoteJid: string): void;
    /**
     * Stops current "ping"  interval task.
     */
    stopInterval(): void;
    /**
     * Adds the current time to the array of send ping timestamps.
     * @private
     */
    _addPingExecutionTimestamp(): void;
    /**
     * Returns the maximum time between the recent sent pings, if there is a
     * big value it means the computer was inactive for some time(suspended).
     * Checks the maximum gap between sending pings, considering and the
     * current time. Trying to detect computer inactivity (sleep).
     *
     * @returns {int} the time ping was suspended, if it was not 0 is returned.
     */
    getPingSuspendTime(): number;
}
