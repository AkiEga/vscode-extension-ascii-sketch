import * as vscode from 'vscode';
import { getTextWidth } from '../utils/textWidth';

export async function alignBox() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const doc = editor.document;
    const cursorLine = editor.selection.active.line;

    // Detect the bounding box: scan up for existing top edge
    let topBorderLine = -1;
    let topBorderMatch: RegExpMatchArray | null = null;
    for (let i = cursorLine; i >= 0; i--) {
        const text = doc.lineAt(i).text;
        const match = text.match(/^(\s*)\+(.*?)\+\s*$/);
        if (match && match[2].length > 0 && match[2].split('').every(c => c === '-')) {
            topBorderLine = i;
            topBorderMatch = match;
            break;
        }
        if (!text.includes('|') && i !== cursorLine) {
            break; // Likely out of bounds
        }
    }

    // Scan down for existing bottom edge
    let bottomBorderLine = -1;
    for (let i = cursorLine; i < doc.lineCount; i++) {
        const text = doc.lineAt(i).text;
        const match = text.match(/^(\s*)\+(.*?)\+\s*$/);
        if (match && match[2].length > 0 && match[2].split('').every(c => c === '-')) {
            bottomBorderLine = i;
            break;
        }
        if (!text.includes('|') && i !== cursorLine) {
            break; // Likely out of bounds
        }
    }

    if (topBorderLine === -1 || bottomBorderLine === -1 || topBorderLine >= bottomBorderLine) {
        // Did not find a valid box boundary
        return;
    }

    const indent = topBorderMatch![1];
    const topInsideStr = topBorderMatch![2];
    let maxInsideVisualWidth = topInsideStr.length; // baseline visual width from current top border

    const middleContents: string[] = [];

    // Read middle contents and find maximum visual width
    for (let i = topBorderLine + 1; i < bottomBorderLine; i++) {
        const text = doc.lineAt(i).text;
        const firstPipe = text.indexOf('|');
        const lastPipe = text.lastIndexOf('|');

        let content = '';
        if (firstPipe !== -1 && lastPipe !== -1 && firstPipe !== lastPipe) {
            content = text.substring(firstPipe + 1, lastPipe);
        } else if (firstPipe !== -1) {
            content = text.substring(firstPipe + 1);
        } else {
            content = text.trim();
        }

        const trimmedContent = content.replace(/\s+$/, '');
        const visualWidth = getTextWidth(trimmedContent);
        if (visualWidth > maxInsideVisualWidth) {
            maxInsideVisualWidth = visualWidth;
        }
        middleContents.push(trimmedContent);
    }

    // Perform formatting and block reconstruction
    await editor.edit(editBuilder => {
        // Replace top border
        const newTop = indent + '+' + '-'.repeat(maxInsideVisualWidth) + '+';
        editBuilder.replace(doc.lineAt(topBorderLine).range, newTop);

        // Replace bottom border
        const newBottom = indent + '+' + '-'.repeat(maxInsideVisualWidth) + '+';
        editBuilder.replace(doc.lineAt(bottomBorderLine).range, newBottom);

        // Rebuild middle lines padding
        for (let i = topBorderLine + 1; i < bottomBorderLine; i++) {
            const content = middleContents[i - (topBorderLine + 1)];
            const visualWidth = getTextWidth(content);
            const paddingSize = maxInsideVisualWidth - visualWidth;
            const padding = ' '.repeat(Math.max(0, paddingSize));
            const newLine = indent + '|' + content + padding + '|';
            editBuilder.replace(doc.lineAt(i).range, newLine);
        }
    });
}
