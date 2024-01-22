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
                updateEmployee();
                break;
            case 'View all roles':
                viewRoles(startMenu);
                break;
            case 'Add role':
                addRole();
                break;
            case 'View all departments':
                viewDepartments(startMenu);
                break;
            case 'Add department':
                addDepartment();
                break;
            case 'Quit':
                console.clear();
                console.log('Thank you for using Employee Tracker Plus!');
                db.end();
        };
    });
};

function viewEmployees(callback) {
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
    let managers = [];
    db.query('SELECT * FROM job', (err, result) => {
        if(err){
            console.error(err);
            return;
        }
        result.forEach(role => {
            roles.push(role.title);
        });
    });
    db.query('SELECT * FROM employee', (err, result) => {
        if(err){
            console.error(err);
            return;
        }
        result.forEach(employee => {
            if(employee.is_manager){
                managers.push(`${employee.first_name} ${employee.last_name}`);
            };
        });
    });

    // Create list of questions
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
            choices: roles,
            name: 'role'
        },
        {
            type: 'list',
            message: 'Manager:',
            choices: managers,
            name: 'manager'
        }
    ];

    // Create new instance of inquirer
    inquirer.prompt(questions).then((answers) => {
        console.clear();
        console.log('New employee successfully added');
        callback();
    });
}

function viewRoles(callback) {
    db.query('SELECT * FROM job', (err, result) => {
        if(err){
            console.error(err);
            return;
        }
        console.clear();
        console.table(result);
        callback();
    });
};

function viewDepartments(callback) {
    db.query('SELECT * FROM department', (err, result) => {
        if(err){
            console.error(err);
            return;
        }
        console.clear();
        console.table(result);
        callback();
    });
};

startMenu();