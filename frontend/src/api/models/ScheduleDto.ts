/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LocalTime } from './LocalTime';
export type ScheduleDto = {
    id?: number;
    airConditionerId?: number;
    airConditionerName?: string;
    name?: string;
    dayOfWeek?: string;
    specificDate?: string;
    startTime?: LocalTime;
    endTime?: LocalTime;
    mode?: string;
    targetTemperature?: number;
    periodicity?: string;
    isActive?: boolean;
};

