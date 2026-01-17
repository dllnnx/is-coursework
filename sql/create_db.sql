CREATE TABLE IF NOT EXISTS "user" (
    id SERIAL PRIMARY KEY,
    yandex_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS role (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS building (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT
);

CREATE TABLE IF NOT EXISTS room (
    id SERIAL PRIMARY KEY,
    building_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    FOREIGN KEY (building_id) REFERENCES building(id)
);

CREATE TABLE IF NOT EXISTS air_conditioner (
    id SERIAL PRIMARY KEY,
    room_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    model VARCHAR(255),
    status VARCHAR(50) NOT NULL,
    mode VARCHAR(50),
    target_temperature FLOAT,
    FOREIGN KEY (room_id) REFERENCES room(id)
);

CREATE TABLE IF NOT EXISTS temperature_sensor (
    id SERIAL PRIMARY KEY,
    room_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    model VARCHAR(255),
    current_temperature FLOAT NOT NULL,
    FOREIGN KEY (room_id) REFERENCES room(id)
);

CREATE TABLE IF NOT EXISTS schedule (
    id SERIAL PRIMARY KEY,
    air_conditioner_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    day_of_week VARCHAR(20),
    specific_date DATE,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    mode VARCHAR(50) NOT NULL,
    target_temperature FLOAT NOT NULL,
    periodicity VARCHAR(50),
    is_active BOOLEAN NOT NULL,
    FOREIGN KEY (air_conditioner_id) REFERENCES air_conditioner(id)
);

CREATE TABLE IF NOT EXISTS ac_group (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS registration_request (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES "user"(id)
);

CREATE TABLE IF NOT EXISTS user_role (
    user_id INTEGER NOT NULL,
    role_id INTEGER NOT NULL,
    building_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, role_id, building_id),
    FOREIGN KEY (user_id) REFERENCES "user"(id),
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (building_id) REFERENCES building(id)
);

CREATE TABLE IF NOT EXISTS ac_group_membership (
    air_conditioner_id INTEGER NOT NULL,
    group_id INTEGER NOT NULL,
    PRIMARY KEY (air_conditioner_id, group_id),
    FOREIGN KEY (air_conditioner_id) REFERENCES air_conditioner(id),
    FOREIGN KEY (group_id) REFERENCES ac_group(id)
);

CREATE INDEX IF NOT EXISTS idx_user_yandex_id ON "user" (yandex_id);
CREATE INDEX IF NOT EXISTS idx_schedule_air_conditioner_id ON schedule (air_conditioner_id);
CREATE INDEX IF NOT EXISTS idx_schedule_day_active ON schedule (day_of_week, is_active);

-- изменение режима работы для всех кондиционеров в группе
CREATE OR REPLACE PROCEDURE set_group_ac_mode(
    group_id_param INTEGER,
    new_mode VARCHAR(50),
    new_target_temp FLOAT
)
AS $$
BEGIN
    UPDATE air_conditioner
    SET mode = new_mode,
        target_temperature = new_target_temp,
        status = CASE 
            WHEN new_mode = 'off' THEN 'inactive'
            ELSE 'active'
        END
    WHERE id IN (
        SELECT air_conditioner_id 
        FROM ac_group_membership 
        WHERE group_id = group_id_param
    );
END;
$$ LANGUAGE plpgsql;

-- регистрация нового пользователя с назначением роли в здании
CREATE OR REPLACE PROCEDURE register_user_with_role(
    yandex_id_param VARCHAR(255),
    name_param VARCHAR(255),
    email_param VARCHAR(255),
    role_id_param INTEGER,
    building_id_param INTEGER
)
AS $$
DECLARE
    new_user_id INTEGER;
BEGIN
    INSERT INTO "user" (yandex_id, name, email)
    VALUES (yandex_id_param, name_param, email_param)
    RETURNING id INTO new_user_id;
    
    INSERT INTO user_role (user_id, role_id, building_id)
    VALUES (new_user_id, role_id_param, building_id_param);
    
    INSERT INTO registration_request (user_id, status)
    VALUES (new_user_id, 'approved');
END;
$$ LANGUAGE plpgsql;