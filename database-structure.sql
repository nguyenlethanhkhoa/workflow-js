create database workflow collate 'utf8_general_ci';

CREATE TABLE workflow.workflow (
	id INT NULL AUTO_INCREMENT,
	name varchar(255) NOT NULL,
	content TEXT NULL,
	CONSTRAINT workflow_pk PRIMARY KEY (id),
	CONSTRAINT workflow_un UNIQUE KEY (name)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8
COLLATE=utf8_general_ci;