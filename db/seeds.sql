INSERT INTO department (department_name)
VALUES
("Finance"),
("Human Resources"),
("Customer Service");

INSERT INTO job (title, salary, department_id)
VALUES
("Finance Specialist I", 30000, 1),
("Finance Specialist II", 60000, 1),
("Finance Specialist Supervisor", 90000, 1),
("HR Specialist I", 40000, 2),
("HR Specialist II", 70000, 2),
("HR Supervisor", 100000, 2),
("Customer Service Representative", 35000, 3),
("Customer Service Supervisor", 70000, 3);

INSERT INTO employee (first_name, last_name, job_id, manager_id)
VALUES
("Thomas", "Karlson", 1, 4),
("Katherine", "Mendoza", 1, 4),
("Octavius", "Ibarra", 2, 4),
("Jacqueline", "Chen", 3, NULL),
("Guy", "Cuartas", 4, 7),
("Hannah", "Jackson", 5, 7),
("Ulysses", "George", 6, NULL),
("Nicole", "Whiting", 7, 10),
("Neil", "Fielding", 7, 10),
("Mason", "Shefield", 8, NULL);