import * as vscode from 'vscode';

export async function createCanvas() {
    const doc = await vscode.workspace.openTextDocument({ language: 'ascii-art' });
    const editor = await vscode.window.showTextDocument(doc);

    const spacesLine = ' '.repeat(80);
    const lines = [];
    lines.push('```');
    for (let i = 0; i < 20; i++) {
        lines.push(spacesLine);
    }
    lines.push('```');
    const content = lines.join('\n');

    await editor.edit(editBuilder => {
        editBuilder.insert(new vscode.Position(0, 0), content);
    });
}
