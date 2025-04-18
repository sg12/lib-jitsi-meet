import { Strophe } from 'strophe.js';
import Listenable from '../util/Listenable';
/* eslint-disable no-empty-function */
/**
 * Mock {@link ChatRoom}.
 */
export class MockChatRoom extends Listenable {
    /**
     * {@link ChatRoom.addPresenceListener}.
     */
    addPresenceListener() {
        // no operation; intentionally left blank
    }
}
export class MockStropheConnection extends Listenable {
    /**
     * A constructor...
     */
    constructor() {
        super();
        this.sentIQs = [];
        this._proto = {
            socket: undefined
        };
    }
    /**
     * XMPP service URL.
     *
     * @returns {string}
     */
    get service() {
        return 'wss://localhost/xmpp-websocket';
    }
    /**
     * {@see Strophe.Connection.connect}
     */
    connect(jid, pass, callback) {
        this._connectCb = callback;
    }
    /**
     * {@see Strophe.Connection.disconnect}
     */
    disconnect() {
        this.simulateConnectionState(Strophe.Status.DISCONNECTING);
        this.simulateConnectionState(Strophe.Status.DISCONNECTED);
    }
    /**
     * Simulates transition to the new connection status.
     *
     * @param {Strophe.Status} newState - The new connection status to set.
     * @returns {void}
     */
    simulateConnectionState(newState) {
        var _a;
        if (newState === Strophe.Status.CONNECTED) {
            this._proto.socket = { readyState: WebSocket.OPEN };
        }
        else {
            this._proto.socket = undefined;
        }
        (_a = this._connectCb) === null || _a === void 0 ? void 0 : _a.call(this, newState);
    }
    /**
     * {@see Strophe.Connection.sendIQ}.
     */
    sendIQ(iq, resultCb) {
        this.sentIQs.push(iq);
        resultCb && resultCb();
    }
    /**
     * {@see Strophe.Connection.registerSASLMechanisms}.
     */
    registerSASLMechanisms() {
        // Intentionally left blank for mock functionality
    }
}
/* eslint-enable no-empty-function */
//# sourceMappingURL=MockClasses.js.map