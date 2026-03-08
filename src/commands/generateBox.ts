import * as vscode from 'vscode';

export async function generateBox() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    if (editor.selections.length === 0) {
        return;
    }

    // Determine the bounding box of all selections 
    // This allows robust handling of multi-cursor rectangular selections produced by Shift+Alt+Drag
    const startLine = Math.min(...editor.selections.map(s => s.start.line));
    const endLine = Math.max(...editor.selections.map(s => s.end.line));
    const startChar = Math.min(...editor.selections.map(s => s.start.character));
    const endChar = Math.max(...editor.selections.map(s => s.end.character));

    if (endChar <= startChar + 1 || endLine <= startLine) {
        vscode.window.showErrorMessage("Selection too small for a box. Select a larger area.");
        return;
    }

    await editor.edit(editBuilder => {
        for (let i = startLine; i <= endLine; i++) {
            // Check if line is long enough, if not, skip formatting or pad it? 
            // In a canvas full of spaces, lengths will be sufficient. Assuming line length covers the selection.
            const line = editor.document.lineAt(i).text;
            if (line.length < endChar) {
                // If it's a short line, we need to pad the line first to make the replace range valid
                const padLength = endChar - line.length;
                editBuilder.insert(new vscode.Position(i, line.length), ' '.repeat(padLength));
            }

            const isBorderLine = (i === startLine || i === endLine);
            if (isBorderLine) {
                const lineStr = '+' + '-'.repeat(endChar - startChar - 2) + '+';
                editBuilder.replace(new vscode.Range(i, startChar, i, endChar), lineStr);
            } else {
                editBuilder.replace(new vscode.Range(i, startChar, i, startChar + 1), '|');
                editBuilder.replace(new vscode.Range(i, endChar - 1, i, endChar), '|');
            }
        }
    });
}
