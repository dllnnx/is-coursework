/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TemperatureSensorDto } from '../models/TemperatureSensorDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TemperatureSensorsService {
    /**
     * Get temperature sensor by ID
     * @param id
     * @returns TemperatureSensorDto OK
     * @throws ApiError
     */
    public static getById(
        id: number,
    ): CancelablePromise<TemperatureSensorDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/sensors/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Update a temperature sensor
     * @param id
     * @param requestBody
     * @returns TemperatureSensorDto OK
     * @throws ApiError
     */
    public static update(
        id: number,
        requestBody: TemperatureSensorDto,
    ): CancelablePromise<TemperatureSensorDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/sensors/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete a temperature sensor
     * @param id
     * @returns any OK
     * @throws ApiError
     */
    public static delete(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/sensors/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Update current temperature reading
     * @param id
     * @param requestBody
     * @returns TemperatureSensorDto OK
     * @throws ApiError
     */
    public static updateTemperature(
        id: number,
        requestBody: number,
    ): CancelablePromise<TemperatureSensorDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/sensors/{id}/temperature',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get temperature sensors by room ID
     * @param roomId
     * @returns TemperatureSensorDto OK
     * @throws ApiError
     */
    public static getByRoomId(
        roomId: number,
    ): CancelablePromise<Array<TemperatureSensorDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/sensors/room/{roomId}',
            path: {
                'roomId': roomId,
            },
        });
    }
    /**
     * Create a new temperature sensor in a room
     * @param roomId
     * @param requestBody
     * @returns TemperatureSensorDto OK
     * @throws ApiError
     */
    public static create(
        roomId: number,
        requestBody: TemperatureSensorDto,
    ): CancelablePromise<TemperatureSensorDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/sensors/room/{roomId}',
            path: {
                'roomId': roomId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get all temperature sensors
     * @returns TemperatureSensorDto OK
     * @throws ApiError
     */
    public static getAll3(): CancelablePromise<Array<TemperatureSensorDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/sensors',
        });
    }
    /**
     * Get temperature sensors by building ID
     * @param buildingId
     * @returns TemperatureSensorDto OK
     * @throws ApiError
     */
    public static getByBuildingId1(
        buildingId: number,
    ): CancelablePromise<Array<TemperatureSensorDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/sensors/building/{buildingId}',
            path: {
                'buildingId': buildingId,
            },
        });
    }
}
