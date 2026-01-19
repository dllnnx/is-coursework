/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthenticationService {
    /**
     * Check authentication status
     * Returns whether the user is authenticated and their approval status
     * @returns any OK
     * @throws ApiError
     */
    public static getStatus(): CancelablePromise<Record<string, Record<string, any>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/auth/status',
        });
    }
    /**
     * Get current authenticated user
     * Returns the currently authenticated user info and registration status
     * @returns any OK
     * @throws ApiError
     */
    public static getCurrentUser(): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/auth/me',
        });
    }
    /**
     * Get login information
     * Returns OAuth2 login URL for Yandex ID
     * @returns string OK
     * @throws ApiError
     */
    public static getLoginInfo(): CancelablePromise<Record<string, string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/auth/login-info',
        });
    }
}
