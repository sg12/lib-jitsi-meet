/**
 *
 */
export interface ISettings {
    _storage: Storage;
    readonly callStatsUserName: string;
    init: (externalStorage?: Storage) => void;
    readonly machineId: string;
    sessionId: string;
}
declare const Settings: ISettings;
export default Settings;
