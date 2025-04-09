import EventEmitter, { EventListener } from './EventEmitter';
/**
 * The class implements basic event operations - add/remove listener.
 * NOTE: The purpose of the class is to be extended in order to add
 * this functionality to other classes.
 */
export default class Listenable {
    eventEmitter: EventEmitter;
    addEventListener: typeof EventEmitter.prototype.addListener;
    removeEventListener: typeof EventEmitter.prototype.removeListener;
    on: typeof EventEmitter.prototype.addListener;
    off: typeof EventEmitter.prototype.removeListener;
    /**
     * Creates new instance.
     * @constructor
     */
    constructor();
    /**
     * Adds new cancellable listener.
     * @param {String} eventName the name of the event
     * @param {Function} listener the listener.
     * @returns {Function} - The unsubscribe function.
     */
    addCancellableListener(eventName: string, listener: EventListener): () => void;
    /**
     * Adds new listener.
     * @param {String} eventName the name of the event
     * @param {Function} listener the listener.
     * @returns {EventEmitter} - The emitter, so that calls can be chained.
     */
    addListener(eventName: string, listener: EventListener): EventEmitter;
    /**
     * Removes listener.
     * @param {String} eventName the name of the event that triggers the
     * listener
     * @param {Function} listener the listener.
     * @returns {EventEmitter} - The emitter, so that calls can be chained.
     */
    removeListener(eventName: string, listener: EventListener): EventEmitter;
    /**
     * Emits an event.
     * @param {string} event - event name
     */
    emit(event: string, ...args: any[]): void;
}
