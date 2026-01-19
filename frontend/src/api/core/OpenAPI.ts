/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiRequestOptions } from './ApiRequestOptions';

type Resolver<T> = (options: ApiRequestOptions) => Promise<T>;
type Headers = Record<string, string>;

export type OpenAPIConfig = {
    BASE: string;
    VERSION: string;
    WITH_CREDENTIALS: boolean;
    CREDENTIALS: 'include' | 'omit' | 'same-origin';
    TOKEN?: string | Resolver<string> | undefined;
    USERNAME?: string | Resolver<string> | undefined;
    PASSWORD?: string | Resolver<string> | undefined;
    HEADERS?: Headers | Resolver<Headers> | undefined;
    ENCODE_PATH?: ((path: string) => string) | undefined;
};

const TOKEN_STORAGE_KEY = 'ac_control_token';

export const OpenAPI: OpenAPIConfig = {
    BASE: '',
    VERSION: '1.0.0',
    WITH_CREDENTIALS: true,
    CREDENTIALS: 'include',
    TOKEN: async () => {
        const token = localStorage.getItem(TOKEN_STORAGE_KEY);
        return token || '';
    },
    USERNAME: undefined,
    PASSWORD: undefined,
    HEADERS: async (): Promise<Headers> => {
        const token = localStorage.getItem(TOKEN_STORAGE_KEY);
        const headers: Record<string, string> = {};
        if (token) {
            headers['Authorization'] = `OAuth ${token}`;
        }
        return headers;
    },
    ENCODE_PATH: undefined,
};
