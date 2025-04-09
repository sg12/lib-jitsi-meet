/**
 * Implements utility to forward events from one eventEmitter to another.
 * @param src {object} instance of EventEmitter or another class that implements
 * addListener method which will register listener to EventEmitter instance.
 * @param dest {object} instance of EventEmitter or another class that
 * implements emit method which will emit an event.
 */
export default class EventEmitterForwarder {
    src: any;
    dest: any;
    listeners: Map<any, any>;
    /**
     * @constructor
     */
    constructor(src: any, dest: any);
    /**
     * Adds event to be forwarded from src to dest.
     * @param srcEvent {string} the event that EventEmitterForwarder is listening
     * for.
     * @param dstEvent {string} the event that will be fired from dest.
     * @param arguments all other passed arguments are going to be fired with
     * dstEvent.
     */
    forward(...args: any[]): void;
    /**
     * Clears the listeners for the supplied events.
     *
     * @param args all the events which listeners to be cleaned.
     */
    removeListeners(...args: any[]): void;
}
