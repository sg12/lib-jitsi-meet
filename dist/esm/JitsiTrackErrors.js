/**
 * The errors for the JitsiTrack objects.
 */
export var JitsiTrackErrors;
(function (JitsiTrackErrors) {
    /**
     * An error which indicates that some of requested constraints in
     * getUserMedia call were not satisfied.
     */
    JitsiTrackErrors["CONSTRAINT_FAILED"] = "gum.constraint_failed";
    /**
     * A generic error which indicates an error occurred while selecting
     * a DesktopCapturerSource from the electron app.
     */
    JitsiTrackErrors["ELECTRON_DESKTOP_PICKER_ERROR"] = "gum.electron_desktop_picker_error";
    /**
     * An error which indicates a custom desktop picker could not be detected
     * for the electron app.
     */
    JitsiTrackErrors["ELECTRON_DESKTOP_PICKER_NOT_FOUND"] = "gum.electron_desktop_picker_not_found";
    /**
     * Generic getUserMedia error.
     */
    JitsiTrackErrors["GENERAL"] = "gum.general";
    /**
     * An error which indicates that requested device was not found.
     */
    JitsiTrackErrors["NOT_FOUND"] = "gum.not_found";
    /**
     * An error which indicates that user denied permission to share requested
     * device.
     */
    JitsiTrackErrors["PERMISSION_DENIED"] = "gum.permission_denied";
    /**
     * Generic error for screensharing failure.
     */
    JitsiTrackErrors["SCREENSHARING_GENERIC_ERROR"] = "gum.screensharing_generic_error";
    /**
     * Error in getDisplayMedia when not supported. Can happen in Electron if no
     * permission handler was set.
     */
    JitsiTrackErrors["SCREENSHARING_NOT_SUPPORTED_ERROR"] = "gdm.screen_sharing_not_supported";
    /**
     * An error which indicates that user canceled screen sharing window
     * selection dialog.
     */
    JitsiTrackErrors["SCREENSHARING_USER_CANCELED"] = "gum.screensharing_user_canceled";
    /**
     * Indicates that the timeout passed to the obtainAudioAndVideoPermissions has expired without GUM resolving.
     */
    JitsiTrackErrors["TIMEOUT"] = "gum.timeout";
    /**
     * An error which indicates that track has been already disposed and cannot
     * be longer used.
     */
    JitsiTrackErrors["TRACK_IS_DISPOSED"] = "track.track_is_disposed";
    /**
     * An error which indicates that track has no MediaStream associated.
     */
    JitsiTrackErrors["TRACK_NO_STREAM_FOUND"] = "track.no_stream_found";
    /**
     * An error which indicates that no tracks were found in the media stream
     */
    JitsiTrackErrors["TRACK_NO_STREAM_TRACKS_FOUND"] = "track.no_stream_tracks_found";
    /**
     * An error which indicates that there are too many tracks in the provided media stream
     */
    JitsiTrackErrors["TRACK_TOO_MANY_TRACKS_IN_STREAM"] = "track.too_many_tracks_in_stream";
    /**
     * An error which indicates that requested video resolution is not supported
     * by a webcam.
     */
    JitsiTrackErrors["UNSUPPORTED_RESOLUTION"] = "gum.unsupported_resolution";
})(JitsiTrackErrors || (JitsiTrackErrors = {}));
// exported for backward compatibility
export const CONSTRAINT_FAILED = JitsiTrackErrors.CONSTRAINT_FAILED;
export const ELECTRON_DESKTOP_PICKER_ERROR = JitsiTrackErrors.ELECTRON_DESKTOP_PICKER_ERROR;
export const ELECTRON_DESKTOP_PICKER_NOT_FOUND = JitsiTrackErrors.ELECTRON_DESKTOP_PICKER_NOT_FOUND;
export const GENERAL = JitsiTrackErrors.GENERAL;
export const NOT_FOUND = JitsiTrackErrors.NOT_FOUND;
export const PERMISSION_DENIED = JitsiTrackErrors.PERMISSION_DENIED;
export const SCREENSHARING_GENERIC_ERROR = JitsiTrackErrors.SCREENSHARING_GENERIC_ERROR;
export const SCREENSHARING_NOT_SUPPORTED_ERROR = JitsiTrackErrors.SCREENSHARING_NOT_SUPPORTED_ERROR;
export const SCREENSHARING_USER_CANCELED = JitsiTrackErrors.SCREENSHARING_USER_CANCELED;
export const TIMEOUT = JitsiTrackErrors.TIMEOUT;
export const TRACK_IS_DISPOSED = JitsiTrackErrors.TRACK_IS_DISPOSED;
export const TRACK_NO_STREAM_FOUND = JitsiTrackErrors.TRACK_NO_STREAM_FOUND;
export const UNSUPPORTED_RESOLUTION = JitsiTrackErrors.UNSUPPORTED_RESOLUTION;
export const TRACK_TOO_MANY_TRACKS_IN_STREAM = JitsiTrackErrors.TRACK_TOO_MANY_TRACKS_IN_STREAM;
export const TRACK_NO_STREAM_TRACKS_FOUND = JitsiTrackErrors.TRACK_NO_STREAM_TRACKS_FOUND;
//# sourceMappingURL=JitsiTrackErrors.js.map