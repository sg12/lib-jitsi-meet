import Listenable from '../util/Listenable';
/**
 * ConnectionPlugin class.
 */
declare const _default: {
    new (...args: any[]): {
        connection: any;
        /**
         *
         * @param connection
         */
        init(connection: any): void;
    };
} & (new (...args: any[]) => {});
export default _default;
/**
 * ConnectionPlugin class that extends Listenable.
 */
export declare const ConnectionPluginListenable: {
    new (...args: any[]): {
        connection: any | null;
        /**
         *
         * @param connection
         */
        init(connection: any): void;
    };
} & typeof Listenable;
