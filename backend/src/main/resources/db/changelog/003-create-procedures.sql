--liquibase formatted sql

--changeset accontrol:15 splitStatements:false
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

--changeset accontrol:16 splitStatements:false
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
