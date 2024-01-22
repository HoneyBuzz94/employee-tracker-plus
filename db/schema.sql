DROP DATABASE IF EXISTS manager_db;
CREATE DATABASE manager_db;
USE manager_db;

CREATE TABLE department (
    id INT AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(30)
);

CREATE TABLE job (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(60),
    salary DECIMAL,
    department_id INT,
    FOREIGN KEY (department_id)
    REFERENCES department(id)
    ON DELETE SET NULL
);

CREATE TABLE employee (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    job_id INT,
    manager_id INT,
    is_manager BOOLEAN,
    FOREIGN KEY (job_id)
    REFERENCES job(id)
    ON DELETE SET NULL
);