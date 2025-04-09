/**
 * This class handles the codec selection mechanism for the conference based on the config.js settings.
 * The preferred codec is selected based on the settings and the list of codecs supported by the browser.
 * The preferred codec is published in presence which is then used by the other endpoints in the
 * conference to pick a supported codec at join time and when the call transitions between p2p and jvb
 * connections.
 */
export class CodecSelection {
    /**
     * Creates a new instance for a given conference.
     *
     * @param {JitsiConference} conference the conference instance
     * @param {*} options
     * @param {string} options.jvb settings (codec list, preferred and disabled) for the jvb connection.
     * @param {string} options.p2p settings (codec list, preferred and disabled) for the p2p connection.
     */
    constructor(conference: JitsiConference, options: any);
    codecPreferenceOrder: {};
    conference: JitsiConference;
    encodeTimeStats: Map<any, any>;
    options: any;
    screenshareCodec: {};
    visitorCodecs: any[];
    /**
     * Returns a list of video codecs that are supported by the browser.
     *
     * @param {string} connectionType - media connection type, p2p or jvb.
     * @returns {Array}
     */
    _getSupportedVideoCodecs(connectionType: string): any[];
    /**
     * Returns the current codec preference order for the given connection type.
     *
     * @param {String} connectionType The media connection type, 'p2p' or 'jvb'.
     * @returns {Array<string>}
     */
    getCodecPreferenceList(connectionType: string): Array<string>;
    /**
     * Returns the preferred screenshare codec for the given connection type.
     *
     * @param {String} connectionType The media connection type, 'p2p' or 'jvb'.
     * @returns CodecMimeType
     */
    getScreenshareCodec(connectionType: string): any;
    /**
     * Sets the codec on the media session based on the codec preference order configured in config.js and the supported
     * codecs published by the remote participants in their presence.
     *
     * @param {JingleSessionPC} mediaSession session for which the codec selection has to be made.
     */
    selectPreferredCodec(mediaSession: JingleSessionPC): void;
    /**
     * Changes the codec preference order.
     *
     * @param {JitsiLocalTrack} localTrack - The local video track.
     * @param {CodecMimeType} codec - The codec used for encoding the given local video track.
     * @returns boolean - Returns true if the codec order has been updated, false otherwise.
     */
    changeCodecPreferenceOrder(localTrack: JitsiLocalTrack, codec: CodecMimeType): boolean;
    /**
     * Updates the aggregate list of the codecs supported by all the visitors in the call and calculates the
     * selected codec if needed.
     * @param {Array} codecList - visitor codecs.
     * @returns {void}
     */
    updateVisitorCodecs(codecList: any[]): void;
}
import { CodecMimeType } from '../../service/RTC/CodecMimeType';
