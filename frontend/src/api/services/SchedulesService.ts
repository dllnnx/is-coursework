/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ScheduleDto } from '../models/ScheduleDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SchedulesService {
    /**
     * Get schedule by ID
     * @param id
     * @returns ScheduleDto OK
     * @throws ApiError
     */
    public static getById1(
        id: number,
    ): CancelablePromise<ScheduleDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/schedules/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Update a schedule
     * @param id
     * @param requestBody
     * @returns ScheduleDto OK
     * @throws ApiError
     */
    public static update1(
        id: number,
        requestBody: ScheduleDto,
    ): CancelablePromise<ScheduleDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/schedules/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete a schedule
     * @param id
     * @returns any OK
     * @throws ApiError
     */
    public static delete1(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/schedules/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Toggle schedule active status
     * @param id
     * @returns ScheduleDto OK
     * @throws ApiError
     */
    public static toggleActive(
        id: number,
    ): CancelablePromise<ScheduleDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/schedules/{id}/toggle',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Get schedules by air conditioner ID
     * @param acId
     * @returns ScheduleDto OK
     * @throws ApiError
     */
    public static getByAirConditionerId(
        acId: number,
    ): CancelablePromise<Array<ScheduleDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/schedules/air-conditioner/{acId}',
            path: {
                'acId': acId,
            },
        });
    }
    /**
     * Create a new schedule for an air conditioner
     * @param acId
     * @param requestBody
     * @returns ScheduleDto OK
     * @throws ApiError
     */
    public static create1(
        acId: number,
        requestBody: ScheduleDto,
    ): CancelablePromise<ScheduleDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/schedules/air-conditioner/{acId}',
            path: {
                'acId': acId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get all schedules
     * @returns ScheduleDto OK
     * @throws ApiError
     */
    public static getAll4(): CancelablePromise<Array<ScheduleDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/schedules',
        });
    }
    /**
     * Get all active schedules
     * @param dayOfWeek
     * @returns ScheduleDto OK
     * @throws ApiError
     */
    public static getActiveSchedules(
        dayOfWeek?: string,
    ): CancelablePromise<Array<ScheduleDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/schedules/active',
            query: {
                'dayOfWeek': dayOfWeek,
            },
        });
    }
}
