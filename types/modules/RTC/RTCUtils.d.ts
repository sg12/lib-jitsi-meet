export default rtcUtils;
declare const rtcUtils: RTCUtils;
/**
 *
 */
declare class RTCUtils extends Listenable {
    /**
     * Depending on the browser, sets difference instance methods for
     * interacting with user media and adds methods to native WebRTC-related
     * objects. Also creates an instance variable for peer connection
     * constraints.
     *
     * @param {Object} options
     * @returns {void}
     */
    init(options?: any): void;
    attachMediaStream: Function;
    pcConstraints: {};
    /**
     *
     * @param {Function} callback
     */
    enumerateDevices(callback: Function): void;
    /**
     * Acquires a media stream via getUserMedia that
     * matches the given constraints
     *
     * @param {array} umDevices which devices to acquire (e.g. audio, video)
     * @param {Object} constraints - Stream specifications to use.
     * @param {number} timeout - The timeout in ms for GUM.
     * @returns {Promise}
     */
    _getUserMedia(umDevices: any[], constraints?: any, timeout?: number): Promise<any>;
    /**
     * Acquire a display stream via the screenObtainer. This requires extra
     * logic compared to use screenObtainer versus normal device capture logic
     * in RTCUtils#_getUserMedia.
     *
     * @param {Object} options - Optional parameters.
     * @returns {Promise} A promise which will be resolved with an object which
     * contains the acquired display stream. If desktop sharing is not supported
     * then a rejected promise will be returned.
     */
    _getDesktopMedia(options: any): Promise<any>;
    /**
     * Private utility for determining if the passed in MediaStream contains
     * tracks of the type(s) specified in the requested devices.
     *
     * @param {string[]} requestedDevices - The track types that are expected to
     * be includes in the stream.
     * @param {MediaStream} stream - The MediaStream to check if it has the
     * expected track types.
     * @returns {string[]} An array of string with the missing track types. The
     * array will be empty if all requestedDevices are found in the stream.
     */
    _getMissingTracks(requestedDevices: string[], stream: MediaStream): string[];
    /**
     * Event handler for the 'devicechange' event.
     *
     * @param {MediaDeviceInfo[]} devices - list of media devices.
     * @emits RTCEvents.DEVICE_LIST_CHANGED
     */
    _onMediaDevicesListChanged(devicesReceived: any): void;
    /**
     * Update known devices.
     *
     * @param {Array<Object>} pds - The new devices.
     * @returns {void}
     *
     * NOTE: Use this function as a shared callback to handle both the devicechange event and the
     * polling implementations.
     * This prevents duplication and works around a chrome bug (verified to occur on 68) where devicechange
     * fires twice in a row, which can cause async post devicechange processing to collide.
     */
    _updateKnownDevices(pds: Array<any>): void;
    /**
     * Updates the granted permissions based on the options we requested and the
     * streams we received.
     * @param um the options we requested to getUserMedia.
     * @param stream the stream we received from calling getUserMedia.
     */
    _updateGrantedPermissions(um: any, stream: any): void;
    /**
     * Gets streams from specified device types. This function intentionally
     * ignores errors for upstream to catch and handle instead.
     *
     * @param {Object} options - A hash describing what devices to get and
     * relevant constraints.
     * @param {string[]} options.devices - The types of media to capture. Valid
     * values are "desktop", "audio", and "video".
     * @param {Object} options.desktopSharingFrameRate
     * @param {Object} options.desktopSharingFrameRate.min - Minimum fps
     * @param {Object} options.desktopSharingFrameRate.max - Maximum fps
     * @param {String} options.desktopSharingSourceDevice - The device id or
     * label for a video input source that should be used for screensharing.
     * @param {Array<string>} options.desktopSharingSources - The types of sources ("screen", "window", etc)
     * from which the user can select what to share.
     * @returns {Promise} The promise, when successful, will return an array of
     * meta data for the requested device type, which includes the stream and
     * track. If an error occurs, it will be deferred to the caller for
     * handling.
     */
    obtainAudioAndVideoPermissions: (options: {
        devices: string[];
        desktopSharingFrameRate: {
            min: any;
            max: any;
        };
        desktopSharingSourceDevice: string;
        desktopSharingSources: Array<string>;
    }) => Promise<any>;
    /**
     * Checks whether it is possible to enumerate available cameras/microphones.
     *
     * @returns {boolean} {@code true} if the device listing is available;
     * {@code false}, otherwise.
     */
    isDeviceListAvailable(): boolean;
    /**
     * Returns true if changing the input (camera / microphone) or output
     * (audio) device is supported and false if not.
     * @params {string} [deviceType] - type of device to change. Default is
     *      undefined or 'input', 'output' - for audio output device change.
     * @returns {boolean} true if available, false otherwise.
     */
    isDeviceChangeAvailable(deviceType: any): boolean;
    /**
     * A method to handle stopping of the stream.
     * One point to handle the differences in various implementations.
     * @param mediaStream MediaStream object to stop.
     */
    stopMediaStream(mediaStream: any): void;
    /**
     * Returns whether the desktop sharing is enabled or not.
     * @returns {boolean}
     */
    isDesktopSharingEnabled(): boolean;
    /**
     * Sets current audio output device.
     * @param {string} deviceId - id of 'audiooutput' device from
     *      navigator.mediaDevices.enumerateDevices(), 'default' for default
     *      device
     * @returns {Promise} - resolves when audio output is changed, is rejected
     *      otherwise
     */
    setAudioOutputDevice(deviceId: string): Promise<any>;
    /**
     * Sets the capture frame rate for desktop tracks.
     *
     * @param {number} maxFps - max fps to be used as the capture frame rate.
     * @returns {void}
     */
    setDesktopSharingFrameRate(maxFps: number): void;
    /**
     * Returns currently used audio output device id, '' stands for default
     * device
     * @returns {string}
     */
    getAudioOutputDevice(): string;
    /**
     * Returns list of available media devices if its obtained, otherwise an
     * empty array is returned/
     * @returns {Array} list of available media devices.
     */
    getCurrentlyAvailableMediaDevices(): any[];
    /**
     * Returns event data for device to be reported to stats.
     * @returns {MediaDeviceInfo} device.
     */
    getEventDataForActiveDevice(device: any): MediaDeviceInfo;
    /**
     * Returns <tt>true<tt/> if a WebRTC MediaStream identified by given stream
     * ID is considered a valid "user" stream which means that it's not a
     * "receive only" stream nor a "mixed" JVB stream.
     *
     * Clients that implement Unified Plan, such as Firefox use recvonly
     * "streams/channels/tracks" for receiving remote stream/tracks, as opposed
     * to Plan B where there are only 3 channels: audio, video and data.
     *
     * @param {string} streamId The id of WebRTC MediaStream.
     * @returns {boolean}
     */
    isUserStreamById(streamId: string): boolean;
}
import Listenable from '../util/Listenable';
