/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BuildingDto } from '../models/BuildingDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BuildingsService {
    /**
     * Get building by ID
     * @param id
     * @returns BuildingDto OK
     * @throws ApiError
     */
    public static getById4(
        id: number,
    ): CancelablePromise<BuildingDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/buildings/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Update a building
     * @param id
     * @param requestBody
     * @returns BuildingDto OK
     * @throws ApiError
     */
    public static update4(
        id: number,
        requestBody: BuildingDto,
    ): CancelablePromise<BuildingDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/buildings/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete a building
     * @param id
     * @returns any OK
     * @throws ApiError
     */
    public static delete4(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/buildings/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Get all buildings
     * @returns BuildingDto OK
     * @throws ApiError
     */
    public static getAll1(): CancelablePromise<Array<BuildingDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/buildings',
        });
    }
    /**
     * Create a new building
     * @param requestBody
     * @returns BuildingDto OK
     * @throws ApiError
     */
    public static create4(
        requestBody: BuildingDto,
    ): CancelablePromise<BuildingDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/buildings',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get buildings accessible by user
     * @param userId
     * @returns BuildingDto OK
     * @throws ApiError
     */
    public static getByUserId(
        userId: number,
    ): CancelablePromise<Array<BuildingDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/buildings/user/{userId}',
            path: {
                'userId': userId,
            },
        });
    }
    /**
     * Search buildings by name
     * @param name
     * @returns BuildingDto OK
     * @throws ApiError
     */
    public static searchByName1(
        name: string,
    ): CancelablePromise<Array<BuildingDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/buildings/search',
            query: {
                'name': name,
            },
        });
    }
}
