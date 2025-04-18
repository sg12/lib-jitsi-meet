import JitsiLocalTrack from './JitsiLocalTrack';

export default class TPCUtils {
  constructor(peerconnection: unknown, videoBitrates: unknown); // TODO:
  ensureCorrectOrderOfSsrcs: ( description: unknown ) => RTCSessionDescription; // TODO:
  insertUnifiedPlanSimulcastReceive: ( desc: { type: string, sdp: string } ) => RTCSessionDescription;
  addTrack: ( localTrack: JitsiLocalTrack, isInitiator: boolean ) => void;
  addTrackUnmute: ( localTrack: JitsiLocalTrack ) => Promise<void>;
  getLocalStreamHeightConstraints: ( localTrack: JitsiLocalTrack ) => number[];
  removeTrackMute: ( localTrack: JitsiLocalTrack ) => Promise<void>;
  replaceTrack: ( oldTrack: JitsiLocalTrack, newTrack: JitsiLocalTrack ) => Promise<void>;
  setMediaTransferActive: ( active: boolean ) => void;
  setVideoTransferActive: ( active: boolean ) => void;
  updateEncodingsResolution: ( parameters: RTCRtpEncodingParameters ) => void;
}
