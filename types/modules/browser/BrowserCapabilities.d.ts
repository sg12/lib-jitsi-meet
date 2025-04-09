/**
 * Implements browser capabilities for lib-jitsi-meet.
 */
export default class BrowserCapabilities {
    /**
     * Tells whether or not the <tt>MediaStream/tt> is removed from the <tt>PeerConnection</tt> and disposed on video
     * mute (in order to turn off the camera device). This is needed on Firefox because of the following bug
     * https://bugzilla.mozilla.org/show_bug.cgi?id=1735951
     *
     * @return {boolean} <tt>true</tt> if the current browser supports this strategy or <tt>false</tt> otherwise.
     */
    doesVideoMuteByStreamRemove(): boolean;
    /**
     * Checks if the client is running on an Android browser.
     *
     * @returns {boolean}
     */
    isAndroidBrowser(): boolean;
    /**
     * Checks if the current platform is iOS.
     *
     * @returns {boolean}
     */
    isIosBrowser(): boolean;
    /**
     * Checks if the client is running on a mobile device.
     */
    isMobileDevice(): any;
    /**
     * Checks whether current running context is a Trusted Web Application.
     *
     * @returns {boolean} Whether the current context is a TWA.
     */
    isTwa(): boolean;
    /**
     * Checks if the current browser is supported.
     *
     * @returns {boolean} true if the browser is supported, false otherwise.
     */
    isSupported(): boolean;
    /**
     * Returns whether the browser is supported for Android
     * @returns {boolean} true if the browser is supported for Android devices
     */
    isSupportedAndroidBrowser(): boolean;
    /**
     * Returns whether the browser is supported for iOS
     * @returns {boolean} true if the browser is supported for iOS devices
     */
    isSupportedIOSBrowser(): boolean;
    /**
     * Returns whether or not the current environment needs a user interaction
     * with the page before any unmute can occur.
     *
     * @returns {boolean}
     */
    isUserInteractionRequiredForUnmute(): boolean;
    /**
     * Checks if the current browser triggers 'onmute'/'onunmute' events when
     * user's connection is interrupted and the video stops playback.
     * @returns {*|boolean} 'true' if the event is supported or 'false'
     * otherwise.
     */
    supportsVideoMuteOnConnInterrupted(): any | boolean;
    /**
     * Checks if the current browser reports upload and download bandwidth
     * statistics.
     * @return {boolean}
     */
    supportsBandwidthStatistics(): boolean;
    /**
     * Checks if the current browser supports setting codec preferences on the transceiver.
     * @returns {boolean}
     */
    supportsCodecPreferences(): boolean;
    /**
     * Checks if the browser supports the new codec selection API, i.e., checks if dictionary member
     * RTCRtpEncodingParameters.codec as defined in
     * https://w3c.github.io/webrtc-extensions/#dom-rtcrtpencodingparameters-codec is supported by the browser. It
     * allows the application to change the current codec used by each RTCRtpSender without a renegotiation.
     *
     * @returns {boolean}
     */
    supportsCodecSelectionAPI(): boolean;
    /**
     * Returns true if the browser supports Dependency Descriptor header extension.
     *
     * @returns {boolean}
     */
    supportsDDExtHeaders(): boolean;
    /**
     * Checks if the current browser support the device change event.
     * @return {boolean}
     */
    supportsDeviceChangeEvent(): boolean;
    /**
     * Checks if the current browser supports the Long Tasks API that lets us observe
     * performance measurement events and be notified of tasks that take longer than
     * 50ms to execute on the main thread.
     */
    supportsPerformanceObserver(): boolean;
    /**
     * Checks if the current browser supports audio level stats on the receivers.
     */
    supportsReceiverStats(): boolean;
    /**
     * Checks if the current browser reports round trip time statistics for
     * the ICE candidate pair.
     * @return {boolean}
     */
    supportsRTTStatistics(): boolean;
    /**
     * Returns true if the browser supports the new Scalability Mode API for VP9/AV1 simulcast and full SVC. H.264
     * simulcast will also be supported by the jvb for this version because the bridge is able to read the Dependency
     * Descriptor RTP header extension to extract layers information for H.264 as well.
     *
     * @returns {boolean}
     */
    supportsScalabilityModeAPI(): boolean;
    /**
     * Returns true if the browser supports track based statistics for the local video track. Otherwise,
     * track resolution and framerate will be calculated based on the 'outbound-rtp' statistics.
     * @returns {boolean}
     */
    supportsTrackBasedStats(): boolean;
    /**
     * Returns true if VP9 is supported by the client on the browser. VP9 is currently disabled on Safari
     * and older versions of Firefox because of issues. Please check https://bugs.webkit.org/show_bug.cgi?id=231074 for
     * details.
     */
    supportsVP9(): boolean;
    /**
     * Checks if the browser uses SDP munging for turning on simulcast.
     *
     * @returns {boolean}
     */
    usesSdpMungingForSimulcast(): boolean;
    /**
     * Checks if the browser uses RIDs/MIDs for siganling the simulcast streams
     * to the bridge instead of the ssrcs.
     */
    usesRidsForSimulcast(): boolean;
    /**
     * Checks if the browser supports getDisplayMedia.
     * @returns {boolean} {@code true} if the browser supports getDisplayMedia.
     */
    supportsGetDisplayMedia(): boolean;
    /**
     * Checks if the browser supports WebRTC Encoded Transform, an alternative
     * to insertable streams.
     *
     * NOTE: At the time of this writing the only browser supporting this is
     * Safari / WebKit, behind a flag.
     *
     * @returns {boolean} {@code true} if the browser supports it.
     */
    supportsEncodedTransform(): boolean;
    /**
     * Checks if the browser supports insertable streams, needed for E2EE.
     * @returns {boolean} {@code true} if the browser supports insertable streams.
     */
    supportsInsertableStreams(): boolean;
    /**
     * Whether the browser supports the RED format for audio.
     */
    supportsAudioRed(): boolean;
    /**
     * Checks if the browser supports voice activity detection via the @type {VADAudioAnalyser} service.
     *
     * @returns {boolean}
     */
    supportsVADDetection(): boolean;
    /**
     * Check if the browser supports the RTP RTX feature (and it is usable).
     *
     * @returns {boolean}
     */
    supportsRTX(): boolean;
    /**
     * Returns the version of a Safari browser.
     *
     * @returns {Number}
     */
    _getSafariVersion(): number;
    /**
     * Returns the version of an ios browser.
     *
     * @returns {Number}
     */
    _getIOSVersion(): number;
}
