/**
 * Error to be passed to a callback of a queued task when the queue is cleared.
 */
export declare class ClearedQueueError extends Error {
    /**
     * Creates new instance.
     */
    constructor(message: string);
}
export type Task = (callback: (err?: Error) => void) => void;
export type TaskCallback = (err?: Error) => void;
/**
 * A queue for async task execution.
 */
export default class AsyncQueue {
    private _queue;
    private _stopped;
    private _taskCallbacks;
    /**
     * Creates new instance.
     */
    constructor();
    /**
     * Removes any pending tasks from the queue.
     */
    clear(): void;
    /**
     * Internal task processing implementation which makes things work.
     */
    private _processQueueTasks;
    /**
     * Pauses the execution of the tasks on the queue.
     */
    pause(): void;
    /**
     * The 'task' function will be given a callback it MUST call with either:
     *  1) No arguments if it was successful or
     *  2) An error argument if there was an error
     * If the task wants to process the success or failure of the task, it
     * should pass the {@code callback} to the push function, e.g.:
     * queue.push(task, (err) => {
     *     if (err) {
     *         // error handling
     *     } else {
     *         // success handling
     *     }
     * });
     *
     * @param {Task} task - The task to be executed. See the description above.
     * @param {TaskCallback} [callback] - Optional callback to be called after the task has been executed.
     */
    push(task: Task, callback?: TaskCallback): void;
    /**
     * Resumes the execution of the tasks on the queue.
     */
    resume(): void;
    /**
     * Shutdowns the queue. All already queued tasks will execute, but no future tasks can be added. If a task is added
     * after the queue has been shutdown then the callback will be called with an error.
     */
    shutdown(): void;
}
