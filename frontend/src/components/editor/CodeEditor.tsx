// frontend/src/components/editor/CodeEditor.tsx
import { onMount, onCleanup, createEffect } from "solid-js";
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { setDiagnostics as setEditorDiagnostics } from "@codemirror/lint";
import type { Diagnostic } from "@/wasm/types";
import { ProcessorId } from "@/wasm/types";
import {
  themeCompartment, highlightCompartment,
  getThemeExtension, getHighlightExtension,
} from "./theme";
import { getLanguage } from "./languages";
import { useTheme } from "@/stores/theme";

interface Props {
  processorId: ProcessorId;
  initialCode: string;
  onChange: (code: string) => void;
  onCompile: () => void;
  diagnostics: Diagnostic[];
}

export default function CodeEditor(props: Props) {
  let containerRef!: HTMLDivElement;
  let view: EditorView;
  const { isDark } = useTheme();

  onMount(() => {
    const state = EditorState.create({
      doc: props.initialCode,
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        highlightActiveLineGutter(),
        history(),
        keymap.of([...defaultKeymap, ...historyKeymap]),
        getLanguage(props.processorId),
        themeCompartment.of(getThemeExtension(isDark())),
        highlightCompartment.of(getHighlightExtension(isDark())),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            props.onChange(update.state.doc.toString());
          }
        }),
        keymap.of([{
          key: "Ctrl-Enter",
          run: () => { props.onCompile(); return true; },
        }]),
      ],
    });

    view = new EditorView({
      state,
      parent: containerRef,
    });
  });

  // React to theme changes
  createEffect(() => {
    if (!view) return;
    const dark = isDark();
    view.dispatch({
      effects: [
        themeCompartment.reconfigure(getThemeExtension(dark)),
        highlightCompartment.reconfigure(getHighlightExtension(dark)),
      ],
    });
  });

  // Push diagnostics to CodeMirror
  createEffect(() => {
    if (!view) return;
    const diags = props.diagnostics;
    const cmDiags = diags.map((d) => ({
      from: view.state.doc.line(d.line + 1).from + d.column,
      to: view.state.doc.line(d.line + 1).to,
      severity: d.severity === "Error" ? "error" as const : "warning" as const,
      message: d.message,
    }));
    view.dispatch(setEditorDiagnostics(view.state, cmDiags));
  });

  onCleanup(() => view?.destroy());

  return (
    <div class="flex flex-col h-full">
      <div class="panel-header gap-2">
        <span class="panel-label shrink-0">Editeur</span>
        <button
          onClick={() => props.onCompile()}
          class="px-2.5 py-1 text-[10px] font-medium bg-accent/90 hover:bg-accent text-white rounded-md transition-all shrink-0 glow-accent"
          title="Ctrl+Enter"
        >
          Compiler
        </button>
      </div>
      <div ref={containerRef} class="flex-1 overflow-auto" />
    </div>
  );
}
