const inquirer = require('inquirer');
const db = require('./config/connection');
const cTable = require('console.table');
require('dotenv').config();
const {viewDepartments, addDepartment} = require('./lib/department');
const {viewRoles, addRole} = require('./lib/role');
const {viewEmployees, addEmployee, updateEmployee} = require('./lib/employee');

const menuOptions = [{
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
}];

function startMenu() {
    inquirer.prompt(menuOptions).then(({ options }) => {
        console.log(options);
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

startMenu();