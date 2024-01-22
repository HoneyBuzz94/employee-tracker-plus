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
const questions = [
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
        name: 'menu'
    }
];

function startMenu() {
    inquirer.prompt(questions).then(({ menu }) => {
        switch(menu){
            case 'View all employees':
                viewEmployees(startMenu);
                break;
            case 'Add employee':
                addEmployee();
                break;
            case 'Update employee role':
                updateEmployee();
                break;
            case 'View all roles':
                viewRoles();
                break;
            case 'Add role':
                addRole();
                break;
            case 'View all departments':
                viewDepartments();
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
}

startMenu();