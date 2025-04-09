import { MediaType } from '../../service/RTC/MediaType';
import ChatRoom from './ChatRoom';
export interface IModerationEnabledByType {
    audio: boolean;
    video: boolean;
}
export interface IMessageObject {
    actor: string;
    approved: boolean;
    enabled: boolean;
    mediaType: MediaType;
    removed: boolean;
    whitelists: {
        audio: string[];
        video: string[];
    };
}
/**
 * The AVModeration logic.
 */
export default class AVModeration {
    /**
     * Constructs AV moderation room.
     *
     * @param {ChatRoom} room the main room.
     */
    private _xmpp;
    private _mainRoom;
    private _moderationEnabledByType;
    private _whitelistAudio;
    private _whitelistVideo;
    constructor(room: ChatRoom);
    /**
     * Stops listening for events.
     */
    dispose(): void;
    /**
     * Whether AV moderation is supported on backend.
     *
     * @returns {boolean} whether AV moderation is supported on backend.
     */
    isSupported(): boolean;
    /**
     * Enables or disables AV Moderation by sending a msg with command to the component.
     */
    enable(state: string, mediaType: MediaType): void;
    /**
     * Approves that a participant can unmute by sending a msg with its jid to the component.
     */
    approve(mediaType: MediaType, jid: string): void;
    /**
     * Rejects that a participant can unmute by sending a msg with its jid to the component.
     */
    reject(mediaType: MediaType, jid: string): void;
    /**
     * Receives av_moderation parsed messages as json.
     * @param obj the parsed json content of the message to process.
     * @private
     */
    _onMessage(obj: IMessageObject): void;
}
