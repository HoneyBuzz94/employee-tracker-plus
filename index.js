// Import packages
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
    },
    console.log(`Connected to ${process.env.DB_NAME}.`)
);

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

// Run the main menu
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
    // Display employees in the database
    db.query('SELECT * FROM employee', (err, result) => {
        if(err){
            console.error(err);
            return;
        }
        console.clear();
        console.table(result);
        callback();
    });
};

function addEmployee(callback) {
    // Create a list of choices
    let roles = [];
    let roleTitles = [];
    let employees = [];
    let employeeNames = [];
    db.query('SELECT * FROM job', (err, result) => {
        if(err){
            console.error(err);
            return;
        }
        roles = result;
        roles.forEach(role => roleTitles.push(role.title));
    });

    db.query('SELECT * FROM employee', (err, result) => {
        if(err){
            console.error(err);
            return;
        }
        employees = result;
        employees.forEach(employee => employeeNames.push(`${employee.first_name} ${employee.last_name}`));
    });

    // Create a list of questions
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

    // Create new instance of inquirer
    inquirer.prompt(questions).then((answers) => {
        // Find the IDs of selected role and manager
        const roleID = roles.find(role => role.title == answers.role).id;
        const managerID = employees.find(employee => `${employee.first_name} ${employee.last_name}` == answers.manager).id;

        // Insert data into table
        db.query(`INSERT INTO employee (first_name, last_name, job_id, manager_id) VALUES ("${answers.first_name}", "${answers.last_name}", ${roleID}, ${managerID})`, (err, result) => {
            if(err){
                console.error(err);
                console.log('The program is closing due to an error. Please try again.')
                return db.end();
            }
            console.clear();
            console.log(`${answers.first_name} ${answers.last_name} successfully added as a new employee.`);
            callback();
        });
    });
};

function viewRoles(callback) {
    db.query('SELECT * FROM job', (err, result) => {
        if(err){
            console.error(err);
            console.log('The program is closing due to an error. Please try again.')
            return db.end();
        }
        console.clear();
        console.table(result);
        callback();
    });
};

function addRole(callback) {
    // Create a list of choices
    let departments = [];
    let departmentNames = [];
    db.query('SELECT * FROM department', (err, result) => {
        if(err){
            console.error(err);
            return;
        }
        departments = result;
        departments.forEach(department => departmentNames.push(department.department_name));
    });

    // Create a list of questions
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

    // Create new instance of inquirer
    inquirer.prompt(questions).then((answers) => {
        // Find the IDs of selected role and manager
        const departmentID = departments.find(department => department.department_name == answers.department).id;

        // Insert data into table
        db.query(`INSERT INTO job (title, salary, department_id) VALUES ("${answers.title}", ${answers.salary}, ${departmentID})`, (err, result) => {
            if(err){
                console.error(err);
                console.log('The program is closing due to an error. Please try again.')
                return db.end();
            }
            console.clear();
            console.log(`${answers.title} successfully added as a new role.`);
            callback();
        });
    });
};

function viewDepartments(callback) {
    db.query('SELECT * FROM department', (err, result) => {
        if(err){
            console.error(err);
            console.log('The program is closing due to an error. Please try again.')
            db.end();
        }
        console.clear();
        console.table(result);
        callback();
    });
};

startMenu();