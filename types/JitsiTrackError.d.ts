export interface IGumError {
    constraint?: string;
    constraintName?: string;
    message?: string;
    name?: string;
    stack?: string;
}
export interface IVideoConstraints {
    mandatory?: {
        [key: string]: string | number;
    };
}
export interface IGumOptions {
    video?: IVideoConstraints;
}
export interface IGum {
    constraints?: IGumOptions | string;
    devices?: ('audio' | 'video' | 'desktop' | 'screen' | 'audiooutput')[];
    error: IGumError;
}
export type DeviceType = 'audio' | 'video' | 'desktop' | 'screen' | 'audiooutput';
/**
 *
 * Represents an error that occurred to a JitsiTrack. Can represent various
 * types of errors. For error descriptions (@see JitsiTrackErrors).
 *
 * @extends Error
 */
export default class JitsiTrackError extends Error {
    gum?: IGum;
    /**
     * @constructor
     * @param {IGumError|string} error - error object or error name
     * @param {IGumOptions|string} [options] - getUserMedia constraints object or error message
     * @param {DeviceType[]} [devices] - list of getUserMedia requested devices
     */
    constructor(error: IGumError | string, options?: IGumOptions | string, devices?: DeviceType[]);
    /**
     * Gets failed resolution constraint from corresponding object.
     * @param failedConstraintName - The name of the failed constraint
     * @param constraints - The constraints object
     * @returns The resolution value or empty string
     */
    private getResolutionFromFailedConstraint;
}
