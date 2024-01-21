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
                console.log(menu);
                startMenu();
                break;
            case 'Add employee':
                console.clear();
                console.log(menu);
                startMenu();
                break;
            case 'Update employee role':
                console.clear();
                console.log(menu);
                startMenu();
                break;
            case 'View all roles':
                console.clear();
                console.log(menu);
                startMenu();
                break;
            case 'Add role':
                console.clear();
                console.log(menu);
                startMenu();
                break;
            case 'View all departments':
                console.clear();
                console.log(menu);
                startMenu();
                break;
            case 'Add department':
                console.clear();
                console.log(menu);
                startMenu();
                break;
            case 'Quit':
                console.clear();
                console.log('Thank you for using Employee Tracker Plus!')
                break;
        };
    });
};

startMenu();