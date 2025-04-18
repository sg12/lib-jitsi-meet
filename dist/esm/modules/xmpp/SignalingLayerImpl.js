import { safeJsonParse } from '@jitsi/js-utils/json';
import { getLogger } from '@jitsi/logger';
import { Strophe } from 'strophe.js';
import { MediaType } from '../../service/RTC/MediaType';
import * as SignalingEvents from '../../service/RTC/SignalingEvents';
import SignalingLayer, { getMediaTypeFromSourceName } from '../../service/RTC/SignalingLayer';
import { VideoType } from '../../service/RTC/VideoType';
import { XMPPEvents } from '../../service/xmpp/XMPPEvents';
import FeatureFlags from '../flags/FeatureFlags';
import { filterNodeFromPresenceJSON } from './ChatRoom';
const logger = getLogger('modules/xmpp/SignalingLayerImpl');
export const SOURCE_INFO_PRESENCE_ELEMENT = 'SourceInfo';
/**
 * Default XMPP implementation of the {@link SignalingLayer} interface. Obtains
 * the data from the MUC presence.
 */
export default class SignalingLayerImpl extends SignalingLayer {
    /**
     * Creates new instance.
     */
    constructor() {
        super();
        /**
         * A map that stores SSRCs of remote streams and the corresponding jid and source name.
         * FIXME: This map got filled and never cleaned and can grow during long
         * conference
         * @type {Map<number, { endpointId: string, sourceName: string }>} maps SSRC number to jid and source name.
         */
        this.ssrcOwners = new Map();
        /**
         *
         * @type {ChatRoom|null}
         */
        this.chatRoom = null;
        /**
         * @type {Map<SourceName, SourceInfo>}
         * @private
         */
        this._localSourceState = {};
        /**
         * @type {Map<EndpointId, Map<SourceName, SourceInfo>>}
         * @private
         */
        this._remoteSourceState = {};
    }
    /**
     * Adds <SourceInfo> element to the local presence.
     *
     * @returns {void}
     * @private
     */
    _addLocalSourceInfoToPresence() {
        if (this.chatRoom) {
            return this.chatRoom.addOrReplaceInPresence(SOURCE_INFO_PRESENCE_ELEMENT, { value: JSON.stringify(this._localSourceState) });
        }
        return false;
    }
    /**
     * Binds event listeners to the chat room instance.
     * @param {ChatRoom} room
     * @private
     * @returns {void}
     */
    _bindChatRoomEventHandlers(room) {
        // Add handlers for 'audiomuted', 'videomuted' and 'videoType' fields in presence in order to support interop
        // with very old versions of mobile clients and jigasi that do not support source-name signaling.
        const emitAudioMutedEvent = (endpointId, muted) => {
            this.eventEmitter.emit(SignalingEvents.PEER_MUTED_CHANGED, endpointId, MediaType.AUDIO, muted);
        };
        this._audioMuteHandler = (node, from) => {
            if (!this._doesEndpointSendNewSourceInfo(from)) {
                emitAudioMutedEvent(from, node.value === 'true');
            }
        };
        room.addPresenceListener('audiomuted', this._audioMuteHandler);
        const emitVideoMutedEvent = (endpointId, muted) => {
            this.eventEmitter.emit(SignalingEvents.PEER_MUTED_CHANGED, endpointId, MediaType.VIDEO, muted);
        };
        this._videoMuteHandler = (node, from) => {
            if (!this._doesEndpointSendNewSourceInfo(from)) {
                emitVideoMutedEvent(from, node.value === 'true');
            }
        };
        room.addPresenceListener('videomuted', this._videoMuteHandler);
        const emitVideoTypeEvent = (endpointId, videoType) => {
            this.eventEmitter.emit(SignalingEvents.PEER_VIDEO_TYPE_CHANGED, endpointId, videoType);
        };
        this._videoTypeHandler = (node, from) => {
            if (!this._doesEndpointSendNewSourceInfo(from)) {
                emitVideoTypeEvent(from, node.value);
            }
        };
        room.addPresenceListener('videoType', this._videoTypeHandler);
        // Add handlers for presence in the new format.
        this._sourceInfoHandler = (node, mucNick) => {
            var _a;
            const endpointId = mucNick;
            const { value } = node;
            const sourceInfoJSON = safeJsonParse(value);
            const emitEventsFromHere = this._doesEndpointSendNewSourceInfo(endpointId);
            const endpointSourceState = this._remoteSourceState[endpointId] || (this._remoteSourceState[endpointId] = {});
            for (const sourceName of Object.keys(sourceInfoJSON)) {
                let sourceChanged = false;
                const mediaType = getMediaTypeFromSourceName(sourceName);
                const newMutedState = Boolean(sourceInfoJSON[sourceName].muted);
                const oldSourceState = endpointSourceState[sourceName]
                    || (endpointSourceState[sourceName] = { sourceName });
                if (oldSourceState.muted !== newMutedState) {
                    sourceChanged = true;
                    oldSourceState.muted = newMutedState;
                    if (emitEventsFromHere && !this._localSourceState[sourceName]) {
                        this.eventEmitter.emit(SignalingEvents.SOURCE_MUTED_CHANGED, sourceName, newMutedState);
                    }
                }
                // Assume a default videoType of 'camera' for video sources.
                const newVideoType = mediaType === MediaType.VIDEO
                    ? (_a = sourceInfoJSON[sourceName].videoType) !== null && _a !== void 0 ? _a : VideoType.CAMERA
                    : undefined;
                if (oldSourceState.videoType !== newVideoType) {
                    oldSourceState.videoType = newVideoType;
                    sourceChanged = true;
                    // Since having a mix of eps that do/don't support multi-stream in the same call is supported, emit
                    // SOURCE_VIDEO_TYPE_CHANGED event when the remote source changes videoType.
                    if (emitEventsFromHere && !this._localSourceState[sourceName]) {
                        this.eventEmitter.emit(SignalingEvents.SOURCE_VIDEO_TYPE_CHANGED, sourceName, newVideoType);
                    }
                }
                if (sourceChanged && FeatureFlags.isSsrcRewritingSupported()) {
                    this.eventEmitter.emit(SignalingEvents.SOURCE_UPDATED, sourceName, mucNick, newMutedState, newVideoType);
                }
            }
            // Cleanup removed source names
            const newSourceNames = Object.keys(sourceInfoJSON);
            for (const sourceName of Object.keys(endpointSourceState)) {
                if (newSourceNames.indexOf(sourceName) === -1) {
                    delete endpointSourceState[sourceName];
                }
            }
        };
        room.addPresenceListener('SourceInfo', this._sourceInfoHandler);
        // Cleanup when participant leaves
        this._memberLeftHandler = jid => {
            const endpointId = Strophe.getResourceFromJid(jid);
            delete this._remoteSourceState[endpointId];
        };
        room.addEventListener(XMPPEvents.MUC_MEMBER_LEFT, this._memberLeftHandler);
    }
    /**
     * Check is given endpoint has advertised <SourceInfo/> in it's presence which means that the source name signaling
     * is used by this endpoint.
     *
     * @param {EndpointId} endpointId
     * @returns {boolean}
     */
    _doesEndpointSendNewSourceInfo(endpointId) {
        var _a;
        const presence = (_a = this.chatRoom) === null || _a === void 0 ? void 0 : _a.getLastPresence(endpointId);
        return Boolean(presence && presence.find(node => node.tagName === SOURCE_INFO_PRESENCE_ELEMENT));
    }
    /**
     * Logs a debug or error message to console depending on whether SSRC rewriting is enabled or not.
     * Owner changes are permitted only when SSRC rewriting is enabled.
     *
     * @param {string} message - The message to be logged.
     * @returns {void}
     */
    _logOwnerChangedMessage(message) {
        if (FeatureFlags.isSsrcRewritingSupported()) {
            logger.debug(message);
        }
        else {
            logger.error(message);
        }
    }
    /**
     * @inheritDoc
     */
    getPeerMediaInfo(owner, mediaType, sourceName) {
        var _a, _b, _c;
        const legacyGetPeerMediaInfo = () => {
            if (this.chatRoom) {
                return this.chatRoom.getMediaPresenceInfo(owner, mediaType);
            }
            logger.warn('Requested peer media info, before room was set');
        };
        const lastPresence = (_a = this.chatRoom) === null || _a === void 0 ? void 0 : _a.getLastPresence(owner);
        if (!lastPresence) {
            logger.warn(`getPeerMediaInfo - no presence stored for: ${owner}`);
            return;
        }
        if (!this._doesEndpointSendNewSourceInfo(owner)) {
            return legacyGetPeerMediaInfo();
        }
        if (sourceName) {
            return this.getPeerSourceInfo(owner, sourceName);
        }
        const mediaInfo = {
            muted: true
        };
        if (mediaType === MediaType.VIDEO) {
            mediaInfo.videoType = undefined;
            const codecListNode = filterNodeFromPresenceJSON(lastPresence, 'jitsi_participant_codecList');
            const codecTypeNode = filterNodeFromPresenceJSON(lastPresence, 'jitsi_participant_codecType');
            if (codecListNode.length) {
                mediaInfo.codecList = (_c = (_b = codecListNode[0].value) === null || _b === void 0 ? void 0 : _b.split(',')) !== null && _c !== void 0 ? _c : [];
            }
            else if (codecTypeNode.length > 0) {
                mediaInfo.codecType = codecTypeNode[0].value;
            }
        }
        return mediaInfo;
    }
    /**
     * @inheritDoc
     */
    getPeerSourceInfo(owner, sourceName) {
        var _a;
        const mediaType = getMediaTypeFromSourceName(sourceName);
        const mediaInfo = {
            muted: true,
            videoType: mediaType === MediaType.VIDEO ? VideoType.CAMERA : undefined // 'camera' by default
        };
        return this._remoteSourceState[owner]
            ? (_a = this._remoteSourceState[owner][sourceName]) !== null && _a !== void 0 ? _a : mediaInfo
            : undefined;
    }
    /**
     * @inheritDoc
     */
    getSSRCOwner(ssrc) {
        var _a;
        return (_a = this.ssrcOwners.get(ssrc)) === null || _a === void 0 ? void 0 : _a.endpointId;
    }
    /**
     * @inheritDoc
     */
    getTrackSourceName(ssrc) {
        var _a;
        return (_a = this.ssrcOwners.get(ssrc)) === null || _a === void 0 ? void 0 : _a.sourceName;
    }
    /**
     * @inheritDoc
     */
    removeSSRCOwners(ssrcList) {
        if (!(ssrcList === null || ssrcList === void 0 ? void 0 : ssrcList.length)) {
            return;
        }
        for (const ssrc of ssrcList) {
            this.ssrcOwners.delete(ssrc);
        }
    }
    /**
     * Sets the <tt>ChatRoom</tt> instance used and binds presence listeners.
     * @param {ChatRoom} room
     */
    setChatRoom(room) {
        const oldChatRoom = this.chatRoom;
        this.chatRoom = room;
        if (oldChatRoom) {
            oldChatRoom.removePresenceListener('audiomuted', this._audioMuteHandler);
            oldChatRoom.removePresenceListener('videomuted', this._videoMuteHandler);
            oldChatRoom.removePresenceListener('videoType', this._videoTypeHandler);
            this._sourceInfoHandler
                && oldChatRoom.removePresenceListener(SOURCE_INFO_PRESENCE_ELEMENT, this._sourceInfoHandler);
            this._memberLeftHandler
                && oldChatRoom.removeEventListener(XMPPEvents.MUC_MEMBER_LEFT, this._memberLeftHandler);
        }
        if (room) {
            this._bindChatRoomEventHandlers(room);
            this._addLocalSourceInfoToPresence();
        }
    }
    /**
     * @inheritDoc
     */
    setSSRCOwner(ssrc, newEndpointId, newSourceName) {
        if (typeof ssrc !== 'number') {
            throw new TypeError(`SSRC(${ssrc}) must be a number`);
        }
        // Now signaling layer instance is shared between different JingleSessionPC instances, so although very unlikely
        // an SSRC conflict could potentially occur. Log a message to make debugging easier.
        const existingOwner = this.ssrcOwners.get(ssrc);
        if (existingOwner) {
            const { endpointId, sourceName } = existingOwner;
            if (endpointId !== newEndpointId || sourceName !== newSourceName) {
                this._logOwnerChangedMessage(`SSRC owner re-assigned from ${existingOwner}(source-name=${sourceName}) to ${newEndpointId}(source-name=${newSourceName})`);
            }
        }
        this.ssrcOwners.set(ssrc, {
            endpointId: newEndpointId,
            sourceName: newSourceName
        });
    }
    /**
     * @inheritDoc
     */
    setTrackMuteStatus(sourceName, muted) {
        if (!this._localSourceState[sourceName]) {
            this._localSourceState[sourceName] = {};
        }
        this._localSourceState[sourceName].muted = muted;
        logger.debug(`Mute state of ${sourceName} changed to muted=${muted}`);
        if (this.chatRoom) {
            return this._addLocalSourceInfoToPresence();
        }
        return false;
    }
    /**
     * @inheritDoc
     */
    setTrackVideoType(sourceName, videoType) {
        if (!this._localSourceState[sourceName]) {
            this._localSourceState[sourceName] = {};
        }
        if (this._localSourceState[sourceName].videoType !== videoType) {
            // Include only if not a camera (default)
            this._localSourceState[sourceName].videoType = videoType === VideoType.CAMERA ? undefined : videoType;
            return this._addLocalSourceInfoToPresence();
        }
        return false;
    }
    /**
     * @inheritDoc
     */
    updateSsrcOwnersOnLeave(id) {
        const ssrcs = [];
        this.ssrcOwners.forEach(({ endpointId }, ssrc) => {
            if (endpointId === id) {
                ssrcs.push(ssrc);
            }
        });
        if (!(ssrcs === null || ssrcs === void 0 ? void 0 : ssrcs.length)) {
            return;
        }
        this.removeSSRCOwners(ssrcs);
    }
}
//# sourceMappingURL=SignalingLayerImpl.js.map