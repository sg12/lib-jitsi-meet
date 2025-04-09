/**
 * An encoder for RFC 2198 redundancy using WebRTC Insertable Streams.
 */
export declare class RFC2198Encoder {
    targetRedundancy: number;
    frameBuffer: any[];
    payloadType: number | undefined;
    /**
     * @param {number} targetRedundancy the desired amount of redundancy.
     */
    constructor(targetRedundancy?: number);
    /**
     * Set the desired level of redudancy. 4 means "four redundant frames plus current frame.
     * It is possible to reduce this to 0 to minimize the overhead to one byte.
     * @param {number} targetRedundancy the desired amount of redundancy.
     */
    setRedundancy(targetRedundancy: number): void;
    /**
     * Set the "inner opus payload type". This is typically our RED payload type that we tell
     * the other side as our opus payload type. Can be queried from the sender using getParameters()
     * after setting the answer.
     * @param {number} payloadType the payload type to use for opus.
     */
    setPayloadType(payloadType: number): void;
    /**
     * This is the actual transform to add redundancy to a raw opus frame.
     * @param {RTCEncodedAudioFrame} encodedFrame - Encoded audio frame.
     * @param {TransformStreamDefaultController} controller - TransportStreamController.
     */
    addRedundancy(encodedFrame: RTCEncodedAudioFrame, controller: TransformStreamDefaultController): void;
}
