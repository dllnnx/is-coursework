/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AssignRoleRequest } from '../models/AssignRoleRequest';
import type { CreateUserRequest } from '../models/CreateUserRequest';
import type { UserDto } from '../models/UserDto';
import type { UserRoleDto } from '../models/UserRoleDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UsersService {
    /**
     * Get roles of a user
     * @param id
     * @returns UserRoleDto OK
     * @throws ApiError
     */
    public static getUserRoles(
        id: number,
    ): CancelablePromise<Array<UserRoleDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/users/{id}/roles',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Assign a role to a user
     * @param id
     * @param requestBody
     * @returns UserRoleDto OK
     * @throws ApiError
     */
    public static assignRole(
        id: number,
        requestBody: AssignRoleRequest,
    ): CancelablePromise<UserRoleDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/users/{id}/roles',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Reject a user registration
     * @param id
     * @returns UserDto OK
     * @throws ApiError
     */
    public static rejectRegistration(
        id: number,
    ): CancelablePromise<UserDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/users/{id}/reject',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Approve a user registration
     * @param id
     * @returns UserDto OK
     * @throws ApiError
     */
    public static approveRegistration(
        id: number,
    ): CancelablePromise<UserDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/users/{id}/approve',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Register a new user with pending status
     * Creates a new user using Yandex OAuth token. The user info (id, name, email) is fetched from Yandex API. A registration request with 'pending' status is created. The user will need to be approved by an administrator before getting access.
     * @param requestBody
     * @returns UserDto OK
     * @throws ApiError
     */
    public static registerUser(
        requestBody: CreateUserRequest,
    ): CancelablePromise<UserDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/users/register',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get all users
     * @returns UserDto OK
     * @throws ApiError
     */
    public static getAll2(): CancelablePromise<Array<UserDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/users',
        });
    }
    /**
     * Get user by ID
     * @param id
     * @returns UserDto OK
     * @throws ApiError
     */
    public static getById6(
        id: number,
    ): CancelablePromise<UserDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/users/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Delete a user
     * @param id
     * @returns any OK
     * @throws ApiError
     */
    public static delete6(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/users/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Get pending registration requests
     * @returns UserDto OK
     * @throws ApiError
     */
    public static getPendingRequests(): CancelablePromise<Array<UserDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/users/pending',
        });
    }
    /**
     * Remove a role from a user
     * @param userId
     * @param roleId
     * @param buildingId
     * @returns any OK
     * @throws ApiError
     */
    public static removeRole(
        userId: number,
        roleId: number,
        buildingId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/users/{userId}/roles/{roleId}/buildings/{buildingId}',
            path: {
                'userId': userId,
                'roleId': roleId,
                'buildingId': buildingId,
            },
        });
    }
}
