/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AirConditionerDto } from '../models/AirConditionerDto';
import type { SetModeRequest } from '../models/SetModeRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AirConditionersService {
    /**
     * Get air conditioner by ID
     * @param id
     * @returns AirConditionerDto OK
     * @throws ApiError
     */
    public static getById5(
        id: number,
    ): CancelablePromise<AirConditionerDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/air-conditioners/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Update an air conditioner
     * @param id
     * @param requestBody
     * @returns AirConditionerDto OK
     * @throws ApiError
     */
    public static update5(
        id: number,
        requestBody: AirConditionerDto,
    ): CancelablePromise<AirConditionerDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/air-conditioners/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete an air conditioner
     * @param id
     * @returns any OK
     * @throws ApiError
     */
    public static delete5(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/air-conditioners/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Turn on an air conditioner
     * @param id
     * @returns AirConditionerDto OK
     * @throws ApiError
     */
    public static turnOn(
        id: number,
    ): CancelablePromise<AirConditionerDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/air-conditioners/{id}/turn-on',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Turn off an air conditioner
     * @param id
     * @returns AirConditionerDto OK
     * @throws ApiError
     */
    public static turnOff(
        id: number,
    ): CancelablePromise<AirConditionerDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/air-conditioners/{id}/turn-off',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Set mode and target temperature for an air conditioner
     * @param id
     * @param requestBody
     * @returns AirConditionerDto OK
     * @throws ApiError
     */
    public static setMode(
        id: number,
        requestBody: SetModeRequest,
    ): CancelablePromise<AirConditionerDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/air-conditioners/{id}/set-mode',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get air conditioners by room ID
     * @param roomId
     * @returns AirConditionerDto OK
     * @throws ApiError
     */
    public static getByRoomId1(
        roomId: number,
    ): CancelablePromise<Array<AirConditionerDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/air-conditioners/room/{roomId}',
            path: {
                'roomId': roomId,
            },
        });
    }
    /**
     * Create a new air conditioner in a room
     * @param roomId
     * @param requestBody
     * @returns AirConditionerDto OK
     * @throws ApiError
     */
    public static create5(
        roomId: number,
        requestBody: AirConditionerDto,
    ): CancelablePromise<AirConditionerDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/air-conditioners/room/{roomId}',
            path: {
                'roomId': roomId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get all air conditioners
     * @returns AirConditionerDto OK
     * @throws ApiError
     */
    public static getAll6(): CancelablePromise<Array<AirConditionerDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/air-conditioners',
        });
    }
    /**
     * Filter air conditioners by status or mode
     * @param status
     * @param mode
     * @returns AirConditionerDto OK
     * @throws ApiError
     */
    public static filter(
        status?: string,
        mode?: string,
    ): CancelablePromise<Array<AirConditionerDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/air-conditioners/filter',
            query: {
                'status': status,
                'mode': mode,
            },
        });
    }
    /**
     * Get air conditioners by building ID
     * @param buildingId
     * @returns AirConditionerDto OK
     * @throws ApiError
     */
    public static getByBuildingId2(
        buildingId: number,
    ): CancelablePromise<Array<AirConditionerDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/air-conditioners/building/{buildingId}',
            path: {
                'buildingId': buildingId,
            },
        });
    }
}
