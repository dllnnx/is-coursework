--liquibase formatted sql

--changeset accontrol:17 context:dev
INSERT INTO "user" (yandex_id, name, email) VALUES
('yan12345', 'Alena Den', 'alenaden@gmail.com'),
('yan67890', 'Ekaterina Pim', 'pim@gmail.com'),
('yan54321', 'Ger Gerich', 'geik@gmail.com');

--changeset accontrol:18 context:dev
INSERT INTO role (name) VALUES
('admin'),
('manager'),
('user');

--changeset accontrol:19 context:dev
INSERT INTO building (name, address) VALUES
('Kronva', '49, Kronverksky Pr., St. Petersburg, Russia'),
('Lomo', '9, Lomonosova St., St. Petersburg, Russia'),
('BC Pollustrovo', '44b2, Sverdlovskaya St., St. Petersburg, Russia');

--changeset accontrol:20 context:dev
INSERT INTO room (building_id, name) VALUES
(1, 'Orange Classroom'),
(1, 'Lemon Classroom'),
(1, 'Aud. 1414'),
(2, 'Coworking Space'),
(2, 'Library'),
(3, 'Peregovorka');

--changeset accontrol:21 context:dev
INSERT INTO air_conditioner (room_id, name, model, status, mode, target_temperature) VALUES
(1, 'AC-001', 'Model-X', 'active', 'cooling', 22.5),
(2, 'AC-002', 'Model-Y', 'inactive', 'off', 20.0),
(3, 'AC-003', 'Model-Z', 'active', 'heating', 24.0),
(4, 'AC-004', 'Model-X', 'maintenance', 'off', 21.0);

--changeset accontrol:22 context:dev
INSERT INTO temperature_sensor (room_id, name, model, current_temperature) VALUES
(1, 'TS-001', 'Sensor-A', 23.5),
(2, 'TS-002', 'Sensor-B', 21.0),
(3, 'TS-003', 'Sensor-A', 25.0),
(4, 'TS-004', 'Sensor-C', 19.5);

--changeset accontrol:23 context:dev
INSERT INTO ac_group (name) VALUES
('Floor 1 ACs'),
('Floor 2 ACs'),
('Meeting Room ACs');

--changeset accontrol:24 context:dev
INSERT INTO ac_group_membership (air_conditioner_id, group_id) VALUES
(1, 1),
(2, 1),
(3, 2),
(4, 3);

--changeset accontrol:25 context:dev
INSERT INTO schedule (air_conditioner_id, name, day_of_week, start_time, end_time, mode, target_temperature, periodicity, is_active) VALUES
(1, 'Morning Cooling', 'Monday', '09:00:00', '17:00:00', 'cooling', 22.0, 'weekly', true),
(1, 'Evening Heating', 'Monday', '18:00:00', '22:00:00', 'heating', 24.0, 'weekly', false),
(3, 'Night Shift', NULL, '22:00:00', '06:00:00', 'cooling', 23.0, 'daily', true);

--changeset accontrol:26 context:dev
INSERT INTO user_role (user_id, role_id, building_id) VALUES
(1, 1, 1),
(2, 2, 1),
(2, 2, 2),
(3, 3, 1),
(3, 3, 3);

--changeset accontrol:27 context:dev
INSERT INTO registration_request (user_id, status) VALUES
(3, 'pending');
