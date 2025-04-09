import { VideoType } from '../../service/RTC/VideoType';
import { MockRTC, MockSignalingLayerImpl } from '../RTC/MockClasses';
import Listenable from '../util/Listenable';
import JingleSessionPC from '../xmpp/JingleSessionPC';
/**
 * MockParticipant
 */
export declare class MockParticipant {
    id: string;
    /**
     * A constructor...
     */
    constructor(id: string);
    /**
     * Returns the endpoint id of the participant.
     * @returns <string>
     */
    getId(): string;
}
/**
 * MockLocalTrack
 */
export declare class MockLocalTrack {
    maxEnabledResolution: number;
    rtcId: string;
    videoType: VideoType;
    captureResolution: number;
    /**
     * Constructor
     * @param {number} resolution
     * @param {VideoType} videoType
     */
    constructor(id: string, resolution: number, videoType: VideoType);
    /**
     * Gets the capture resolution of the mock local track.
     * @returns - The capture resolution.
     */
    getCaptureResolution(): number;
    /**
     * Returns the video type of the mock local track.
     * @returns {VideoType}
     */
    getVideoType(): VideoType;
}
/**
 * MockConference
 */
export declare class MockConference extends Listenable {
    options: {
        config: {};
    };
    activeMediaSession: JingleSessionPC;
    jvbJingleSession: JingleSessionPC;
    mediaSessions: JingleSessionPC[];
    participants: MockParticipant[];
    rtc: MockRTC;
    _signalingLayer: MockSignalingLayerImpl;
    /**
     * A constructor...
     */
    constructor(rtc: MockRTC);
    /**
     * Add a mock participant to the conference
     * @param {MockParticipant} participant
     * @param {Array<string>} codecList
     * @param {String} codecType
     */
    addParticipant(participant: MockParticipant, codecList: Array<string>, codecType: string): void;
    /**
     * Returns the active media session.
     * @returns {JingleSessionPC}
     */
    getActiveMediaSession(): JingleSessionPC;
    /**
     * Returns a list of forwarded sources.
     * @returns {Array<string>}
     */
    getForwardedSources(): string[];
    /**
     * Returns the list of participants.
     * @returns Array<MockParticipant>
     */
    getParticipants(): Array<MockParticipant>;
    /**
     * Checks if E2EE is enabled.
     * @returns {boolean}
     */
    isE2EEEnabled(): boolean;
    /**
     * Removes the participant from the conference.
     * @param {MockParticipant} endpoint
     */
    removeParticipant(endpoint: MockParticipant): void;
}
