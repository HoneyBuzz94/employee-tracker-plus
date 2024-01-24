const inquirer = require('inquirer');
const db = require('../config/connection');

function viewEmployees(callback) {
    db.promise().query('SELECT employee.id, employee.first_name, employee.last_name, job.title, department.department_name, job.salary, employee.manager_id FROM employee JOIN job ON employee.job_id = job.id JOIN department ON job.department_id = department.id ORDER BY employee.id').then(([rows]) => {
        console.clear();
        console.table(rows);
        callback();
    }).catch(err => console.error(err));
};

function addEmployee(callback) {
    let roles = [];
    let roleTitles = [];
    let employees = [];
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

    db.promise().query('SELECT * FROM job').then(([jobRows]) => {
        roles = jobRows;
        jobRows.forEach(row => roleTitles.push(row.title));
        return db.promise().query('SELECT * FROM employee');
    }).then(([employeeRows]) => {
        employees = employeeRows;
        employeeRows.forEach(row => employeeNames.push(`${row.first_name} ${row.last_name}`));
        return inquirer.prompt(questions);
    }).then((answers) => {
        const roleID = roles.find(role => role.title == answers.role).id;
        const managerID = employees.find(employee => `${employee.first_name} ${employee.last_name}` == answers.manager).id;

        db.promise().query(`INSERT INTO employee (first_name, last_name, job_id, manager_id) VALUES ("${answers.first_name}", "${answers.last_name}", ${roleID}, ${managerID})`).then((result) => {
            console.clear();
            console.log(`Successfully added new employee.`);
            callback();
        });
    }).catch(err => console.error(err));
};

function updateEmployee(callback) {
    let roles = [];
    let roleTitles = [];
    let employees = [];
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

    db.promise().query('SELECT * FROM job').then(([jobRows]) => {
        roles = jobRows;
        jobRows.forEach(row => roleTitles.push(row.title));
        return db.promise().query('SELECT * FROM employee');
    }).then(([employeeRows]) => {
        employees = employeeRows;
        employeeRows.forEach(row => employeeNames.push(`${row.first_name} ${row.last_name}`));
        return inquirer.prompt(questions)
    }).then((answers) => {
        const roleID = roles.find(role => role.title == answers.role).id;
        const employeeID = employees.find(employee => `${employee.first_name} ${employee.last_name}` == answers.employee).id;

        db.promise().query(`UPDATE employee SET job_id = ${roleID} WHERE employee.id = ${employeeID}`).then((result) => {
            console.clear();
            console.log(`Successfully updated employee.`);
            callback();
        });
    }).catch(err => console.error(err));
};

module.exports = {viewEmployees, addEmployee, updateEmployee};