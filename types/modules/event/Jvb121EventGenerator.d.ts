import JitsiConference from '../../JitsiConference';
/**
 * Emits {@link JitsiConferenceEvents.JVB121_STATUS} events based on the current
 * P2P status and the conference participants count. See the event description
 * for more info.
 */
export default class Jvb121EventGenerator {
    private _conference;
    private _jvb121;
    /**
     * Creates new <tt>Jvb121EventGenerator</tt> for the given conference.
     * @param {JitsiConference} conference
     */
    constructor(conference: JitsiConference);
    /**
     * Checks whether the JVB121 value should be updated and a new event
     * emitted.
     */
    evaluateStatus(): void;
}
