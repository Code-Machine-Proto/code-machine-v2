// frontend/src/components/editor/theme.ts
import { EditorView } from "@codemirror/view";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";
import { Compartment } from "@codemirror/state";

export const themeCompartment = new Compartment();

const baseFontConfig = {
  fontSize: "14px",
  fontFamily: "var(--font-mono)",
  height: "100%",
};

export const darkTheme = EditorView.theme({
  "&": { backgroundColor: "#0a0e1a", color: "#e2e8f0", ...baseFontConfig },
  ".cm-content": { caretColor: "#60a5fa", padding: "8px 0" },
  ".cm-cursor": { borderLeftColor: "#60a5fa", borderLeftWidth: "2px" },
  "&.cm-focused .cm-selectionBackground, .cm-selectionBackground": { backgroundColor: "#1e40af33" },
  ".cm-gutters": { backgroundColor: "#0a0e1a", color: "#475569", border: "none", paddingRight: "8px" },
  ".cm-activeLineGutter": { backgroundColor: "#1e293b", color: "#94a3b8" },
  ".cm-activeLine": { backgroundColor: "#1e293b44" },
  ".cm-line": { padding: "0 8px" },
});

export const lightTheme = EditorView.theme({
  "&": { backgroundColor: "#f8fafc", color: "#1e293b", ...baseFontConfig },
  ".cm-content": { caretColor: "#2563eb", padding: "8px 0" },
  ".cm-cursor": { borderLeftColor: "#2563eb", borderLeftWidth: "2px" },
  "&.cm-focused .cm-selectionBackground, .cm-selectionBackground": { backgroundColor: "#3b82f622" },
  ".cm-gutters": { backgroundColor: "#f8fafc", color: "#94a3b8", border: "none", paddingRight: "8px" },
  ".cm-activeLineGutter": { backgroundColor: "#f1f5f9", color: "#64748b" },
  ".cm-activeLine": { backgroundColor: "#e2e8f044" },
  ".cm-line": { padding: "0 8px" },
});

export const darkHighlighting = syntaxHighlighting(
  HighlightStyle.define([
    { tag: tags.keyword, color: "#f472b6" },
    { tag: tags.number, color: "#a78bfa" },
    { tag: tags.labelName, color: "#4ade80" },
    { tag: tags.comment, color: "#64748b", fontStyle: "italic" },
    { tag: tags.invalid, color: "#ef4444", textDecoration: "underline wavy #ef4444" },
    { tag: tags.string, color: "#a78bfa" },
    { tag: tags.operator, color: "#94a3b8" },
    { tag: tags.variableName, color: "#60a5fa" },
  ])
);

export const lightHighlighting = syntaxHighlighting(
  HighlightStyle.define([
    { tag: tags.keyword, color: "#db2777" },
    { tag: tags.number, color: "#7c3aed" },
    { tag: tags.labelName, color: "#16a34a" },
    { tag: tags.comment, color: "#94a3b8", fontStyle: "italic" },
    { tag: tags.invalid, color: "#dc2626", textDecoration: "underline wavy #dc2626" },
    { tag: tags.string, color: "#7c3aed" },
    { tag: tags.operator, color: "#64748b" },
    { tag: tags.variableName, color: "#2563eb" },
  ])
);

export const highlightCompartment = new Compartment();

export function getThemeExtension(isDark: boolean) {
  return isDark ? darkTheme : lightTheme;
}

export function getHighlightExtension(isDark: boolean) {
  return isDark ? darkHighlighting : lightHighlighting;
}
