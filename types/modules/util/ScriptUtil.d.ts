export interface ILoadScriptOptions {
    async: boolean;
    errorCallback?: () => void;
    loadCallback?: () => void;
    prepend: boolean;
    relativeURL: boolean;
    src: string;
}
/**
 * Implements utility functions which facilitate the dealing with scripts such
 * as the download and execution of a JavaScript file.
 */
declare const ScriptUtil: {
    /**
     * Loads a script from a specific source.
     *
     * @param src the source from the which the script is to be (down)loaded
     * @param async true to asynchronously load the script or false to
     * synchronously load the script
     * @param prepend true to schedule the loading of the script as soon as
     * possible or false to schedule the loading of the script at the end of the
     * scripts known at the time
     * @param relativeURL whether we need load the library from url relative
     * to the url that lib-jitsi-meet was loaded. Useful when sourcing the
     * library from different location than the app that is using it
     * @param loadCallback on load callback function
     * @param errorCallback callback to be called on error loading the script
     */
    loadScript({ src, async, prepend, relativeURL, loadCallback, errorCallback }: ILoadScriptOptions): void;
};
export default ScriptUtil;
