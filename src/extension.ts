import * as vscode from 'vscode';
import { createCanvas } from './commands/createCanvas';
import { generateBox } from './commands/generateBox';
import { alignBox } from './commands/alignBox';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('ascii-art.createCanvas', createCanvas),
        vscode.commands.registerCommand('ascii-art.generateBox', generateBox),
        vscode.commands.registerCommand('ascii-art.alignBox', alignBox)
    );
}

export function deactivate() { }
