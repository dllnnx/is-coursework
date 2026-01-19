/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Link } from '../models/Link';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ActuatorService {
    /**
     * Actuator root web endpoint
     * @returns Link OK
     * @throws ApiError
     */
    public static links(): CancelablePromise<Record<string, Record<string, Link>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/actuator',
        });
    }
    /**
     * Actuator web endpoint 'prometheus'
     * @param format
     * @param includedNames
     * @returns any OK
     * @throws ApiError
     */
    public static scrape(
        format?: 'CONTENT_TYPE_004' | 'CONTENT_TYPE_OPENMETRICS_100' | 'CONTENT_TYPE_PROTOBUF',
        includedNames?: string,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/actuator/prometheus',
            query: {
                'format': format,
                'includedNames': includedNames,
            },
        });
    }
    /**
     * Actuator web endpoint 'metrics'
     * @returns any OK
     * @throws ApiError
     */
    public static listNames(): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/actuator/metrics',
        });
    }
    /**
     * Actuator web endpoint 'metrics-requiredMetricName'
     * @param requiredMetricName
     * @param tag
     * @returns any OK
     * @throws ApiError
     */
    public static metric(
        requiredMetricName: string,
        tag?: string,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/actuator/metrics/{requiredMetricName}',
            path: {
                'requiredMetricName': requiredMetricName,
            },
            query: {
                'tag': tag,
            },
            errors: {
                404: `Not Found`,
            },
        });
    }
    /**
     * Actuator web endpoint 'info'
     * @returns any OK
     * @throws ApiError
     */
    public static info(): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/actuator/info',
        });
    }
    /**
     * Actuator web endpoint 'health'
     * @returns any OK
     * @throws ApiError
     */
    public static health(): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/actuator/health',
        });
    }
}
