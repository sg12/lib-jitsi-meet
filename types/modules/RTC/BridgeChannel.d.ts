/// <reference types="node" />
import { EventEmitter } from 'events';
import JitsiConference from '../../JitsiConference';
import { BridgeVideoType } from '../../service/RTC/BridgeVideoType';
import { SourceName } from '../../service/RTC/SignalingLayer';
import ReceiverVideoConstraints from '../qualitycontrol/ReceiveVideoController';
/**
 * Handles a WebRTC RTCPeerConnection or a WebSocket instance to communicate
 * with the videobridge.
 */
export default class BridgeChannel {
    private _channel;
    private _conference;
    private _connected;
    private _eventEmitter;
    private _mode;
    private _areRetriesEnabled;
    private _closedFromClient;
    private _wsUrl?;
    private _retryTimeout?;
    /**
     * Binds "ondatachannel" event listener on the given RTCPeerConnection
     * instance, or creates a WebSocket connection with the videobridge.
     * At least one of both, peerconnection or wsUrl parameters, must be
     * given.
     * @param {RTCPeerConnection} [peerconnection] WebRTC peer connection
     * instance.
     * @param {string} [wsUrl] WebSocket URL.
     * @param {EventEmitter} emitter the EventEmitter instance to use for event emission.
     * @param {JitsiConference} conference the conference instance.
     */
    constructor(peerconnection: RTCPeerConnection | null, wsUrl: string | null, emitter: EventEmitter, conference: JitsiConference);
    /**
     * Initializes the web socket channel.
     *
     * @returns {void}
     */
    _initWebSocket(): void;
    /**
     * Starts the websocket connection retries.
     *
     * @returns {void}
     */
    _startConnectionRetries(): void;
    /**
     * Stops the websocket connection retries.
     *
     * @returns {void}
     */
    _stopConnectionRetries(): void;
    /**
     * Retries to establish the websocket connection after the connection was closed by the server.
     *
     * @param {CloseEvent} closeEvent - The close event that triggered the retries.
     * @returns {void}
     */
    _retryWebSocketConnection(closeEvent: CloseEvent): void;
    /**
     * The channel mode.
     * @return {string} "datachannel" or "websocket" (or null if not yet set).
     */
    get mode(): string;
    /**
     * Closes the currently opened channel.
     */
    close(): void;
    /**
     * Whether there is an underlying RTCDataChannel or WebSocket and it's
     * open.
     * @return {boolean}
     */
    isOpen(): boolean;
    /**
     * Sends local stats via the bridge channel.
     * @param {Object} payload The payload of the message.
     * @throws NetworkError/InvalidStateError/Error if the operation fails or if there is no data channel created.
     */
    sendEndpointStatsMessage(payload: Record<string, unknown>): void;
    /**
     * Sends message via the channel.
     * @param {string} to The id of the endpoint that should receive the
     * message. If "" the message will be sent to all participants.
     * @param  {object} payload The payload of the message.
     * @throws NetworkError or InvalidStateError from RTCDataChannel#send (@see
     * {@link https://developer.mozilla.org/docs/Web/API/RTCDataChannel/send})
     * or from WebSocket#send or Error with "No opened channel" message.
     */
    sendMessage(to: string, payload: Record<string, unknown>): void;
    /**
     * Sends a "lastN value changed" message via the channel.
     * @param {number} value The new value for lastN. -1 means unlimited.
     */
    sendSetLastNMessage(value: number): void;
    /**
     * Sends a 'ReceiverVideoConstraints' message via the bridge channel.
     *
     * @param {ReceiverVideoConstraints} constraints video constraints.
     */
    sendReceiverVideoConstraintsMessage(constraints: ReceiverVideoConstraints): void;
    /**
     * Sends a 'SourceVideoTypeMessage' message via the bridge channel.
     *
     * @param {BridgeVideoType} videoType - the video type.
     * @param {SourceName} sourceName - the source name of the video track.
     * @returns {void}
     */
    sendSourceVideoTypeMessage(sourceName: SourceName, videoType: BridgeVideoType): void;
    /**
     * Set events on the given RTCDataChannel or WebSocket instance.
     */
    _handleChannel(channel: RTCDataChannel | WebSocket): void;
    /**
     * Sends passed object via the channel.
     * @param {object} jsonObject The object that will be sent.
     * @throws NetworkError or InvalidStateError from RTCDataChannel#send (@see
     * {@link https://developer.mozilla.org/docs/Web/API/RTCDataChannel/send})
     * or from WebSocket#send or Error with "No opened channel" message.
     */
    _send(jsonObject: Record<string, unknown>): void;
}
