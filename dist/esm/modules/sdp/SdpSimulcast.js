import * as transform from 'sdp-transform';
import { MediaDirection } from '../../service/RTC/MediaDirection';
import { MediaType } from '../../service/RTC/MediaType';
import { SIM_LAYERS, SSRC_GROUP_SEMANTICS } from '../../service/RTC/StandardVideoQualitySettings';
/**
 * This class handles SDP munging for enabling simulcast for local video streams in Unified plan. A set of random SSRCs
 * are generated for the higher layer streams and they are cached for a given mid. The cached SSRCs are then reused on
 * the subsequent iterations while munging the local description. This class also handles imploding of the simulcast
 * SSRCs for remote endpoints into the primary FID group in remote description since Jicofo signals all SSRCs relevant
 * to a given endpoint.
 */
export default class SdpSimulcast {
    /**
     * Creates a new instance.
     *
     * @param options
     */
    constructor() {
        this._ssrcCache = new Map();
        this._numOfLayers = SIM_LAYERS.length;
    }
    /**
     * Updates the given media description using the SSRCs that were cached for the mid associated
     * with the media description and returns the modified media description.
     *
     * @param mLine
     * @returns
     */
    _fillSsrcsFromCache(mLine) {
        const mid = mLine.mid;
        const cachedSsrcs = this._ssrcCache.get(mid);
        const newSsrcs = this._parseSimLayers(mLine);
        const newMsid = this._getSsrcAttribute(mLine, newSsrcs[0], 'msid');
        const newCname = this._getSsrcAttribute(mLine, newSsrcs[0], 'cname');
        mLine.ssrcs = [];
        mLine.ssrcGroups = [];
        for (const ssrc of cachedSsrcs) {
            mLine.ssrcs.push({
                id: ssrc,
                attribute: 'msid',
                value: newMsid
            });
            mLine.ssrcs.push({
                id: ssrc,
                attribute: 'cname',
                value: newCname
            });
        }
        mLine.ssrcGroups.push({
            semantics: SSRC_GROUP_SEMANTICS.SIM,
            ssrcs: cachedSsrcs.join(' ')
        });
        return mLine;
    }
    /**
     * Generates a new set of SSRCs for the higher simulcast layers/streams and adds the attributes and SIM group to
     * the given media description and returns the modified media description.
     *
     * @param mLine
     * @param primarySsrc
     * @returns
     */
    _generateNewSsrcsForSimulcast(mLine, primarySsrc) {
        const cname = this._getSsrcAttribute(mLine, primarySsrc, 'cname');
        let msid = this._getSsrcAttribute(mLine, primarySsrc, 'msid');
        // In Unified-plan mode, the a=ssrc lines with the msid attribute are not present (only cname attributes are
        // present) in the answers that Chrome and Safari generate for an offer received from Jicofo. Generate these
        // a=ssrc lines using the msid values from the a=msid line.
        if (!msid) {
            msid = mLine.msid;
            const primarySsrcs = mLine.ssrcs;
            primarySsrcs.forEach(ssrc => {
                mLine.ssrcs.push({
                    id: ssrc.id,
                    attribute: 'msid',
                    value: msid
                });
            });
        }
        // Generate SIM layers.
        const simSsrcs = [];
        for (let i = 0; i < this._numOfLayers - 1; ++i) {
            const simSsrc = this._generateSsrc();
            mLine.ssrcs.push({
                id: simSsrc,
                attribute: 'cname',
                value: cname
            });
            mLine.ssrcs.push({
                id: simSsrc,
                attribute: 'msid',
                value: msid
            });
            simSsrcs.push(simSsrc);
        }
        mLine.ssrcGroups = mLine.ssrcGroups || [];
        mLine.ssrcGroups.push({
            semantics: SSRC_GROUP_SEMANTICS.SIM,
            ssrcs: `${primarySsrc} ${simSsrcs.join(' ')}`
        });
        return mLine;
    }
    /**
     * Returns a random number to be used for the SSRC.
     *
     * @returns
     */
    _generateSsrc() {
        const max = 0xffffffff;
        return Math.floor(Math.random() * max);
    }
    /**
     * Returns the requested attribute value for a SSRC from a given media description.
     *
     * @param mLine
     * @param ssrc
     * @param attributeName
     * @returns
     */
    _getSsrcAttribute(mLine, ssrc, attributeName) {
        var _a, _b;
        return (_b = (_a = mLine.ssrcs) === null || _a === void 0 ? void 0 : _a.find(ssrcInfo => Number(ssrcInfo.id) === ssrc
            && ssrcInfo.attribute === attributeName)) === null || _b === void 0 ? void 0 : _b.value;
    }
    /**
     * Returns an array of all the primary SSRCs in the SIM group for a given media description.
     *
     * @param mLine
     * @returns
     */
    _parseSimLayers(mLine) {
        var _a, _b;
        const simGroup = (_a = mLine.ssrcGroups) === null || _a === void 0 ? void 0 : _a.find(group => group.semantics === SSRC_GROUP_SEMANTICS.SIM);
        if (simGroup) {
            return simGroup.ssrcs.split(' ').map(ssrc => Number(ssrc));
        }
        if ((_b = mLine.ssrcs) === null || _b === void 0 ? void 0 : _b.length) {
            return [Number(mLine.ssrcs[0].id)];
        }
        return null;
    }
    /**
     * Munges the given media description to enable simulcast for the video media sections that are in either have
     * SENDRECV or SENDONLY as the media direction thereby ignoring all the RECVONLY transceivers created for remote
     * endpoints.
     * NOTE: This needs to be called only when simulcast is enabled.
     *
     * @param description
     * @returns
     */
    mungeLocalDescription(description) {
        var _a, _b, _c, _d;
        if (!(description === null || description === void 0 ? void 0 : description.sdp)) {
            return description;
        }
        const session = transform.parse(description.sdp);
        for (let media of session.media) {
            // Ignore recvonly and inactive transceivers created for remote sources.
            if (media.direction === MediaDirection.RECVONLY || media.direction === MediaDirection.INACTIVE) {
                continue;
            }
            // Ignore audio m-lines.
            if (media.type !== MediaType.VIDEO) {
                continue;
            }
            const mid = media.mid;
            const numSsrcs = new Set((_a = media.ssrcs) === null || _a === void 0 ? void 0 : _a.map(ssrcInfo => ssrcInfo.id));
            const numGroups = (_c = (_b = media.ssrcGroups) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0;
            let primarySsrc;
            // Do not munge if the description has no ssrcs or if simulcast is already enabled.
            if (numSsrcs.size === 0 || numSsrcs.size > 2 || (numSsrcs.size === 2 && numGroups === 0)) {
                continue;
            }
            if (numSsrcs.size === 1) {
                primarySsrc = Number((_d = media.ssrcs[0]) === null || _d === void 0 ? void 0 : _d.id);
            }
            else {
                const fidGroup = media.ssrcGroups.find(group => group.semantics === SSRC_GROUP_SEMANTICS.FID);
                if (fidGroup) {
                    primarySsrc = Number(fidGroup.ssrcs.split(' ')[0]);
                }
            }
            if (this._ssrcCache.has(mid)) {
                media = this._fillSsrcsFromCache(media);
            }
            else {
                media = this._generateNewSsrcsForSimulcast(media, primarySsrc);
                const simulcastSsrcs = this._parseSimLayers(media);
                // Update the SSRCs in the cache so that they can re-used for the same mid again.
                this._ssrcCache.set(mid, simulcastSsrcs);
            }
        }
        return {
            type: description.type,
            sdp: transform.write(session)
        };
    }
}
//# sourceMappingURL=SdpSimulcast.js.map