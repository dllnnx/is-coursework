/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AcGroupDto } from '../models/AcGroupDto';
import type { AirConditionerDto } from '../models/AirConditionerDto';
import type { SetModeRequest } from '../models/SetModeRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AcGroupsService {
    /**
     * Get AC group by ID
     * @param id
     * @returns AcGroupDto OK
     * @throws ApiError
     */
    public static getById3(
        id: number,
    ): CancelablePromise<AcGroupDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/groups/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Update an AC group
     * @param id
     * @param requestBody
     * @returns AcGroupDto OK
     * @throws ApiError
     */
    public static update3(
        id: number,
        requestBody: AcGroupDto,
    ): CancelablePromise<AcGroupDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/groups/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete an AC group
     * @param id
     * @returns any OK
     * @throws ApiError
     */
    public static delete3(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/groups/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Get all AC groups
     * @returns AcGroupDto OK
     * @throws ApiError
     */
    public static getAll(): CancelablePromise<Array<AcGroupDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/groups',
        });
    }
    /**
     * Create a new AC group
     * @param requestBody
     * @returns AcGroupDto OK
     * @throws ApiError
     */
    public static create3(
        requestBody: AcGroupDto,
    ): CancelablePromise<AcGroupDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/groups',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Turn on all air conditioners in a group
     * @param id
     * @returns any OK
     * @throws ApiError
     */
    public static turnOnGroup(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/groups/{id}/turn-on',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Turn off all air conditioners in a group
     * @param id
     * @returns any OK
     * @throws ApiError
     */
    public static turnOffGroup(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/groups/{id}/turn-off',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Set mode for all air conditioners in a group
     * @param id
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static setGroupMode(
        id: number,
        requestBody: SetModeRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/groups/{id}/set-mode',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Add an air conditioner to a group
     * @param groupId
     * @param acId
     * @returns AcGroupDto OK
     * @throws ApiError
     */
    public static addAirConditioner(
        groupId: number,
        acId: number,
    ): CancelablePromise<AcGroupDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/groups/{groupId}/air-conditioners/{acId}',
            path: {
                'groupId': groupId,
                'acId': acId,
            },
        });
    }
    /**
     * Remove an air conditioner from a group
     * @param groupId
     * @param acId
     * @returns AcGroupDto OK
     * @throws ApiError
     */
    public static removeAirConditioner(
        groupId: number,
        acId: number,
    ): CancelablePromise<AcGroupDto> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/groups/{groupId}/air-conditioners/{acId}',
            path: {
                'groupId': groupId,
                'acId': acId,
            },
        });
    }
    /**
     * Get air conditioners in a group
     * @param id
     * @returns AirConditionerDto OK
     * @throws ApiError
     */
    public static getAirConditioners(
        id: number,
    ): CancelablePromise<Array<AirConditionerDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/groups/{id}/air-conditioners',
            path: {
                'id': id,
            },
        });
    }
}
