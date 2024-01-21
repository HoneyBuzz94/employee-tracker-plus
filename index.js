// Import packages
const inquirer = require('inquirer');
const mysql = require('mysql2');

// General variables

inquirer.prompt(
    [
        {
            type: 'list',
            message: 'What would you like to do?',
            choices: ['View all employees','Add employee','Update employee role','View all roles','Add role','View all departments','Add department','Quit'],
            name: 'mainMenu'
        }
    ]
).then((responses) => console.log(responses));