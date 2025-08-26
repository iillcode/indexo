# Monaco Theme Tuning Guide

This project loads a custom Monaco theme from `public/monaco-theme.json` in `CodeSection.tsx`. You can change syntax colors by editing the token rules inside that JSON file.

- Theme file: `public/monaco-theme.json`
- Where it’s used: `app/components/CodeSection.tsx` (loaded in `onMount`, then applied via `monaco.editor.setTheme("my-vscode-theme")`)

## How token coloring works
Monaco maps lexer tokens (e.g., `keyword`, `variable`, `string`) to colors via the `rules` array:

```json
{
  "rules": [
    { "token": "keyword", "foreground": "#569CD6" },
    { "token": "variable", "foreground": "#9CDCFE" }
  ]
}
```

Edit the `foreground` hex value to change color. Hex should be 6-digit RGB (no alpha).

## Common things to edit
Below are the most useful token scopes already present in `public/monaco-theme.json` and what they affect.

- **Variables (user-defined, constants, enum members)**
  - `variable`
  - `meta.definition.variable.name`
  - `support.variable`
  - `entity.name.variable`
  - `variable.other.constant`
  - `variable.other.enummember`

- **Language variables (e.g., `this`, `super`, `arguments`)**
  - `variable.language`

- **Functions**
  - `entity.name.function` (function definitions/names)
  - `support.function` (built-in functions, library functions)

- **Keywords**
  - `keyword` (general keywords in most languages)
  - `keyword.control` (flow and other control keywords)
  - `keyword.operator.*` (operator keywords like `new`, `instanceof`, etc.)
  - Specific: `keyword.control.import`, `keyword.control.export`

- **HTML/JSX/TSX**
  - Tags: `entity.name.tag`
  - Attribute names: `entity.other.attribute-name`

- **Strings / Numbers / Comments**
  - `string`
  - `constant.numeric`
  - `comment`

- **Types / Classes / Namespaces**
  - `support.class`, `support.type`
  - `entity.name.type`, `entity.name.class`, `entity.name.namespace`

- **Object literal keys (JS/TS)**
  - `meta.object-literal.key`

## What we set to violet (#C586C0) for you
- Only specific JS/TS keywords: `keyword.control.import`, `keyword.control.export`, `keyword.control.default`

All other keywords and variables remain at their default colors.

## UI/editor colors (non-tokens)
In the `colors` object you can tune editor UI elements, e.g.:
- `editor.background`, `editor.foreground`
- `editorLineNumber.foreground`, `editorLineNumber.activeForeground`
- `editorGutter.background`

These do not affect syntax tokens.

## Tips if changes don’t show
- Hard refresh the browser (Ctrl+Shift+R) to reload `public/monaco-theme.json`.
- Confirm the theme is applied: in `app/components/CodeSection.tsx`, it fetches `/monaco-theme.json` and calls `monaco.editor.setTheme("my-vscode-theme")`.
- Monaco tokenization is not identical to VS Code’s TextMate grammar. If you need near-perfect VS Code parity (especially for TSX/JSX), consider wiring `monaco-textmate` + `onigasm` with grammars.

Note: With Monaco’s default tokenization for JS/TS, many keywords share the same `keyword` token. Coloring only specific words (like `import`/`export`/`default`) may require TextMate grammars (via `monaco-textmate`) or a custom Monarch grammar that emits distinct tokens for those words.

## Example: make HTML tags blue
Find the rule and change the color:
```json
{ "token": "entity.name.tag", "foreground": "#569CD6" }
```

## Example: make function names yellow
```json
{ "token": "entity.name.function", "foreground": "#DCDCAA" }
```

After edits, reload the page to see the changes.
