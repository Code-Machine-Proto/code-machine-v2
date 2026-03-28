// frontend/src/components/editor/languages.ts
import { StreamLanguage, StringStream } from "@codemirror/language";
import { ProcessorId } from "@/wasm/types";

const accumulatorMnemonics = new Set([
  "add", "sub", "mul", "st", "ld", "stop", "nop", "br", "brz", "brnz",
]);

const accumulatorMaMnemonics = new Set([
  "add", "sub", "mul", "adda", "suba", "addx", "subx",
  "ld", "st", "lda", "sta", "ldi", "sti",
  "br", "brz", "brnz", "shl", "shr", "lea", "stop", "nop",
]);

const polyriscMnemonics = new Set([
  "add", "sub", "shr", "shl", "not", "and", "or", "mv",
  "ld", "st", "ldi", "br", "brz", "brnz", "brlz", "brgez", "stop",
]);

function createAssemblyLanguage(mnemonics: Set<string>) {
  return StreamLanguage.define({
    startState() {
      return {};
    },
    token(stream: StringStream) {
      // Comments
      if (stream.match("//")) {
        stream.skipToEnd();
        return "comment";
      }

      // Directives
      if (stream.match(/^\.\w+/)) {
        return "keyword";
      }

      // Label definition (word followed by colon)
      if (stream.match(/^[a-zA-Z_]\w*(?=\s*:)/)) {
        return "labelName";
      }

      // Colon after label
      if (stream.eat(":")) {
        return "operator";
      }

      // Registers (r0-r31)
      if (stream.match(/^r\d{1,2}\b/i)) {
        return "variableName";
      }

      // Hex numbers
      if (stream.match(/^0[xX][0-9a-fA-F]+/)) {
        return "number";
      }

      // Decimal numbers (including negative)
      if (stream.match(/^-?\d+/)) {
        return "number";
      }

      // Words — check if mnemonic
      if (stream.match(/^[a-zA-Z_]\w*/)) {
        const word = stream.current().toLowerCase();
        if (mnemonics.has(word)) {
          return "keyword";
        }
        return "labelName"; // label reference
      }

      // Parentheses and commas
      if (stream.match(/^[(),+]/)) {
        return "operator";
      }

      // Skip whitespace
      stream.next();
      return null;
    },
  });
}

export function getLanguage(processorId: ProcessorId) {
  switch (processorId) {
    case ProcessorId.Accumulator:
      return createAssemblyLanguage(accumulatorMnemonics);
    case ProcessorId.AccumulatorMa:
      return createAssemblyLanguage(accumulatorMaMnemonics);
    case ProcessorId.PolyRisc:
      return createAssemblyLanguage(polyriscMnemonics);
  }
}
