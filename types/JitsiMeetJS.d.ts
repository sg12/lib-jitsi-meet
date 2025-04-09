import * as JitsiConferenceErrors from './JitsiConferenceErrors';
import * as JitsiConferenceEvents from './JitsiConferenceEvents';
import JitsiConnection from './JitsiConnection';
import * as JitsiConnectionErrors from './JitsiConnectionErrors';
import * as JitsiConnectionEvents from './JitsiConnectionEvents';
import * as JitsiMediaDevicesEvents from './JitsiMediaDevicesEvents';
import JitsiTrackError from './JitsiTrackError';
import * as JitsiTrackErrors from './JitsiTrackErrors';
import * as JitsiTrackEvents from './JitsiTrackEvents';
import * as JitsiTranscriptionStatus from './JitsiTranscriptionStatus';
import * as RTCStatsEvents from './modules/RTCStats/RTCStatsEvents';
import { TrackStreamingStatus } from './modules/connectivity/TrackStreamingStatus';
import * as DetectionEvents from './modules/detection/DetectionEvents';
import TrackVADEmitter from './modules/detection/TrackVADEmitter';
import ProxyConnectionService from './modules/proxyconnection/ProxyConnectionService';
import { IIceServer, IPreCallResult } from './modules/statistics/PreCallTest';
import * as VideoSIPGWConstants from './modules/videosipgw/VideoSIPGWConstants';
import AudioMixer from './modules/webaudio/AudioMixer';
import { MediaType } from './service/RTC/MediaType';
import { VideoType } from './service/RTC/VideoType';
import * as ConnectionQualityEvents from './service/connectivity/ConnectionQualityEvents';
import * as E2ePingEvents from './service/e2eping/E2ePingEvents';
interface ICreateLocalTrackOptions {
    cameraDeviceId?: string;
    devices?: any[];
    fireSlowPromiseEvent?: boolean;
    micDeviceId?: string;
    resolution?: string;
}
type desktopSharingSourceType = 'screen' | 'window';
interface IJitsiMeetJSOptions {
    analytics?: {
        rtcstatsLogFlushSizeBytes?: number;
        rtcstatsStoreLogs?: boolean;
    };
    desktopSharingSources?: Array<desktopSharingSourceType>;
    enableAnalyticsLogging?: boolean;
    enableWindowOnErrorHandler?: boolean;
    externalStorage?: Storage;
    flags?: {
        runInLiteMode?: boolean;
        ssrcRewritingEnabled?: boolean;
    };
}
interface ICreateLocalTrackFromMediaStreamOptions {
    mediaType: MediaType;
    sourceType: string;
    stream: MediaStream;
    track: any;
    videoType?: VideoType;
}
/**
 * The public API of the Jitsi Meet library (a.k.a. {@code JitsiMeetJS}).
 */
declare const _default: {
    version: string;
    JitsiConnection: typeof JitsiConnection;
    /**
     * {@code ProxyConnectionService} is used to connect a remote peer to a
     * local Jitsi participant without going through a Jitsi conference. It is
     * currently used for room integration development, specifically wireless
     * screensharing. Its API is experimental and will likely change; usage of
     * it is advised against.
     */
    ProxyConnectionService: typeof ProxyConnectionService;
    constants: {
        recording: import("./modules/recording/recordingConstants").IRecordingConstants;
        sipVideoGW: typeof VideoSIPGWConstants;
        transcriptionStatus: typeof JitsiTranscriptionStatus;
        trackStreamingStatus: typeof TrackStreamingStatus;
    };
    events: {
        conference: typeof JitsiConferenceEvents;
        connection: typeof JitsiConnectionEvents;
        detection: typeof DetectionEvents;
        track: typeof JitsiTrackEvents;
        mediaDevices: typeof JitsiMediaDevicesEvents;
        connectionQuality: typeof ConnectionQualityEvents;
        e2eping: typeof E2ePingEvents;
        rtcstats: typeof RTCStatsEvents;
    };
    errors: {
        conference: typeof JitsiConferenceErrors;
        connection: typeof JitsiConnectionErrors;
        track: typeof JitsiTrackErrors;
    };
    errorTypes: {
        JitsiTrackError: typeof JitsiTrackError;
    };
    logLevels: any;
    mediaDevices: unknown;
    analytics: unknown;
    init(options?: IJitsiMeetJSOptions): void;
    /**
     * Returns whether the desktop sharing is enabled or not.
     *
     * @returns {boolean}
     */
    isDesktopSharingEnabled(): boolean;
    /**
     * Returns whether the current execution environment supports WebRTC (for
     * use within this library).
     *
     * @returns {boolean} {@code true} if WebRTC is supported in the current
     * execution environment (for use within this library); {@code false},
     * otherwise.
     */
    isWebRtcSupported(): boolean;
    setLogLevel(level: any): void;
    /**
     * Expose rtcstats to the public API.
     */
    rtcstats: {
        /**
         * Checks if the rtcstats trace is available.
         * The trace is the abstraction for the underlying rtcstats websocket connection.
         *
         * @returns {boolean} <tt>true</tt> if the rtcstats trace is available or
         * <tt>false</tt> otherwise.
         */
        isTraceAvailable(): boolean;
        /**
         * Sends identity data to the rtcstats server. This data is used
         * to identify the specifics of a particular client, it can be any object
         * and will show in the generated rtcstats dump under "identity" entries.
         *
         * @param {Object} identityData - Identity data to send.
         * @returns {void}
         */
        sendIdentityEntry(identityData: any): void;
        /**
         * Sends a stats entry to rtcstats server.
         * @param {string} statsType - The type of stats to send.
         * @param {Object} data - The stats data to send.
         */
        sendStatsEntry(statsType: any, data: any): void;
        /**
         * Events generated by rtcstats, such as PeerConnections state,
         * and websocket connection state.
         *
         * @param {RTCStatsEvents} event - The event name.
         * @param {function} handler - The event handler.
         */
        on(event: any, handler: any): void;
    };
    /**
     * Sets the log level to the <tt>Logger</tt> instance with given id.
     *
     * @param {Logger.levels} level the logging level to be set
     * @param {string} id the logger id to which new logging level will be set.
     * Usually it's the name of the JavaScript source file including the path
     * ex. "modules/xmpp/ChatRoom.js"
     */
    setLogLevelById(level: any, id: any): void;
    /**
     * Registers new global logger transport to the library logging framework.
     *
     * @param globalTransport
     * @see Logger.addGlobalTransport
     */
    addGlobalLogTransport(globalTransport: any): void;
    /**
     * Removes global logging transport from the library logging framework.
     *
     * @param globalTransport
     * @see Logger.removeGlobalTransport
     */
    removeGlobalLogTransport(globalTransport: any): void;
    /**
    * Sets global options which will be used by all loggers. Changing these
    * works even after other loggers are created.
    *
    * @param options
    * @see Logger.setGlobalOptions
    */
    setGlobalLogOptions(options: any): void;
    /**
     * Creates local media tracks.
     *
     * @param options Object with properties / settings specifying the tracks
     * which should be created. should be created or some additional
     * configurations about resolution for example.
     * @param {Array} options.effects optional effects array for the track
     * @param {Array} options.devices the devices that will be requested
     * @param {string} options.resolution resolution constraints
     * @param {string} options.cameraDeviceId
     * @param {string} options.micDeviceId
     *
     * @returns {Promise.<{Array.<JitsiTrack>}, JitsiConferenceError>} A promise
     * that returns an array of created JitsiTracks if resolved, or a
     * JitsiConferenceError if rejected.
     */
    createLocalTracks(options?: ICreateLocalTrackOptions): any;
    /**
     * Manually create JitsiLocalTrack's from the provided track info, by exposing the RTC method
     *
     * @param {Array<ICreateLocalTrackFromMediaStreamOptions>} tracksInfo - array of track information
     * @returns {Array<JitsiLocalTrack>} - created local tracks
     */
    createLocalTracksFromMediaStreams(tracksInfo: ICreateLocalTrackFromMediaStreamOptions[]): import("./modules/RTC/JitsiLocalTrack").default[];
    /**
     * Create a TrackVADEmitter service that connects an audio track to an VAD (voice activity detection) processor in
     * order to obtain VAD scores for individual PCM audio samples.
     * @param {string} localAudioDeviceId - The target local audio device.
     * @param {number} sampleRate - Sample rate at which the emitter will operate. Possible values  256, 512, 1024,
     * 4096, 8192, 16384. Passing other values will default to closes neighbor.
     * I.e. Providing a value of 4096 means that the emitter will process 4096 PCM samples at a time, higher values mean
     * longer calls, lowers values mean more calls but shorter.
     * @param {Object} vadProcessor - VAD Processors that does the actual compute on a PCM sample.The processor needs
     * to implement the following functions:
     * - <tt>getSampleLength()</tt> - Returns the sample size accepted by calculateAudioFrameVAD.
     * - <tt>getRequiredPCMFrequency()</tt> - Returns the PCM frequency at which the processor operates.
     * i.e. (16KHz, 44.1 KHz etc.)
     * - <tt>calculateAudioFrameVAD(pcmSample)</tt> - Process a 32 float pcm sample of getSampleLength size.
     * @returns {Promise<TrackVADEmitter>}
     */
    createTrackVADEmitter(localAudioDeviceId: any, sampleRate: any, vadProcessor: any): Promise<TrackVADEmitter>;
    /**
     * Create AudioMixer, which is essentially a wrapper over web audio ChannelMergerNode. It essentially allows the
     * user to mix multiple MediaStreams into a single one.
     *
     * @returns {AudioMixer}
     */
    createAudioMixer(): AudioMixer;
    /**
     * Go through all audio devices on the system and return one that is active, i.e. has audio signal.
     *
     * @returns Promise<Object> - Object containing information about the found device.
     */
    getActiveAudioDevice(): Promise<any>;
    /**
     * Checks if the current environment supports having multiple audio
     * input devices in use simultaneously.
     *
     * @returns {boolean} True if multiple audio input devices can be used.
     */
    isMultipleAudioInputSupported(): any;
    /**
     * Checks if local tracks can collect stats and collection is enabled.
     *
     * @param {boolean} True if stats are being collected for local tracks.
     */
    isCollectingLocalStats(): boolean;
    /**
     * Informs lib-jitsi-meet about the current network status.
     *
     * @param {object} state - The network info state.
     * @param {boolean} state.isOnline - {@code true} if the internet connectivity is online or {@code false}
     * otherwise.
     */
    setNetworkInfo({ isOnline }: {
        isOnline: any;
    }): void;
    /**
     * Run a pre-call test to check the network conditions.
     *
     * @param {IIceServer} iceServers  - The ICE servers to use for the test,
     * @returns {Promise<PreCallResult | any>} - A Promise that resolves with the test results or rejects with an error
     * message.
     */
    runPreCallTest(iceServers: IIceServer[]): Promise<IPreCallResult | any>;
    /**
     * Represents a hub/namespace for utility functionality which may be of
     * interest to lib-jitsi-meet clients.
     */
    util: {
        ScriptUtil: {
            loadScript({ src, async, prepend, relativeURL, loadCallback, errorCallback }: import("./modules/util/ScriptUtil").ILoadScriptOptions): void;
        };
        browser: import("./modules/browser/BrowserCapabilities").default;
    };
};
export default _default;
