--liquibase formatted sql

--changeset accontrol:12
CREATE INDEX IF NOT EXISTS idx_user_yandex_id ON "user" (yandex_id);

--changeset accontrol:13
CREATE INDEX IF NOT EXISTS idx_schedule_air_conditioner_id ON schedule (air_conditioner_id);

--changeset accontrol:14
CREATE INDEX IF NOT EXISTS idx_schedule_day_active ON schedule (day_of_week, is_active);
