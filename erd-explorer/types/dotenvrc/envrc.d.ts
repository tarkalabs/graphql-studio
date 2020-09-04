/// <reference types="node" />
import ProcessEnv = NodeJS.ProcessEnv;

export interface EnvConfig {}
export declare function parse(config?: EnvConfig): ProcessEnv;
export declare function inject(config?: EnvConfig): void;
