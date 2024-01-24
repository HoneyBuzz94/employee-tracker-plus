const inquirer = require('inquirer');
const db = require('../config/connection');

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

    db.promise().query('SELECT * FROM department')
    .then(([rows]) => {
        rows.forEach(row => {
            departmentNames.push(row.department_name);
        });
        inquirer.prompt(questions).then((answers) => {
            const departmentID = rows.find(department => department.department_name == answers.department).id;

            db.promise().query(`INSERT INTO job (title, salary, department_id) VALUES ("${answers.title}", ${answers.salary}, ${departmentID})`).then(([rows]) => {
                console.clear();
                console.log(`Successfully added new role.`);
                callback();
            });
        });
    }).catch(err => console.error(err));
};

module.exports = {viewRoles, addRole};