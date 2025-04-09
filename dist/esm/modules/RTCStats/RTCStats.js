import Logger, { getLogger } from '@jitsi/logger';
import rtcstatsInit from '@jitsi/rtcstats/rtcstats';
import traceInit from '@jitsi/rtcstats/trace-ws';
import { BEFORE_STATISTICS_DISPOSED, CONFERENCE_CREATED_TIMESTAMP, CONFERENCE_JOINED, CONFERENCE_LEFT, CONFERENCE_UNIQUE_ID_SET } from '../../JitsiConferenceEvents';
import Settings from '../settings/Settings';
import EventEmitter from '../util/EventEmitter';
import DefaultLogStorage from './DefaulLogStorage';
import { RTC_STATS_PC_EVENT, RTC_STATS_WC_DISCONNECTED } from './RTCStatsEvents';
const logger = getLogger('modules/RTCStats/RTCStats');
/**
 * RTCStats Singleton that is initialized only once for the lifetime of the app, subsequent calls to init will be
 * ignored. Config and conference changes are handled by the start method.
 */
class RTCStats {
    constructor() {
        this.events = new EventEmitter();
        this._startedWithNewConnection = true;
        this._defaultLogCollector = null;
        this._initialized = false;
        this._trace = null;
    }
    /**
     * RTCStats "proxies" WebRTC functions such as GUM and RTCPeerConnection by rewriting the global objects.
     * The proxies will then send data to the rtcstats server via the trace object.
     * The initialization procedure must be called once when lib-jitsi-meet is loaded.
     *
     * @param {IRTCStatsConfiguration} initConfig initial config for rtcstats.
     * @returns {void}
     */
    init(initConfig) {
        const { analytics: { rtcstatsPollInterval: pollInterval = 10000, rtcstatsSendSdp: sendSdp = false, rtcstatsEnabled = false } = {} } = initConfig;
        // If rtcstats is not enabled or already initialized, do nothing.
        // Calling rtcsatsInit multiple times will cause the global objects to be rewritten multiple times,
        // with unforeseen consequences.
        if (!rtcstatsEnabled || this._initialized) {
            return;
        }
        rtcstatsInit({ statsEntry: this.sendStatsEntry.bind(this) }, { pollInterval,
            useLegacy: false,
            sendSdp,
            eventCallback: event => this.events.emit(RTC_STATS_PC_EVENT, event) });
        this._initialized = true;
    }
    isTraceAvailable() {
        return this._trace !== null;
    }
    /**
      * A JitsiConnection instance is created before the conference is joined, so even though
     * we don't have any conference specific data yet, we can initialize the trace module and
     * send any logs that might of otherwise be missed in case an error occurs between the connection
     * and conference initialization.
     *
     * @param connection - The JitsiConnection instance.
     * @returns {void}
     */
    startWithConnection(connection) {
        var _a, _b;
        const { options } = connection;
        const name = (_a = options === null || options === void 0 ? void 0 : options.name) !== null && _a !== void 0 ? _a : '';
        const { analytics: { rtcstatsEndpoint: endpoint = '', rtcstatsEnabled = false } = {}, } = options;
        // Even though we have options being passed to init we need to recheck it as some client (react-native)
        // don't always re-initialize the module and could create multiple connections with different options.
        if (!rtcstatsEnabled)
            return;
        // If rtcstats proxy module is not initialized, do nothing (should never happen).
        if (!this._initialized) {
            logger.error('Calling startWithConnection before RTCStats proxy module is initialized.');
            return;
        }
        const traceOptions = {
            endpoint,
            meetingFqn: name,
            isBreakoutRoom: false
        };
        // Can't be a breakout room.
        this._connectTrace(traceOptions);
        (_b = this._defaultLogCollector) === null || _b === void 0 ? void 0 : _b.flush();
        this.sendIdentity(Object.assign({ confName: name }, options));
        // This module is tightly tied with the ljm JitsiConnection and JitsiConference flows, technically
        // the connection isn't associated with a conference, but we still need to have some association for
        // data that is logged before the conference is joined.
        // In short the flow is as follows:
        // 1. Connection is created.
        // 2. The trace module is initialized and connected to the rtcstats server, so data starts being sent.
        // 3. Conference is created.
        // 4. If the trace wasn't already initialized from the connection creation, it will be initialized again.
        // this will take care of the cases where the connection is created and then multiple conferences are
        // sequentially joined and left, such as breakout rooms.
        this._startedWithNewConnection = true;
    }
    /**
     * When a conference is about to start, we need to reset the trace module, and initialize it with the
     * new conference's config. On a normal conference flow this wouldn't be necessary, as the whole page is
     * reloaded, but in the case of breakout rooms or react native the js context doesn't reload, hence the
     * RTCStats singleton and its config persists between conferences.
     *
     * @param conference - JitsiConference instance that's about to start.
     * @returns {void}
     */
    attachToConference(conference) {
        var _a;
        const { options: { config: confConfig = {}, name: confName = '' } = {}, _statsCurrentId: displayName = '' } = conference;
        const { analytics: { rtcstatsEnabled = false, rtcstatsEndpoint: endpoint = '' } = {} } = confConfig;
        // The statisticsId, statisticsDisplayName and _statsCurrentId (renamed to displayName) fields
        // that are sent through options might be a bit confusing. Depending on the context, they could
        // be intermixed inside ljm, for instance _statsCurrentId might refer to the email field which is stored
        // in statisticsId or it could have the same value as callStatsUserName.
        // The following is the mapping between the fields, and a short explanation of each:
        // statisticsId -> email, this is only send by jitsi-meet if enableEmailInStats option is set.
        // statisticsDisplayName -> nick, this is only send by jitsi-meet if enableDisplayNameInStats option is set.
        // localId, this is the unique id that is used to track users throughout stats.
        const localId = (_a = Settings === null || Settings === void 0 ? void 0 : Settings.callStatsUserName) !== null && _a !== void 0 ? _a : '';
        // The new conference config might have rtcstats disabled, so we need to check again.
        if (!rtcstatsEnabled) {
            return;
        }
        // If rtcstats proxy module is not initialized, do nothing.
        if (!this._initialized) {
            logger.error('Calling attachToConference before RTCStats proxy module is initialized.');
            return;
        }
        // When the conference is joined, we need to initialize the trace module with the new conference's config.
        // The trace module will then connect to the rtcstats server and send the identity data.
        conference.once(CONFERENCE_JOINED, () => {
            var _a, _b;
            const isBreakoutRoom = Boolean((_a = conference.getBreakoutRooms()) === null || _a === void 0 ? void 0 : _a.isBreakoutRoom());
            const endpointId = conference.myUserId();
            const meetingUniqueId = conference.getMeetingUniqueId();
            // Connect to the rtcstats server instance. Stats (data obtained from getstats) won't be send until the
            // connect successfully initializes, however calls to GUM are recorded in an internal buffer even if not
            // connected and sent once it is established.
            if (!this._startedWithNewConnection) {
                const traceOptions = {
                    endpoint,
                    meetingFqn: confName,
                    isBreakoutRoom
                };
                this._connectTrace(traceOptions);
                // In cases where the conference was left but the connection was not closed,
                // logs could get cached, so we flush them as soon as we get a chance after the
                // conference is joined.
                (_b = this._defaultLogCollector) === null || _b === void 0 ? void 0 : _b.flush();
            }
            const identityData = Object.assign(Object.assign({}, confConfig), { endpointId,
                confName,
                displayName,
                meetingUniqueId,
                isBreakoutRoom,
                localId });
            this.sendIdentity(identityData);
            // Reset the flag, so that the next conference that is joined will have the trace module initialized, such as a breakout room.
            this._startedWithNewConnection = false;
        });
        // Note, this will only be called for normal rooms, not breakout rooms.
        conference.once(CONFERENCE_UNIQUE_ID_SET, meetingUniqueId => {
            this.sendIdentity({ meetingUniqueId });
        });
        conference.once(CONFERENCE_LEFT, () => {
            this.reset();
        });
        conference.once(CONFERENCE_CREATED_TIMESTAMP, (timestamp) => {
            this.sendStatsEntry('conferenceStartTimestamp', null, timestamp);
        });
        conference.once(BEFORE_STATISTICS_DISPOSED, () => { var _a; return (_a = this._defaultLogCollector) === null || _a === void 0 ? void 0 : _a.flush(); });
    }
    /**
     * Reset and connects the trace module to the s server.
     *
     * @param traceOptions - Options for the trace module.
     * @returns {void}
     */
    _connectTrace(traceOptions) {
        const traceOptionsComplete = Object.assign(Object.assign({}, traceOptions), { useLegacy: false, onCloseCallback: event => this.events.emit(RTC_STATS_WC_DISCONNECTED, event) });
        const { isBreakoutRoom } = traceOptionsComplete;
        this.reset();
        this._trace = traceInit(traceOptionsComplete);
        this._trace.connect(isBreakoutRoom);
    }
    /**
     * Sends the identity data to the rtcstats server.
     *
     * @param identityData - Identity data to send.
     * @returns {void}
     */
    sendIdentity(identityData) {
        var _a;
        (_a = this._trace) === null || _a === void 0 ? void 0 : _a.identity('identity', null, identityData);
    }
    /**
     * Resets the trace module by closing the websocket and deleting the object.
     * After reset, the rtcstats proxy module that tries to send data via `sendStatsEntry`, will no longer
     * send any data, until the trace module is initialized again. This comes in handy on react-native
     * where ljm doesn't get reloaded, so we need to switch the trace module between conferences.
     *
     * @returns {void}
     */
    reset() {
        var _a, _b;
        // If a trace is connected, flush the remaining logs before closing the connection,
        // if the trace is not present and we flush the logs will be lost,
        this._trace && ((_a = this._defaultLogCollector) === null || _a === void 0 ? void 0 : _a.flush());
        (_b = this._trace) === null || _b === void 0 ? void 0 : _b.close();
        this._trace = null;
    }
    /**
     * Sends a stats entry to the rtcstats server. This is called by the rtcstats proxy module,
     * or any other app that wants to send custom stats.
     *
     * @param entry - Stats entry to send.
     * @returns {void}
     */
    sendStatsEntry(statsType, pcId, data) {
        var _a;
        (_a = this._trace) === null || _a === void 0 ? void 0 : _a.statsEntry(statsType, pcId, data);
    }
    /**
     * Creates a new log collector with the default log storage.
     */
    getDefaultLogCollector(maxEntryLength) {
        if (!this._defaultLogCollector) {
            // If undefined is passed  as maxEntryLength LogCollector will default to 10000 bytes
            this._defaultLogCollector = new Logger.LogCollector(new DefaultLogStorage(this), { maxEntryLength });
            this._defaultLogCollector.start();
        }
        return this._defaultLogCollector;
    }
}
export default new RTCStats();
//# sourceMappingURL=RTCStats.js.map