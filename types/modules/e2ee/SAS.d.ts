export interface ISas {
    [key: string]: number[] | [string, string][];
}
/**
 * Generates multiple SAS for the given bytes.
 *
 * @param {Uint8Array} sasBytes - The bytes from sas.generate_bytes.
 * @returns {ISas}
 */
export declare function generateSas(sasBytes: Uint8Array): ISas;
