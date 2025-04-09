import JitsiConference from '../../JitsiConference';
import JitsiParticipant from '../../JitsiParticipant';
export interface IPingMessage {
    id: number;
    type: string;
}
export interface IE2ePingOptions {
    e2eping?: {
        maxConferenceSize?: number;
        maxMessagesPerSecond?: number;
        numRequests?: number;
    };
}
export interface IRequest {
    id: number;
    rtt?: number;
    timeSent: number;
}
/**
 * Saves e2e ping related state for a single JitsiParticipant.
 */
declare class ParticipantWrapper {
    participant: JitsiParticipant;
    e2eping: E2ePing;
    id: string;
    requests: {
        [key: number]: IRequest;
    };
    lastRequestId: number;
    timeout: number | null;
    /**
     * Creates a ParticipantWrapper
     * @param {JitsiParticipant} participant - The remote participant that this
     * object wraps.
     * @param {E2ePing} e2eping
     */
    constructor(participant: JitsiParticipant, e2eping: E2ePing);
    /**
     * Schedule the next ping to be sent.
     */
    scheduleNext(): number;
    /**
     * Stop pinging this participant, canceling a scheduled ping, if any.
     */
    stop(): void;
    /**
     * Get the delay until the next ping in milliseconds.
     */
    getDelay(): number;
    /**
     * Sends the next ping request.
     * @type {*}
     */
    sendRequest(): void;
    /**
     * Handles a response from this participant.
     * @type {*}
     */
    handleResponse(response: any): void;
    /**
     * Check if we've received the pre-configured number of responses, and if
     * so log the measured RTT and stop sending requests.
     * @type {*}
     */
    maybeLogRttAndStop(): void;
}
/**
 * Implements end-to-end ping (from one conference participant to another) via
 * the jitsi-videobridge channel (either WebRTC data channel or web socket).
 *
 * TODO: use a broadcast message instead of individual pings to each remote
 * participant.
 *
 * This class:
 * 1. Sends periodic ping requests to all other participants in the
 * conference.
 * 2. Responds to ping requests from other participants.
 * 3. Fires events with the end-to-end RTT to each participant whenever a
 * response is received.
 * 4. Fires analytics events with the end-to-end RTT periodically.
 */
export default class E2ePing {
    conference: JitsiConference;
    eventEmitter: any;
    sendMessage: (message: IPingMessage, participantId: string) => void;
    participants: {
        [key: string]: ParticipantWrapper;
    };
    numRequests: number;
    maxConferenceSize: number;
    maxMessagesPerSecond: number;
    /**
     * @param {JitsiConference} conference - The conference.
     * @param {Function} sendMessage - The function to use to send a message.
     * @param {Object} options
     */
    constructor(conference: JitsiConference, options: IE2ePingOptions, sendMessage: (message: IPingMessage, participantId: string) => void);
    /**
     * Delay processing USER_JOINED events until the MUC is fully joined,
     * otherwise the apparent conference size will be wrong.
     */
    conferenceJoined(): void;
    /**
     * Handles a message that was received.
     *
     * @param participant - The message sender.
     * @param payload - The payload of the message.
     */
    messageReceived(participant: JitsiParticipant, payload: IPingMessage): void;
    /**
     * Handles a participant joining the conference. Starts to send ping
     * requests to the participant.
     *
     * @param {String} id - The ID of the participant.
     * @param {JitsiParticipant} participant - The participant that joined.
     */
    participantJoined(id: string, participant: JitsiParticipant): void;
    /**
     * Remove a participant without calling "stop".
     */
    removeParticipant(id: string): void;
    /**
     * Handles a participant leaving the conference. Stops sending requests.
     *
     * @param {String} id - The ID of the participant.
     */
    participantLeft(id: string): void;
    /**
     * Handles a ping request coming from another participant.
     *
     * @param {string} participantId - The ID of the participant who sent the
     * request.
     * @param {Object} request - The request.
     */
    handleRequest(participantId: string, request: {
        id: number;
    }): void;
    /**
     * Handles a ping response coming from another participant
     * @param {string} participantId - The ID of the participant who sent the
     * response.
     * @param {Object} response - The response.
     */
    handleResponse(participantId: string, response: {
        id: number;
    }): void;
    /**
     * Stops this E2ePing (i.e. stop sending requests).
     */
    stop(): void;
}
export {};
