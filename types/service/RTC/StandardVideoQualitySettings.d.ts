import { CodecMimeType } from './CodecMimeType';
export declare const ASSUMED_BANDWIDTH_BPS = -1;
export declare const DEFAULT_LAST_N = 25;
export declare const LAST_N_UNLIMITED = -1;
export declare const SIM_LAYERS: {
    rid: string;
    scaleFactor: number;
}[];
/**
 * The ssrc-group semantics for SSRCs related to the video streams.
 */
export declare enum SSRC_GROUP_SEMANTICS {
    FID = "FID",
    SIM = "SIM"
}
/**
 * Standard scalability mode settings for different video codecs and the default bitrates.
 */
export declare const STANDARD_CODEC_SETTINGS: {
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
        };
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
 * Video codecs in descending order of complexity for camera and desktop video types based on the results of manual
 * performance tests on different platforms. When a CPU limitation is encountered, client switches the call to use the
 * next codec in the list.
 */
export declare const VIDEO_CODECS_BY_COMPLEXITY: {
    camera: CodecMimeType[];
    desktop: CodecMimeType[];
};
/**
 * Standard video resolutions and the corresponding quality level that will be picked for the given resolution.
 * For quality levels:
 * 'high' and above - the encoder will be configured to encode 3 spatial layers.
 * 'standard' - the encoder will be configured to encode 2 spatial laters.
 * 'low' - the encoder will be configured to encode only 1 spatial layer.
 * In all the above cases, each of the layers will again have 3 temporal layers, except for VP8 codec for which only
 * 2 temporal layers are configured by default.
 */
export declare const VIDEO_QUALITY_LEVELS: {
    height: number;
    level: string;
}[];
/**
 * Enumerate the supported video resolutions.
 */
export declare enum VIDEO_QUALITY_SETTINGS {
    FULL = "fullHd",
    HIGH = "high",
    LOW = "low",
    NONE = "none",
    STANDARD = "standard",
    ULTRA = "ultraHd"
}
