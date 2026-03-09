# ASCII Art Editor (vscode-extension-ascii-sketch)

An extension to easily create and edit ASCII art within Visual Studio Code.

## Features

This extension provides tools to help you work with `.ascii` files natively within the VS Code editor, taking advantage of its powerful features while providing specialized ASCII art capabilities.

* **Dedicated Language Support**: Provides automatic configuration for `.ascii` files, ensuring a monospace font and customized cursor behavior (block cursor in Overtype mode) for optimal ASCII drawing.
* **Canvas Generation (`ASCII Art: Create Canvas`)**: Instantly creates a new untitled `ascii-art` file pre-filled with an 80x20 grid of spaces, providing a blank canvas ready for your art.
* **Smart Box Generation (`ASCII Art: Generate Box`)**: Select a rectangular area (using `Shift+Alt+Drag` or multiple cursors) and run this command to instantly draw a box using ASCII characters (`+`, `-`, `|`) around your selection.
* **Box Alignment (`ASCII Art: Align Box`)**: If you type full-width characters (like Japanese or emoji) inside a box, the vertical borders might visually misalign due to varying character widths. Run this command to calculate East Asian Widths and perfectly realign the right side of the box.

## Requirements

No special requirements. The extension relies solely on the built-in VS Code editor.

## Extension Settings

This extension automatically contributes the following default settings when editing `.ascii` files:
```json
"[ascii-art]": {
    "editor.cursorStyle": "line",
    "editor.overtypeCursorStyle": "block"
}
```

## Known Issues

* **Overtype Mode Limitations**: While the extension supports standard overtype mode (`Insert` key), it currently cannot *force* the editor into overtype mode upon file opening due to VS Code API limitations. It is recommended to press `Insert` to switch to overtype mode when drawing. The cursor will change to a block (`█`) when active.
* IME (Input Method Editor) interactions are handled gracefully by delegating text input entirely to VS Code, but this means real-time box realignment during typing is not supported. Use the `Align Box` command after typing.

## Release Notes

### 0.0.1
Initial release with foundational features:
* Canvas creation
* Box outline generation from multi-cursor selection
* Box alignment function based on East Asian character width
