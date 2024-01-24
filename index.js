// Imports
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
require('dotenv').config();

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    }
);
db.connect(function (err) {if(err) throw err;});

// General variables
const menuOptions = [
    {
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            'View all employees',
            'Add employee',
            'Update employee role',
            'View all roles',
            'Add role',
            'View all departments',
            'Add department',
            'Quit'
        ],
        name: 'options'
    }
];

function startMenu() {
    inquirer.prompt(menuOptions).then(({ options }) => {
        switch(options){
            case 'View all employees':
                viewEmployees(startMenu);
                break;
            case 'Add employee':
                addEmployee(startMenu);
                break;
            case 'Update employee role':
                updateEmployee(startMenu);
                break;
            case 'View all roles':
                viewRoles(startMenu);
                break;
            case 'Add role':
                addRole(startMenu);
                break;
            case 'View all departments':
                viewDepartments(startMenu);
                break;
            case 'Add department':
                addDepartment(startMenu);
                break;
            case 'Quit':
                console.clear();
                console.log('Thank you for using Employee Tracker Plus!');
                db.end();
        };
    });
};

function viewEmployees(callback) {
    db.promise().query('SELECT employee.id, employee.first_name, employee.last_name, job.title, department.department_name, job.salary, employee.manager_id FROM employee JOIN job ON employee.job_id = job.id JOIN department ON job.department_id = department.id ORDER BY employee.id').then(([rows]) => {
        console.clear();
        console.table(rows);
        callback();
    }).catch(err => console.error(err));
};

function addEmployee(callback) {
    let roleTitles = [];
    let employeeNames = [];
    const questions = [
        {
            type: 'input',
            message: 'First name:',
            name: 'first_name'
        },
        {
            type: 'input',
            message: 'Last name:',
            name: 'last_name'
        },
        {
            type: 'list',
            message: 'Role:',
            choices: roleTitles,
            name: 'role'
        },
        {
            type: 'list',
            message: 'Manager:',
            choices: employeeNames,
            name: 'manager'
        }
    ];

    db.promise().query('SELECT * FROM employee JOIN job ON employee.job_id = job.id')
    .then(([rows]) => {
        rows.forEach(row => {
            employeeNames.push(`${row.first_name} ${row.last_name}`);
            roleTitles.push(row.title);
        });
        inquirer.prompt(questions).then((answers) => {
            const roleID = rows.find(role => role.title == answers.role).id;
            const managerID = rows.find(employee => `${employee.first_name} ${employee.last_name}` == answers.manager).id;

            db.promise().query(`INSERT INTO employee (first_name, last_name, job_id, manager_id) VALUES ("${answers.first_name}", "${answers.last_name}", ${roleID}, ${managerID})`).then(([rows]) => {
                console.clear();
                console.log(`Successfully added new employee.`);
                callback();
            });
        });
    }).catch(err => console.error(err));
};

function updateEmployee(callback) {
    let roleTitles = [];
    let employeeNames = [];
    const questions = [
        {
            type: 'list',
            message: 'Employee:',
            choices: employeeNames,
            name: 'employee'
        },
        {
            type: 'list',
            message: 'New role:',
            choices: roleTitles,
            name: 'role'
        },
    ];

    db.promise().query('SELECT * FROM employee JOIN job ON employee.job_id = job.id')
    .then(([rows]) => {
        rows.forEach(row => {
            employeeNames.push(`${row.first_name} ${row.last_name}`);
            roleTitles.push(row.title);
        });
        inquirer.prompt(questions).then((answers) => {
            const roleID = rows.find(role => role.title == answers.role).id;
            const employeeID = rows.find(employee => `${employee.first_name} ${employee.last_name}` == answers.employee).id;

            db.promise().query(`UPDATE employee SET job_id = ${roleID} WHERE employee.id = ${employeeID}`).then(([rows]) => {
                console.clear();
                console.log(`Successfully updated employee.`);
                callback();
            });
        });
    }).catch(err => console.error(err));
};

function viewRoles(callback) {
    db.promise().query('SELECT job.id, job.title, job.salary, department.department_name FROM job JOIN department ON job.department_id = department.id ORDER BY job.id').then(([rows]) => {
        console.clear();
        console.table(rows);
        callback();
    }).catch(err => console.error(err));
};

function addRole(callback) {
    let departmentNames = [];
    const questions = [
        {
            type: 'input',
            message: 'Job title:',
            name: 'title'
        },
        {
            type: 'input',
            message: 'Salary:',
            name: 'salary'
        },
        {
            type: 'list',
            message: 'Department:',
            choices: departmentNames,
            name: 'department'
        },
    ];

    db.promise().query('SELECT * FROM job JOIN department ON job.department_id = department.id')
    .then(([rows]) => {
        rows.forEach(row => {
            departmentNames.push(row.department_name);
        });
        inquirer.prompt(questions).then((answers) => {
            const departmentID = rows.find(role => role.title == answers.role).id;

            db.promise().query(`INSERT INTO job (title, salary, department_id) VALUES ("${answers.title}", ${answers.salary}, ${departmentID})`).then(([rows]) => {
                console.clear();
                console.log(`Successfully added new role.`);
                callback();
            });
        });
    }).catch(err => console.error(err));
};

function viewDepartments(callback) {
    db.promise().query('SELECT * FROM department ORDER BY department.id').then(([rows]) => {
        console.clear();
        console.table(rows);
        callback();
    }).catch(err => console.error(err));
};

function addDepartment(callback) {
    const questions = [
        {
            type: 'input',
            message: 'Department name:',
            name: 'department_name'
        },
    ];

    inquirer.prompt(questions).then((answers) => {
        db.promise().query(`INSERT INTO department (department_name) VALUES ("${answers.department_name}")`).then(([rows]) => {
            console.clear();
            console.log(`Successfully added new department.`);
            callback();
        });
    }).catch(err => console.error(err));
};

startMenu();