/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RoomDto } from '../models/RoomDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RoomsService {
    /**
     * Get room by ID
     * @param id
     * @returns RoomDto OK
     * @throws ApiError
     */
    public static getById2(
        id: number,
    ): CancelablePromise<RoomDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/rooms/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Update a room
     * @param id
     * @param requestBody
     * @returns RoomDto OK
     * @throws ApiError
     */
    public static update2(
        id: number,
        requestBody: RoomDto,
    ): CancelablePromise<RoomDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/rooms/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete a room
     * @param id
     * @returns any OK
     * @throws ApiError
     */
    public static delete2(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/rooms/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Get rooms by building ID
     * @param buildingId
     * @returns RoomDto OK
     * @throws ApiError
     */
    public static getByBuildingId(
        buildingId: number,
    ): CancelablePromise<Array<RoomDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/rooms/building/{buildingId}',
            path: {
                'buildingId': buildingId,
            },
        });
    }
    /**
     * Create a new room in a building
     * @param buildingId
     * @param requestBody
     * @returns RoomDto OK
     * @throws ApiError
     */
    public static create2(
        buildingId: number,
        requestBody: RoomDto,
    ): CancelablePromise<RoomDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/rooms/building/{buildingId}',
            path: {
                'buildingId': buildingId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get all rooms
     * @returns RoomDto OK
     * @throws ApiError
     */
    public static getAll5(): CancelablePromise<Array<RoomDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/rooms',
        });
    }
    /**
     * Search rooms by name
     * @param name
     * @returns RoomDto OK
     * @throws ApiError
     */
    public static searchByName(
        name: string,
    ): CancelablePromise<Array<RoomDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/rooms/search',
            query: {
                'name': name,
            },
        });
    }
}
