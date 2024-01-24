const inquirer = require('inquirer');
const db = require('../config/connection');

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

module.exports = {viewDepartments, addDepartment};