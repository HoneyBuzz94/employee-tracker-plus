// Import packages
const inquirer = require('inquirer');
const mysql = require('mysql2');

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
        console.log(menu);
        switch(menu){
            case 'View all employees':
                console.clear();
                console.log('Here is a list of all employees');
                startMenu();
                break;
            case 'Quit':
                console.clear();
                console.log('Thank you for using Employee Tracker Plus!')
        };
    });
};

startMenu();