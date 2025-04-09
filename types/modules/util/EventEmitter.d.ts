/// <reference types="node" />
import { EventEmitter as NodeEventEmitter } from 'events';
export type EventListener = (...args: any[]) => void;
/**
 * The class creates our own EventEmitter instance
 */
export default class EventEmitter extends NodeEventEmitter {
    addEventListener: typeof NodeEventEmitter.prototype.addListener;
    removeEventListener: typeof NodeEventEmitter.prototype.removeListener;
    /**
     * Creates new instance.
     * @constructor
     */
    constructor();
}
