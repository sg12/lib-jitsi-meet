import JitsiConference from '../../JitsiConference';
import JitsiConnection from '../../JitsiConnection';
import EventEmitter from '../util/EventEmitter';
import { IRTCStatsConfiguration, ITraceOptions } from './interfaces';
/**
 * RTCStats Singleton that is initialized only once for the lifetime of the app, subsequent calls to init will be
 * ignored. Config and conference changes are handled by the start method.
 */
declare class RTCStats {
    events: EventEmitter;
    _startedWithNewConnection: boolean;
    private _defaultLogCollector;
    private _initialized;
    private _trace;
    /**
     * RTCStats "proxies" WebRTC functions such as GUM and RTCPeerConnection by rewriting the global objects.
     * The proxies will then send data to the rtcstats server via the trace object.
     * The initialization procedure must be called once when lib-jitsi-meet is loaded.
     *
     * @param {IRTCStatsConfiguration} initConfig initial config for rtcstats.
     * @returns {void}
     */
    init(initConfig: IRTCStatsConfiguration): void;
    isTraceAvailable(): boolean;
    /**
      * A JitsiConnection instance is created before the conference is joined, so even though
     * we don't have any conference specific data yet, we can initialize the trace module and
     * send any logs that might of otherwise be missed in case an error occurs between the connection
     * and conference initialization.
     *
     * @param connection - The JitsiConnection instance.
     * @returns {void}
     */
    startWithConnection(connection: JitsiConnection): void;
    /**
     * When a conference is about to start, we need to reset the trace module, and initialize it with the
     * new conference's config. On a normal conference flow this wouldn't be necessary, as the whole page is
     * reloaded, but in the case of breakout rooms or react native the js context doesn't reload, hence the
     * RTCStats singleton and its config persists between conferences.
     *
     * @param conference - JitsiConference instance that's about to start.
     * @returns {void}
     */
    attachToConference(conference: JitsiConference): void;
    /**
     * Reset and connects the trace module to the s server.
     *
     * @param traceOptions - Options for the trace module.
     * @returns {void}
     */
    _connectTrace(traceOptions: ITraceOptions): void;
    /**
     * Sends the identity data to the rtcstats server.
     *
     * @param identityData - Identity data to send.
     * @returns {void}
     */
    sendIdentity(identityData: any): void;
    /**
     * Resets the trace module by closing the websocket and deleting the object.
     * After reset, the rtcstats proxy module that tries to send data via `sendStatsEntry`, will no longer
     * send any data, until the trace module is initialized again. This comes in handy on react-native
     * where ljm doesn't get reloaded, so we need to switch the trace module between conferences.
     *
     * @returns {void}
     */
    reset(): void;
    /**
     * Sends a stats entry to the rtcstats server. This is called by the rtcstats proxy module,
     * or any other app that wants to send custom stats.
     *
     * @param entry - Stats entry to send.
     * @returns {void}
     */
    sendStatsEntry(statsType: any, pcId: any, data: any): void;
    /**
     * Creates a new log collector with the default log storage.
     */
    getDefaultLogCollector(maxEntryLength: any): any;
}
declare const _default: RTCStats;
export default _default;
