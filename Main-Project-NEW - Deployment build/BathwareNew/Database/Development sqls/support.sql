USE bathware_system;

DROP TABLE IF EXISTS support;

CREATE TABLE support (
                         ticket_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                         user_id BIGINT NOT NULL,
                         support_type VARCHAR(50) NOT NULL,
                         description VARCHAR(255),
                         remark VARCHAR(500),
                         status VARCHAR(100)
);

SELECT * FROM support;
