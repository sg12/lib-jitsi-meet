/**
 * Discovers component versions in a conference.
 */
export default class ComponentsVersions {
    versions: {
        [key: string]: string;
    };
    conference: any;
    /**
     * Creates new instance of <tt>ComponentsVersions</tt> which will be discovering
     * the versions of conferencing system components in given
     * <tt>JitsiConference</tt>.
     * @param conference <tt>JitsiConference</tt> instance which will be used to
     *        listen for focus presence updates.
     * @constructor
     */
    constructor(conference: any);
    /**
     * Processes versions information from presence.
     *
     * @param {*} versions - The versions element.
     * @param {*} mucJid - MUC JID for the sender.
     * @returns {void}
     */
    _processVersions(versions: any, _: any, mucJid: any): void;
    /**
     * Obtains the version of conferencing system component.
     * @param componentName the name of the component for which we want to obtain
     *        the version.
     * @returns {String} which describes the version of the component identified by
     *          given <tt>componentName</tt> or <tt>undefined</tt> if not found.
     */
    getComponentVersion(componentName: any): string;
}
