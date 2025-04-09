/**
 * Attaches to the {@link Strophe.Connection.rawInput} which is called whenever any data is received from the server.
 */
import XmppConnection from './XmppConnection';
import { Strophe } from 'strophe.js';
export default class LastRequestTracker {
    private _lastSuccess;
    private _lastFailedMessage;
    /**
     * Initializes new instance.
     */
    constructor();
    /**
     * Starts tracking requests on the given connection.
     *
     * @param {XmppConnection} xmppConnection - The XMPP connection which manages the given {@code stropheConnection}.
     * @param {Strophe.Connection} stropheConnection - Strophe connection instance.
     */
    startTracking(xmppConnection: XmppConnection, stropheConnection: Strophe.Connection): void;
    /**
     * Returns the last raw failed incoming message on the xmpp connection.
     *
     * @returns {string|null}
     */
    getLastFailedMessage(): string | null;
    /**
     * Returns how many milliseconds have passed since the last successful BOSH request.
     *
     * @returns {number|null}
     */
    getTimeSinceLastSuccess(): number | null;
}
