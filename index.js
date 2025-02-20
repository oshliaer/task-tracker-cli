#! /usr/bin/env node

import { existsSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';

const scope = {
  dbPath: undefined,
  db: undefined,
};

/**
 *
 * @param {string[]} task
 */
function add(...task) {
  const taskItem = {
    id: scope.db.size + 1,
    task: task.join(' '),
    status: 'todo',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  scope.db.set(taskItem.id, taskItem);
  console.log(`Task "${taskItem.id}: ${taskItem.task}" added`);
}

/**
 *
 * @param {string} id
 * @param {string[]} task
 */
function update(id, ...task) {
  const taskItem = scope.db.get(id);
  if (!taskItem) {
    throw new Error(`Task ${id} not found`);
  }
  taskItem.task = task.join(' ');
  taskItem.updatedAt = new Date();
  scope.db.set(id, taskItem);
  console.log(`Task "${taskItem.id}: ${taskItem.task}" updated`);
}

/**
 *
 * @param {string} id
 */
function remove(id) {
  if (!scope.db.has(id)) {
    throw new Error(`Task ${id} not found`);
  }
  const result = scope.db.delete(id);

  if (!result) {
    console.log('Something went wrong');
    return;
  }
  console.log(`Task "${id}" deleted`);
}

/**
 *
 * @param {string} id
 * @param {string} status
 */
function updateStatus(id, status) {
  const taskItem = scope.db.get(id);
  if (!taskItem) {
    throw new Error(`Task ${id} not found`);
  }
  taskItem.status = status;
  taskItem.updatedAt = new Date();
  scope.db.set(id, taskItem);
  console.log(`Task "${taskItem.id}: ${taskItem.task}" updated`);
}

/**
 *
 * @param {string} id
 */
function markInProgress(id) {
  updateStatus(id, 'in-progress');
}

/**
 *
 * @param {string} id
 */
function markDone(id) {
  updateStatus(id, 'done');
}

/**
 *
 * @param {string} status
 */
function list(status) {
  scope.db
    .entries()
    .filter(([, task]) => (status ? task.status === status : true))
    .forEach(([id, task]) => {
      console.log(`[${task.status}] ${id}: ${task.task}`);
    });
}

function help() {
  console.log('Usage: task-cli <command> [arguments]');
  console.log('Commands:');
  console.log('  add <task> - Add a new task');
  console.log('  update <id> <task> - Update a task');
  console.log('  delete <id> - Remove a task');
  console.log('  mark-in-progress <id> - Mark a task in progress');
  console.log('  mark-done <id> - Mark a task done');
  console.log('  list - List all tasks');
}

function info() {
  console.log('Task CLI');
  console.log('Version: 1.0.0');
  initDB();
  console.log(scope.dbPath);
  console.log(scope.db.size);
}

const mdl = {
  add,
  update,
  delete: remove,
  'mark-in-progress': markInProgress,
  'mark-done': markDone,
  list,
  help,
  info,
};

/**
 * @param {string[]} args
 * @returns {TaskCommand}
 */
const parseArgsToTaskCommand = function (args) {
  const [command, ...rest] = args;
  const _command = command.toLowerCase();
  const _arguments = rest;
  const taskCommand = {
    command: _command,
    arguments: _arguments,
  };
  return taskCommand;
};

function initDB() {
  const uri = scope.dbPath;
  if (!existsSync(uri)) {
    writeFileSync(uri, JSON.stringify([]));
  }

  const data = readFileSync(uri, 'utf8');
  scope.db = new Map(Object.entries(JSON.parse(data)));
}

function dump() {
  if (!scope.db) {
    scope.db = initDB();
  }
  const object = Object.fromEntries(scope.db);
  const _dump = JSON.stringify(object, null, 2);
  return _dump;
}

function dumpDB() {
  const _dump = dump();
  writeFileSync(scope.dbPath, _dump);
}

try {
  const [_, appPath, ...args] = process.argv;
  const taskCommand = parseArgsToTaskCommand(args);
  if (Object.keys(mdl).includes(taskCommand.command)) {
    scope.dbPath = path.dirname(appPath) + '/db.json';
    initDB();
    mdl[taskCommand.command].apply(null, taskCommand.arguments);
    dumpDB();
  } else {
    console.info(`Command "${taskCommand.command}" not found`);
    help();
  }
} catch (error) {
  console.error('An error occurred');
  console.error('');
  console.error(error.message);
  console.error('');
  help();
}

/**
 * @typedef {{
 *   add: Function,
 *   update: Function,
 *   remove: Function,
 *   markInProgress: Function,
 *   markDone: Function,
 *   list: Function
 * }} TaskModule
 */

/**
 * @typedef {{
 *  command: string,
 *  arguments: string[]
 * }} TaskCommand
 */

/**
 * @typedef {{
 *  id: number,
 *  task: string,
 *  status: string,
 *  createdAt: Date,
 *  updatedAt: Date
 * }} TaskItem
 */
