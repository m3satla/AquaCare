declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    PORT?: string;
    MONGODB_URI?: string;
    SESSION_SECRET?: string;
    [key: string]: string | undefined;
  }
  interface Process {
    env: ProcessEnv;
    cwd(): string;
    exit(code?: number): never;
  }
}

declare var process: NodeJS.Process;

// Node.js built-in modules
declare module 'fs' {
  export function readFileSync(path: string, encoding: string): string;
  export function writeFileSync(path: string, data: string, encoding: string): void;
  export function existsSync(path: string): boolean;
  export function readdirSync(path: string): string[];
}

declare module 'path' {
  export function join(...paths: string[]): string;
}
