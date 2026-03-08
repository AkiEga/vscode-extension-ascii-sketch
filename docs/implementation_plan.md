# ASCII Art Editor Extension Implementation Plan

## Goal Description
VS Code拡張機能「ASCII Art Editor (ascii-sketch)」を開発します。
ドキュメント [docs/ARCHITECTURE_and_REQUIREMENTS.md](file:///c:/Users/akieg/workspace/vscode_ext/vscode-extension-ascii-sketch/docs/ARCHITECTURE_and_REQUIREMENTS.md) の要件に基づき、VS Code標準のMonacoエディタを活用し、Webviewを使用せずにアスキーアート（AA）の編集機能を実装します。これによりIME入力との競合を避け、安定した日本語入力・編集体験を提供します。

## Proposed Changes

### プロジェクトの基盤構築 (設定・メタデータ)
VS Code拡張機能として動作させるための必須ファイル群を作成します。

#### [NEW] `package.json`
* 拡張機能のメタデータ、コマンド、キーバインディングを定義。
* 言語 `ascii-art` (拡張子 `.ascii`) をコントリビュート。
* `configurationDefaults` で `[ascii-art]` のフォントを強制的に Monospace に設定。
* コマンド定義: 
  * `ascii-art.createCanvas`
  * `ascii-art.generateBox`
  * `ascii-art.alignBox`

#### [NEW] `tsconfig.json` & `.vscode/launch.json`
* TypeScriptのコンパイル設定と、F5キーによるデバッグ実行用のLaunch設定。

### ソースコード (機能実装)

#### [NEW] `src/extension.ts`
拡張機能のエントリーポイントです。各コマンドの登録と、ライフサイクルの管理を行います。

#### [NEW] `src/utils/textWidth.ts`
* 文字幅計算ユーティリティ。半角=1、全角=2としてEast Asian Widthの計算を行います。正規表現またはライブラリを用いて正確に幅を判定します。
* **高速化**: 各文字の文字コード(Char Code)をチェックし、標準的なASCII文字 (0x00〜0x7Fなど) であれば即座に幅 `1` を返す（早期リターン・fast-path）処理を組み込み、処理を最適化します。

#### [NEW] `src/commands/createCanvas.ts`
**機能A: キャンバスの生成**
* `vscode.workspace.openTextDocument({ language: 'ascii-art' })` で無題のドキュメントを作成。
* 30文字(半角スペース) × 20行のテキストを初期コンテンツとして挿入します。このとき、後からMarkdown等へ転記しやすいように、以下の形式でエディタに自動で書き込みます。
  ```markdown
  \`\`\`
  {80文字分の半角スペースを20行}
  \`\`\`
  ```
* その後、ドキュメントをエディタで前面に表示します。

#### [NEW] `src/commands/generateBox.ts`
**機能B: 矩形選択からの枠線生成**
* 現在の選択範囲 (マルチカーソル/矩形選択によって得られた `editor.selections`) の境界線を計算。
* 罫線文字 (`+`, `-`, `|`) を用いて、選択範囲の輪郭を枠線で上書き・置換する処理を実装。

#### [NEW] `src/commands/alignBox.ts`
**機能C: 枠線の遅延フォーマット（自動修整）**
* `Enter` キー押下時などに発火するアライメント処理。
* カーソル周辺の枠線を検出し、枠線内の各行の文字列幅（`textWidth.ts`を使用）を再計算。
* 最大幅の行に合わせて各行の右側にスペースをパディングし、右側の枠線 `|` の位置を揃えます。

---

## Verification Plan

### 自動テスト (拡張機能テスト)
* VS Codeの拡張機能テストフレームワーク (`@vscode/test-electron` または `vscode-test`) をセットアップし、以下のユニットテスト・結合テストを実行可能にします。
  *(※ユーザー自身がテストコードを実装できるよう、後ほどテスト実装方法の詳細手順を説明します)*
1. **文字幅計算のテスト**: 半角、全角、混在文字列が正しく幅計算されることをアサートする単体テスト。
2. **キャンバス生成作動テスト**: コマンド実行後にテキストドキュメントの行数と文字数が想定通り（20行x80列）であることを確認。

### 手動テスト (Manual Verification)
開発用Extension Development Hostを開き（F5キー）、以下の操作を行います。
1. `ASCII Art: Create Canvas` コマンドを実行する。
   * 無題のドキュメントが開き、言語モードが `.ascii` (ascii-art) になっている。
   * エディタ内に「```md」から始まるマークダウンのコードブロックで囲まれた「30文字の半角スペース×20行」の領域が自動的に作られていることを確認する。
2. ドキュメント上で複数行・複数列を矩形選択し（Shift+Alt+ドラッグ）、`ASCII Art: Generate Box` コマンドを実行して正しい罫線の枠線が描画されるか確認する。
3. 枠線内に全角文字（日本語など）を入力して枠が右にズレた状態をつくり、`ASCII Art: Align Box` (またはEnterフック) を実行して、右端の `|` が縦に揃うように再調整されることを確認する。
4. IMEを使用した日本語入力時に、変換が強制確定されたり途切れたりしないか（標準エディタのまま正常に機能するか）を確認する。
