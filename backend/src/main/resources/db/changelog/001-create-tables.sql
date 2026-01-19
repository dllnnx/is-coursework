--liquibase formatted sql

--changeset accontrol:1
CREATE TABLE IF NOT EXISTS "user" (
    id SERIAL PRIMARY KEY,
    yandex_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL
);

--changeset accontrol:2
CREATE TABLE IF NOT EXISTS role (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

--changeset accontrol:3
CREATE TABLE IF NOT EXISTS building (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT
);

--changeset accontrol:4
CREATE TABLE IF NOT EXISTS room (
    id SERIAL PRIMARY KEY,
    building_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    FOREIGN KEY (building_id) REFERENCES building(id)
);

--changeset accontrol:5
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

--changeset accontrol:6
CREATE TABLE IF NOT EXISTS temperature_sensor (
    id SERIAL PRIMARY KEY,
    room_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    model VARCHAR(255),
    current_temperature FLOAT NOT NULL,
    FOREIGN KEY (room_id) REFERENCES room(id)
);

--changeset accontrol:7
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

--changeset accontrol:8
CREATE TABLE IF NOT EXISTS ac_group (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

--changeset accontrol:9
CREATE TABLE IF NOT EXISTS registration_request (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES "user"(id)
);

--changeset accontrol:10
CREATE TABLE IF NOT EXISTS user_role (
    user_id INTEGER NOT NULL,
    role_id INTEGER NOT NULL,
    building_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, role_id, building_id),
    FOREIGN KEY (user_id) REFERENCES "user"(id),
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (building_id) REFERENCES building(id)
);

--changeset accontrol:11
CREATE TABLE IF NOT EXISTS ac_group_membership (
    air_conditioner_id INTEGER NOT NULL,
    group_id INTEGER NOT NULL,
    PRIMARY KEY (air_conditioner_id, group_id),
    FOREIGN KEY (air_conditioner_id) REFERENCES air_conditioner(id),
    FOREIGN KEY (group_id) REFERENCES ac_group(id)
);
