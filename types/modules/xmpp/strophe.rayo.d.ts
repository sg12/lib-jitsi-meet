import type { Connection } from 'strophe.js';
import ConnectionPlugin from './ConnectionPlugin';
/**
 *
 */
export default class RayoConnectionPlugin extends ConnectionPlugin {
    private callResource;
    /**
     *
     * @param connection
     */
    init(connection: Connection): void;
    /**
     *
     * @param iq
     */
    onRayo(iq: any): any;
    /**
     *
     * @param to
     * @param from
     * @param roomName
     * @param roomPass
     * @param focusMucJid
     */
    dial(to: string, from: string, roomName: string, roomPass: string, focusMucJid: string): Promise<void>;
    /**
     *
     */
    hangup(): Promise<void>;
}
