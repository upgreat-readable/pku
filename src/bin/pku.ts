#!/usr/bin/env node
import CriteriaCommand from '../commands/CriteriaCommand';
import StartCommand from '../commands/StartCommand';
import { program } from 'commander';
import StopCommand from '../commands/StopCommand';
import SendFileCommand from '../commands/SendFileCommand';
import PSRCommand from '../commands/PSRCommand';
import DemoMoveFileCommand from '../commands/DemoMoveFileCommand';
import GetNextFileCommand from '../commands/GetNextFileCommand';
import GetFileListCommand from '../commands/GetFileListCommand';
import ReconnectCommand from '../commands/ReconnectCommand';

program.name('./pku').storeOptionsAsProperties(false).passCommandToAction(false);

const commandList = [];
commandList.push(new CriteriaCommand());
commandList.push(new StartCommand());
commandList.push(new StopCommand());
commandList.push(new ReconnectCommand());
commandList.push(new SendFileCommand());
commandList.push(new PSRCommand());
commandList.push(new DemoMoveFileCommand());
commandList.push(new GetNextFileCommand());
commandList.push(new GetFileListCommand());

// биндим
commandList.forEach(command => {
    // @ts-ignore
    command.bind(program);
});

/*******************************************/
// allow commander to parse `process.argv`
program.parse(process.argv);

export default program;
