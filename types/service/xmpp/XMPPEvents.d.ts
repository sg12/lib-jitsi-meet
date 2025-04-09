export declare enum XMPPEvents {
    /**
     * Indicates error while adding ice candidate.
     */
    ADD_ICE_CANDIDATE_FAILED = "xmpp.add_ice_candidate_failed",
    AUDIO_MUTED_BY_FOCUS = "xmpp.audio_muted_by_focus",
    AUTHENTICATION_REQUIRED = "xmpp.authentication_required",
    /**
     * Event fired when we receive a message for AV moderation approved for the local participant.
     */
    AV_MODERATION_APPROVED = "xmpp.av_moderation.approved",
    /**
     * Event fired when the moderation enable/disable changes.
     */
    AV_MODERATION_CHANGED = "xmpp.av_moderation.changed",
    /**
     * Event fired when we receive message that a new jid was approved.
     */
    AV_MODERATION_PARTICIPANT_APPROVED = "xmpp.av_moderation.participant.approved",
    /**
     * Event fired when we receive message that a new jid was approved.
     */
    AV_MODERATION_PARTICIPANT_REJECTED = "xmpp.av_moderation.participant.rejected",
    /**
     * Event fired when we receive a message for AV moderation.
     */
    AV_MODERATION_RECEIVED = "xmpp.av_moderation.received",
    /**
    * Event fired when we receive a message for AV moderation rejected for the local participant.
    */
    AV_MODERATION_REJECTED = "xmpp.av_moderation.rejected",
    /**
     * Event fired when we receive a message for breakout rooms.
     */
    BREAKOUT_ROOMS_EVENT = "xmpp.breakout-rooms.event",
    /**
     * Event fired when a participant is requested to join a given (breakout) room.
     */
    BREAKOUT_ROOMS_MOVE_TO_ROOM = "xmpp.breakout-rooms.move-to-room",
    /**
     * Event fired when the breakout rooms data was updated.
     */
    BREAKOUT_ROOMS_UPDATED = "xmpp.breakout-rooms.updated",
    BRIDGE_DOWN = "xmpp.bridge_down",
    /**
     * Triggered when 'session-accept' is received from the responder.
     */
    CALL_ACCEPTED = "xmpp.callaccepted.jingle",
    CALL_ENDED = "xmpp.callended.jingle",
    CALL_INCOMING = "xmpp.callincoming.jingle",
    CHAT_ERROR_RECEIVED = "xmpp.chat_error_received",
    CONFERENCE_PROPERTIES_CHANGED = "xmpp.conference_properties_changed",
    /**
     * Event fired when conference creation timestamp is received.
     */
    CONFERENCE_TIMESTAMP_RECEIVED = "xmpp.conference_timestamp_received",
    /**
     * This event is triggered when the ICE connects for the first time.
     */
    CONNECTION_ESTABLISHED = "xmpp.connection.connected",
    CONNECTION_FAILED = "xmpp.connection.failed",
    CONNECTION_ICE_FAILED = "xmpp.connection.ice.failed",
    CONNECTION_INTERRUPTED = "xmpp.connection.interrupted",
    CONNECTION_RESTARTED = "xmpp.connection.restart",
    CONNECTION_RESTORED = "xmpp.connection.restored",
    /**
     * Designates an event indicating connection status changes.
     */
    CONNECTION_STATUS_CHANGED = "xmpp.connection.status.changed",
    DISPLAY_NAME_CHANGED = "xmpp.display_name_changed",
    /**
     * Event for incoming presence error which is for required display name.
     */
    DISPLAY_NAME_REQUIRED = "xmpp.display_name_required",
    /**
     * Chat room instance have been added to Strophe.emuc plugin.
     */
    EMUC_ROOM_ADDED = "xmpp.emuc_room_added",
    /**
     * Chat room instance have been removed from Strophe.emuc plugin.
     */
    EMUC_ROOM_REMOVED = "xmpp.emuc_room_removed",
    ETHERPAD = "xmpp.etherpad",
    FOCUS_DISCONNECTED = "xmpp.focus_disconnected",
    FOCUS_LEFT = "xmpp.focus_left",
    GRACEFUL_SHUTDOWN = "xmpp.graceful_shutdown",
    ICE_CONNECTION_STATE_CHANGED = "xmpp.ice_connection_state_changed",
    INVITE_MESSAGE_RECEIVED = "xmpp.invite_message_received",
    /**
     * Event which is emitted when the body in an XMPP message in the MUC
     * contains JSON
     * TODO: this event contains a typo (xmmp vs xmpp) but it's unlikely this can be changed now
     */
    JSON_MESSAGE_RECEIVED = "xmmp.json_message_received",
    /**
     * Designates an event indicating that we were kicked from the XMPP MUC.
     * @param {boolean} isSelfPresence - whether it is for local participant
     * or another participant.
     * @param {string} actorJid - the jid of the participant who was initiator
     * of the kick.
     * @param {?string} participantJid - when it is not a kick for local participant,
     * this is the jid of the participant which was kicked.
     */
    KICKED = "xmpp.kicked",
    LOCAL_ROLE_CHANGED = "xmpp.localrole_changed",
    /**
     * Event fired when the unique meeting id is set.
     */
    MEETING_ID_SET = "xmpp.meeting_id_set",
    MESSAGE_RECEIVED = "xmpp.message_received",
    MUC_DENIED_ACCESS = "xmpp.muc_denied access",
    MUC_DESTROYED = "xmpp.muc_destroyed",
    MUC_JOINED = "xmpp.muc_joined",
    MUC_JOIN_IN_PROGRESS = "xmpp.muc_join_in_progress",
    MUC_LEFT = "xmpp.muc_left",
    MUC_LOBBY_MEMBER_JOINED = "xmpp.muc_lobby_member_joined",
    MUC_LOBBY_MEMBER_LEFT = "xmpp.muc_lobby_member_left",
    MUC_LOBBY_MEMBER_UPDATED = "xmpp.muc_lobby_member_updated",
    MUC_LOCK_CHANGED = "xmpp.muc_lock_changed",
    MUC_MEMBERS_ONLY_CHANGED = "xmpp.muc_members_only_changed",
    MUC_MEMBER_BOT_TYPE_CHANGED = "xmpp.muc_member_bot_type_changed",
    MUC_MEMBER_JOINED = "xmpp.muc_member_joined",
    MUC_MEMBER_LEFT = "xmpp.muc_member_left",
    MUC_ROLE_CHANGED = "xmpp.muc_role_changed",
    MUC_VISITORS_SUPPORTED_CHANGED = "xmpp.muc_visitors_supported_changed",
    PARTICIPANT_AUDIO_MUTED = "xmpp.audio_muted",
    /**
     * Indicates that the features of the participant has been changed.
     */
    PARTICIPANT_FEATURES_CHANGED = "xmpp.participant_features_changed",
    PARTICIPANT_VIDEO_MUTED = "xmpp.video_muted",
    PARTICIPANT_VIDEO_TYPE_CHANGED = "xmpp.video_type",
    PASSWORD_REQUIRED = "xmpp.password_required",
    /**
     * Event fired when we receive a self-presence with permissions.
     */
    PERMISSIONS_RECEIVED = "xmpp.permissions_received",
    /**
     * Indicates that phone number changed.
     */
    PHONE_NUMBER_CHANGED = "conference.phoneNumberChanged",
    PRESENCE_RECEIVED = "xmpp.presence_received",
    PRESENCE_STATUS = "xmpp.presence_status",
    PRIVATE_MESSAGE_RECEIVED = "xmpp.private_message_received",
    PROMPT_FOR_LOGIN = "xmpp.prompt_for_login",
    REACTION_RECEIVED = "xmpp.reaction_received",
    READY_TO_JOIN = "xmpp.ready_to_join",
    /**
     * Indicates that recording state changed.
     */
    RECORDER_STATE_CHANGED = "xmpp.recorderStateChanged",
    REMOTE_STATS = "xmpp.remote_stats",
    /**
     * Indicates that the offer / answer renegotiation has failed.
     */
    RENEGOTIATION_FAILED = "xmpp.renegotiation_failed",
    RESERVATION_ERROR = "xmpp.room_reservation_error",
    ROOM_CONNECT_ERROR = "xmpp.room_connect_error",
    ROOM_CONNECT_MEMBERS_ONLY_ERROR = "xmpp.room_connect_error.members_only",
    ROOM_CONNECT_NOT_ALLOWED_ERROR = "xmpp.room_connect_error.not_allowed",
    ROOM_DISCO_INFO_FAILED = "xmpp.room_disco_info_failed",
    /**
     * Indicates that we have received a reply to our disco-info request for the room.
     */
    ROOM_DISCO_INFO_UPDATED = "xmpp.room_disco_info_updated",
    ROOM_JOIN_ERROR = "xmpp.room_join_error",
    /**
     * Indicates that max users limit has been reached.
     */
    ROOM_MAX_USERS_ERROR = "xmpp.room_max_users_error",
    /**
     * Event fired when we receive a message related to room metadata.
     */
    ROOM_METADATA_EVENT = "xmpp.room-metadata.event",
    /**
     * Event fired when we receive a message related to room metadata.
     */
    ROOM_METADATA_UPDATED = "xmpp.room-metadata.updated",
    SENDING_CHAT_MESSAGE = "xmpp.sending_chat_message",
    SENDING_PRIVATE_CHAT_MESSAGE = "xmpp.sending_private_chat_message",
    /**
     * Event fired after receiving the confirmation about session accept.
     */
    SESSION_ACCEPT = "xmpp.session_accept",
    /**
     * Event fired if we receive an error after sending the session accept.
     */
    SESSION_ACCEPT_ERROR = "xmpp.session_accept_error",
    /**
     * Event fired when we do not get our 'session-accept' acknowledged by
     * Jicofo. It most likely means that there is serious problem with our
     * connection or XMPP server and we should reload the conference.
     *
     * We have seen that to happen in BOSH requests race condition when the BOSH
     * request table containing the 'session-accept' was discarded by Prosody.
     * Jicofo does send the RESULT immediately without any condition, so missing
     * packets means that most likely it has never seen our IQ.
     */
    SESSION_ACCEPT_TIMEOUT = "xmpp.session_accept_timeout",
    SETTINGS_ERROR_RECEIVED = "xmpp.settings_error_received",
    /**
     * Event fired when participant joins a meeting without audio.
     */
    SILENT_STATUS_CHANGED = "xmpp.silent_status_changed",
    /**
     * Event fired after successful sending of jingle source-add.
     */
    SOURCE_ADD = "xmpp.source_add",
    /**
     * Event fired after receiving an error sending of jingle source-add.
     */
    SOURCE_ADD_ERROR = "xmpp.source_add_error",
    /**
     * Event fired after successful sending of jingle source-remove.
     */
    SOURCE_REMOVE = "xmpp.source_remove",
    /**
     * Event fired after receiving an error sending of jingle source-remove.
     */
    SOURCE_REMOVE_ERROR = "xmpp.source_remove_error",
    /**
     * Event fired when speaker stats update message is received.
     */
    SPEAKER_STATS_RECEIVED = "xmpp.speaker_stats_received",
    START_MUTED_FROM_FOCUS = "xmpp.start_muted_from_focus",
    SUBJECT_CHANGED = "xmpp.subject_changed",
    SUSPEND_DETECTED = "xmpp.suspend_detected",
    /**
     * Notifies for transcription status changes. The event provides the
     * following parameters to its listeners:
     *
     * @param {String} status - The new status.
     */
    TRANSCRIPTION_STATUS_CHANGED = "xmpp.transcription_status_changed",
    /**
     * Event fired when 'transport-info' with new ICE candidates is received.
     */
    TRANSPORT_INFO = "xmpp.transportinfo.jingle",
    VIDEO_MUTED_BY_FOCUS = "xmpp.video_muted_by_focus",
    /**
     * Indicates that video SIP GW state changed.
     *
     * @param {VideoSIPGWStatusConstants} status - Any of the following statuses:
     * STATUS_BUSY, STATUS_AVAILABLE or STATUS_UNDEFINED.
     */
    VIDEO_SIP_GW_AVAILABILITY_CHANGED = "xmpp.videoSIPGWAvailabilityChanged",
    /**
     * Indicates that video SIP GW Session state changed.
     * The statuses are any of the following statuses:
     * STATE_ON, STATE_OFF, STATE_PENDING, STATE_RETRYING, STATE_FAILED.
     * {@see VideoSIPGWStateConstants}
     *
     * @param {options} event - {address, oldState, newState, displayName}.
     */
    VIDEO_SIP_GW_SESSION_STATE_CHANGED = "xmpp.videoSIPGWSessionStateChanged",
    /**
     * Event indicating we have received a message from the visitors component.
     */
    VISITORS_MESSAGE = "xmpp.visitors_message",
    /**
     * Event indicating that our request for promotion was rejected.
     */
    VISITORS_REJECTION = "xmpp.visitors_rejection"
}
