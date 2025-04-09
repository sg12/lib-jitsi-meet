export interface ISourceCompactJson {
    m?: string;
    n: string;
    s: string;
    v?: any;
}
export interface ICompactSsrcGroup extends Array<string> {
}
export interface IJsonMessage {
    sources: {
        [owner: string]: [ISourceCompactJson[], ICompactSsrcGroup[], ISourceCompactJson[], ICompactSsrcGroup[]];
    };
}
/**
 * Reads a JSON-encoded message (from a "json-message" element) and extracts source descriptions. Adds the extracted
 * source descriptions to the given Jingle IQ in the standard Jingle format.
 *
 * Encoding sources in this compact JSON format instead of standard Jingle was introduced in order to reduce the
 * network traffic and load on the XMPP server. The format is described in Jicofo [TODO: insert link].
 *
 * @param {*} iq the IQ to which source descriptions will be added.
 * @param {*} jsonMessageXml The XML node for the "json-message" element.
 * @returns {Map<string, Array<string>} The audio and video ssrcs extracted from the JSON-encoded message with remote
 * endpoint id as the key.
 */
export declare function expandSourcesFromJson(iq: Element, jsonMessageXml: Element): Map<string, string[]> | null;
