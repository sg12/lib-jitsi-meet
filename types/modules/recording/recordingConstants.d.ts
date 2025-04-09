export interface IRecordingConstants {
    error: {
        BUSY: string;
        ERROR: string;
        POLICY_VIOLATION: string;
        RESOURCE_CONSTRAINT: string;
        SERVICE_UNAVAILABLE: string;
        UNEXPECTED_REQUEST: string;
    };
    mode: {
        FILE: string;
        STREAM: string;
    };
    status: {
        OFF: string;
        ON: string;
        PENDING: string;
    };
}
declare const recordingConstants: IRecordingConstants;
export default recordingConstants;
