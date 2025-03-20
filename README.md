# Task Tracker CLI

Based on the project [roadmap.sh/projects/task-tracker](https://roadmap.sh/projects/task-tracker)

A command-line application for task management. Allows creating, updating, and tracking task status through the command line.

## Features

- Adding new tasks
- Updating existing tasks
- Deleting tasks
- Marking tasks as "in progress" or "done"
- Viewing list of all tasks

## Installation

### Local installation

1. Make sure Node.js is installed
2. Make the file executable:

```bash
$> chmod +x index.js
```

3. Run the application:

```bash
$> ./index.js <command> [arguments]
```

### Global installation

1. Make sure Node.js is installed
2. Clone the repository:

```bash
$> git clone https://github.com/oshliaer/task-tracker-cli.git
```

3. Install the package globally:

```bash
$> cd task-tracker-cli
$> npm install -g
```

4. Run the application:

```bash
$> task-cli <command> [arguments]
```

## Usage

```bash
$> task-cli <command> [arguments]
```

### Command Examples

- Add a task:

```bash
$> task-cli add "Buy groceries"
```

- View task list:

```bash
$> task-cli list
```

- Mark task as "in progress":

```bash
$> task-cli mark-in-progress 1
```

- Mark task as "done":
  
```bash
$> task-cli mark-done 1
```

```bash
❯   task-cli add "Buy groceries"
Task "1: Buy groceries" added

❯  task-cli list
[todo] 1: Buy groceries

❯  task-cli mark-in-progress 1
Task "1: Buy groceries" updated

❯  task-cli mark-done 1
Task "1: Buy groceries" updated

❯   task-cli list
[done] 1: Buy groceries
```
