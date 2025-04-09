import { Strophe } from 'strophe.js';
import Listenable from '../util/Listenable';
/**
 * Mock {@link ChatRoom}.
 */
export declare class MockChatRoom extends Listenable {
    /**
     * {@link ChatRoom.addPresenceListener}.
     */
    addPresenceListener(): void;
}
/**
 * Mock Strophe connection.
 */
export interface IProto {
    socket?: WebSocket;
}
export declare class MockStropheConnection extends Listenable {
    private _connectCb?;
    sentIQs: any[];
    private _proto;
    /**
     * A constructor...
     */
    constructor();
    /**
     * XMPP service URL.
     *
     * @returns {string}
     */
    get service(): string;
    /**
     * {@see Strophe.Connection.connect}
     */
    connect(jid: string, pass: string, callback: (status: Strophe.Status) => void): void;
    /**
     * {@see Strophe.Connection.disconnect}
     */
    disconnect(): void;
    /**
     * Simulates transition to the new connection status.
     *
     * @param {Strophe.Status} newState - The new connection status to set.
     * @returns {void}
     */
    simulateConnectionState(newState: Strophe.Status): void;
    /**
     * {@see Strophe.Connection.sendIQ}.
     */
    sendIQ(iq: any, resultCb?: () => void): void;
    /**
     * {@see Strophe.Connection.registerSASLMechanisms}.
     */
    registerSASLMechanisms(): void;
}
