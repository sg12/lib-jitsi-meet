import { Strophe } from 'strophe.js';
import ConnectionPlugin from './ConnectionPlugin';
/**
 *  Logs raw stanzas and makes them available for download as JSON
 */
class StropheLogger extends ConnectionPlugin {
    /**
     *
     */
    constructor() {
        super();
        this.log = [];
    }
    /**
     *
     * @param connection
     */
    init(connection) {
        super.init(connection);
        connection.rawInput = this.logIncoming.bind(this);
        connection.rawOutput = this.logOutgoing.bind(this);
    }
    /**
     *
     * @param stanza
     */
    logIncoming(stanza) {
        this.log.push([new Date().getTime(), 'incoming', stanza]);
    }
    /**
     *
     * @param stanza
     */
    logOutgoing(stanza) {
        this.log.push([new Date().getTime(), 'outgoing', stanza]);
    }
}
/**
 *
 */
export default function () {
    Strophe.addConnectionPlugin('logger', new StropheLogger());
}
//# sourceMappingURL=strophe.logger.js.map