/**
 * Handles all the utility functions for the TraceablePeerConnection class, like calculating the encoding parameters,
 * determining the media direction, calculating bitrates based on the current codec settings, etc.
 */
export class TPCUtils {
    /**
     * Creates a new instance for a given TraceablePeerConnection
     *
     * @param peerconnection - the tpc instance for which we have utility functions.
     * @param options - additional options that can be passed to the utility functions.
     * @param options.audioQuality - the audio quality settings that are used to calculate the audio codec parameters.
     * @param options.isP2P - whether the connection is a P2P connection.
     * @param options.videoQuality - the video quality settings that are used to calculate the encoding parameters.
     */
    constructor(peerconnection: any, options?: {});
    pc: any;
    options: {};
    codecSettings: {
        av1: {
            maxBitratesVideo: {
                low: number;
                standard: number;
                high: number;
                fullHd: number;
                ultraHd: number;
                ssHigh: number;
                none: number;
            };
            scalabilityModeEnabled: boolean;
            useSimulcast: boolean;
            useKSVC: boolean;
        };
        h264: {
            maxBitratesVideo: {
                low: number;
                standard: number;
                high: number;
                fullHd: number;
                ultraHd: number;
                ssHigh: number;
                none: number;
            };
            scalabilityModeEnabled: boolean;
        };
        vp8: {
            maxBitratesVideo: {
                low: number;
                standard: number;
                high: number;
                fullHd: number;
                ultraHd: number;
                ssHigh: number;
                none: number;
            }; /**
             * Reads videoQuality settings from config.js and overrides the code defaults for video codecs.
             */
            scalabilityModeEnabled: boolean;
        };
        vp9: {
            maxBitratesVideo: {
                low: number;
                standard: number;
                high: number;
                fullHd: number;
                ultraHd: number;
                ssHigh: number;
                none: number;
            };
            scalabilityModeEnabled: boolean;
            useSimulcast: boolean;
            useKSVC: boolean;
        };
    };
    /**
     * Flag indicating bridge support for AV1 codec. On the bridge connection, it is supported only when support for
     * Dependency Descriptor header extensions is offered by Jicofo. H.264 simulcast is also possible when these
     * header extensions are negotiated.
     */
    supportsDDHeaderExt: boolean;
    /**
     * Calculates the configuration of the active encoding when the browser sends only one stream, i,e,, when there is
     * no spatial scalability configure (p2p) or when it is running in full SVC mode.
     *
     * @param {JitsiLocalTrack} localVideoTrack - The local video track.
     * @param {CodecMimeType} codec - The video codec.
     * @param {number} newHeight - The resolution that needs to be configured for the local video track.
     * @returns {Object} configuration.
     * @private
     */
    private _calculateActiveEncodingParams;
    /**
     * Returns the codecs in the current order of preference in the SDP provided.
     *
     * @param {transform.SessionDescription} parsedSdp the parsed SDP object.
     * @returns {Array<CodecMimeType>}
     * @private
     */
    private _getConfiguredVideoCodecsImpl;
    /**
     * The startup configuration for the stream encodings that are applicable to the video stream when a new sender is
     * created on the peerconnection. The initial config takes into account the differences in browser's simulcast
     * implementation.
     *
     * Encoding parameters:
     * active - determine the on/off state of a particular encoding.
     * maxBitrate - max. bitrate value to be applied to that particular encoding based on the encoding's resolution and
     *  config.js videoQuality settings if applicable.
     * rid - Rtp Stream ID that is configured for a particular simulcast stream.
     * scaleResolutionDownBy - the factor by which the encoding is scaled down from the original resolution of the
     *  captured video.
     *
     * @param {JitsiLocalTrack} localTrack - The local video track.
     * @param {String} codec - The codec currently in use.
     * @returns {Array<Object>} - The initial configuration for the stream encodings.
     * @private
     */
    private _getVideoStreamEncodings;
    /**
     * Returns a boolean indicating whether the video encoder is running in full SVC mode, i.e., it sends only one
     * video stream that has both temporal and spatial scalability.
     *
     * @param {CodecMimeType} codec - The video codec in use.
     * @returns boolean - true if the video encoder is running in full SVC mode, false otherwise.
     * @private
     */
    private _isRunningInFullSvcMode;
    /**
     * Returns a boolean indicating whether the bitrate needs to be capped for the local video track if it happens to
     * be a screenshare track. The lower spatial layers for screensharing are disabled when low fps screensharing is in
     * progress. Sending all three streams often results in the browser suspending the high resolution in low b/w and
     * and low cpu conditions, especially on the low end machines. Suspending the low resolution streams ensures that
     * the highest resolution stream is available always. Safari is an exception here since it does not send the
     * desktop stream at all if only the high resolution stream is enabled.
     *
     * @param {JitsiLocalTrack} localVideoTrack - The local video track.
     * @returns {boolean} - true if the bitrate needs to be capped for the screenshare track, false otherwise.
     * @private
     */
    private _isScreenshareBitrateCapped;
    /**
     * Returns the calculated active state of the stream encodings based on the frame height requested for the send
     * stream. All the encodings that have a resolution lower than the frame height requested will be enabled.
     *
     * @param {JitsiLocalTrack} localVideoTrack The local video track.
     * @param {CodecMimeType} codec - The codec currently in use.
     * @param {number} newHeight The resolution requested for the video track.
     * @returns {Array<boolean>}
     */
    calculateEncodingsActiveState(localVideoTrack: JitsiLocalTrack, codec: CodecMimeType, newHeight: number): Array<boolean>;
    /**
     * Returns the calculated max bitrates that need to be configured on the stream encodings based on the video
     * type and other considerations associated with screenshare.
     *
     * @param {JitsiLocalTrack} localVideoTrack The local video track.
     * @param {CodecMimeType} codec - The codec currently in use.
     * @param {number} newHeight The resolution requested for the video track.
     * @returns {Array<number>}
     */
    calculateEncodingsBitrates(localVideoTrack: JitsiLocalTrack, codec: CodecMimeType, newHeight: number): Array<number>;
    /**
     * Returns the calculated scalability modes for the video encodings when scalability modes are supported.
     *
     * @param {JitsiLocalTrack} localVideoTrack The local video track.
     * @param {CodecMimeType} codec - The codec currently in use.
     * @param {number} maxHeight The resolution requested for the video track.
     * @returns {Array<VideoEncoderScalabilityMode> | undefined}
     */
    calculateEncodingsScalabilityMode(localVideoTrack: JitsiLocalTrack, codec: CodecMimeType, maxHeight: number): Array<VideoEncoderScalabilityMode> | undefined;
    /**
     * Returns the scale factor that needs to be applied on the local video stream based on the desired resolution
     * and the codec in use.
     *
     * @param {JitsiLocalTrack} localVideoTrack The local video track.
     * @param {CodecMimeType} codec - The codec currently in use.
     * @param {number} maxHeight The resolution requested for the video track.
     * @returns {Array<float>}
     */
    calculateEncodingsScaleFactor(localVideoTrack: JitsiLocalTrack, codec: CodecMimeType, maxHeight: number): Array<float>;
    /**
     * Ensures that the ssrcs associated with a FID ssrc-group appear in the correct order, i.e., the primary ssrc
     * first and the secondary rtx ssrc later. This is important for unified plan since we have only one FID group per
     * media description.
     * @param {Object} description the webRTC session description instance for the remote description.
     * @returns {Object} the modified webRTC session description instance.
     */
    ensureCorrectOrderOfSsrcs(description: any): any;
    /**
     * Returns the codec that is configured on the client as the preferred video codec for the given local video track.
     *
     * @param {JitsiLocalTrack} localTrack - The local video track.
     * @returns {CodecMimeType} The codec that is set as the preferred codec for the given local video track.
     */
    getConfiguredVideoCodec(localTrack: JitsiLocalTrack): CodecMimeType;
    /**
     * Returns the codecs in the current order of preference as configured on the peerconnection.
     *
     * @param {string} - The local SDP to be used.
     * @returns {Array}
     */
    getConfiguredVideoCodecs(sdp: any): any[];
    /**
     * Returns the desired media direction for the given media type based on the current state of the peerconnection.
     *
     * @param {MediaType} mediaType - The media type for which the desired media direction is to be obtained.
     * @param {boolean} isAddOperation - Whether the direction is being set for a source add operation.
     * @returns {MediaDirection} - The desired media direction for the given media type.
     */
    getDesiredMediaDirection(mediaType: MediaType, isAddOperation?: boolean): MediaDirection;
    /**
     * Obtains stream encodings that need to be configured on the given track based
     * on the track media type and the simulcast setting.
     * @param {JitsiLocalTrack} localTrack
     */
    getStreamEncodings(localTrack: JitsiLocalTrack): any[];
    /**
     * Injects a 'SIM' ssrc-group line for simulcast into the given session description object to make Jicofo happy.
     * This is needed only for Firefox since it does not generate it when simulcast is enabled but we run the check
     * on all browsers just in case as it would break the functionality otherwise.
     *
     * @param desc A session description object (with 'type' and 'sdp' fields)
     * @return A session description object with its sdp field modified to contain an inject ssrc-group for simulcast.
     */
    injectSsrcGroupForSimulcast(desc: any): any;
    /**
     * Takes in a *unified plan* offer and inserts the appropriate parameters for adding simulcast receive support.
     * @param {Object} desc - A session description object
     * @param {String} desc.type - the type (offer/answer)
     * @param {String} desc.sdp - the sdp content
     *
     * @return {Object} A session description (same format as above) object with its sdp field modified to advertise
     * simulcast receive support.
     */
    insertUnifiedPlanSimulcastReceive(desc: {
        type: string;
        sdp: string;
    }): any;
    /**
     * Returns a boolean indicating whether the video encoder is running in Simulcast mode, i.e., three encodings need
     * to be configured in 4:2:1 resolution order with temporal scalability.
     *
     * @param {CodecMimeType} videoCodec - The video codec in use.
     * @returns {boolean}
     */
    isRunningInSimulcastMode(videoCodec: CodecMimeType): boolean;
    /**
     * Munges the session description to ensure that the codec order is as per the preferred codec settings.
     *
     * @param {transform.SessionDescription} parsedSdp that needs to be munged
     * @returns {transform.SessionDescription} the munged SDP.
     */
    mungeCodecOrder(parsedSdp: transform.SessionDescription): transform.SessionDescription;
    /**
     * Munges the stereo flag as well as the opusMaxAverageBitrate in the SDP, based on values set through config.js,
     * if present.
     *
     * @param {transform.SessionDescription} parsedSdp that needs to be munged.
     * @returns {transform.SessionDescription} the munged SDP.
     */
    mungeOpus(parsedSdp: transform.SessionDescription): transform.SessionDescription;
    /**
     * Munges the session SDP by setting the max bitrates on the video m-lines when VP9 K-SVC codec is in use.
     *
     * @param {transform.SessionDescription} parsedSdp that needs to be munged.
     * @param {boolean} isLocalSdp - Whether the max bitrate (via b=AS line in SDP) is set on local SDP.
     * @returns {transform.SessionDescription} The munged SDP.
     */
    setMaxBitrates(parsedSdp: transform.SessionDescription, isLocalSdp?: boolean): transform.SessionDescription;
    /**
     * Checks if the AV1 Dependency descriptors are negotiated on the bridge peerconnection and removes them from the
     * SDP when codec selected is VP8 or VP9.
     *
     * @param {transform.SessionDescription} parsedSdp that needs to be munged.
     * @returns {string} the munged SDP.
     */
    updateAv1DdHeaders(parsedSdp: transform.SessionDescription): string;
}
import { CodecMimeType } from '../../service/RTC/CodecMimeType';
import { VideoEncoderScalabilityMode } from '../../service/RTC/VideoEncoderScalabilityMode';
import { MediaType } from '../../service/RTC/MediaType';
import { MediaDirection } from '../../service/RTC/MediaDirection';
import transform from 'sdp-transform';
