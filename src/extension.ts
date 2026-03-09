import * as vscode from 'vscode';
import { createCanvas } from './commands/createCanvas';
import { generateBox } from './commands/generateBox';
import { alignBox } from './commands/alignBox';

const toggledEditors = new WeakSet<vscode.TextEditor>();

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('ascii-art.createCanvas', createCanvas),
        vscode.commands.registerCommand('ascii-art.generateBox', generateBox),
        vscode.commands.registerCommand('ascii-art.alignBox', alignBox)
    );

    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(editor => {
            if (editor && editor.document.languageId === 'ascii-art') {
                if (!toggledEditors.has(editor)) {
                    vscode.commands.executeCommand('editor.action.toggleOvertypeInsertMode');
                    toggledEditors.add(editor);
                }
            }
        })
    );
}

export function deactivate() { }
