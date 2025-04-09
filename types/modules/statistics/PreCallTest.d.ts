export interface IPreCallResult {
    fractionalLoss: number;
    jitter: number;
    mediaConnectivity: boolean;
    rtt: number;
    throughput: number;
}
export interface IIceServer {
    credential?: string;
    urls: Array<string> | string;
    username?: string;
}
/**
 * Run a pre-call test to check the network conditions. It uses a TURN server to establish
 * a connection between two PeerConnections using the server as a relay. Afterwards it sends
 * some test traffic through a data channel to measure the network conditions, these are
 * recorded and returned through a Promise.
 *
 * @param {Array<IIceServer>} - The ICE servers to use for the test, these are passes to the PeerConnection constructor.
 * @returns {Promise<IPreCallResult | any>} - A Promise that resolves with the test results or rejects with an error.
 */
export default function runPreCallTest(iceServers: Array<IIceServer>): Promise<IPreCallResult | string>;
