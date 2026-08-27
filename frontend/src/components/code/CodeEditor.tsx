import { useContext, useEffect, useRef, useState } from 'react';
import { ProcessorContext, DispatchProcessorContext } from './CodeProvider';
import { CodeAction } from '@src/interface/DispatchCode';
import type { ScrollRef } from '@src/interface/ScrollInterfaces';
import { useFetcher } from 'react-router';
import type { ProcessorStep } from '@src/interface/ProcessorStep';
import loader from '@src/assets/loader.svg';
import { SnackBarContext } from '@src/components/SnackBarProvider';
import { MessageType } from '@src/constants/SnackBar';
import type Processor from '@src/class/Processor';
import type { SnackBarDispatch } from '@src/interface/SnackBarInterface';
import clearSign from '@src/assets/clear-code.svg';
import saveSign from '@src/assets/save-code.svg';
import uploadSign from '@src/assets/upload-code.svg';
import compileSign from '@src/assets/compile-code.svg';
import { ConfirmationModalContext } from '../ConfirmationModal';
import {
  DELETE_CODE_MESSAGE,
  UPLOAD_CODE_MESSAGE,
} from '@src/constants/ConfirmationModal';
import { TokenType } from '@src/interface/visitor/Token';
import { ProcessorId } from '@src/interface/CodeInterface';

export const MIN_EDITOR_WIDTH = 320;
export const MAX_VISUAL_WIDTH = 1000;

interface SaveFileHandle {
  createWritable(): Promise<{
    write(data: Blob): Promise<void>;
    close(): Promise<void>;
  }>;
}

type SaveFilePicker = (options: {
  suggestedName: string;
  types: { description: string; accept: Record<string, string[]> }[];
}) => Promise<SaveFileHandle>;

/**
 * Éditeur de code pour l'assembleur, assure l'écriture, sa connexion avec l'état global
 * S'affiche automatiquement avec le numéro de ligne juste à côté
 * @returns L'éditeur de code pour écrire de l'assembleur
 */
export default function CodeEditor({
  width,
  onResize,
}: {
  width: number;
  onResize: (w: number) => void;
}) {
  const processor = useContext(ProcessorContext);
  const dispatch = useContext(DispatchProcessorContext);
  const setSnackBar = useContext(SnackBarContext);
  const setModal = useContext(ConfirmationModalContext);

  const numberContainer = useRef<HTMLDivElement>(null);
  const textArea = useRef<HTMLTextAreaElement>(null);
  const textVisual = useRef<HTMLDivElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const fetcher = useFetcher<{
    result: Array<ProcessorStep>;
    error?: string;
  }>();

  const [lineNumber, setLineNumber] = useState<number>(0);

  const startX = useRef<number>(0);
  const startW = useRef<number>(0);

  const onMouseDown = (e: React.MouseEvent) => {
    startX.current = e.clientX;
    startW.current = width;
    const onMove = (ev: MouseEvent) => {
      const next = Math.max(
        MIN_EDITOR_WIDTH,
        Math.min(
          startW.current + ev.clientX - startX.current,
          window.innerWidth - MAX_VISUAL_WIDTH,
        ),
      );
      onResize(next);
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  useEffect(() => {
    if (fetcher.data && !fetcher.data.error) {
      setSnackBar({
        visible: true,
        message: 'Compilation réussie',
        type: MessageType.VALID,
        duration: 3000,
      });
      dispatch({
        type: CodeAction.CHANGE_EXECUTED_CODE,
        executedCode: fetcher.data.result,
      });
    } else if (fetcher.data?.error) {
      setSnackBar({
        visible: true,
        message: fetcher.data.error,
        type: MessageType.ERROR,
        duration: 3000,
      });
    }
  }, [fetcher.data, dispatch, setSnackBar]);

  useEffect(() => {
    generateErrorMessage(processor, setSnackBar);
  }, [processor, setSnackBar]);

  useEffect(() => {
    let pcCounter = processor.currentStep.pcState + 1;
    let lineNumber = -1;
    processor.tokenizedLines.find((tokenLine) => {
      if (tokenLine.find((token) => token.type === TokenType.OPERATION)) {
        pcCounter--;
      }
      lineNumber++;
      return !pcCounter;
    });
    setLineNumber(lineNumber);
  }, [processor.currentStep.pcState, processor.tokenizedLines]);

  const onSaveCode = async () => {
    const timestamp = new Date()
      .toISOString()
      .replace('T', '_')
      .replace(/:/g, '-')
      .split('.')[0];
    const defaultName = `${ProcessorId[
      processor.processorId
    ].toLowerCase()}_${timestamp}.txt`;
    const blob = new Blob([processor.code], { type: 'text/plain' });

    const showSaveFilePicker = (
      window as unknown as { showSaveFilePicker?: SaveFilePicker }
    ).showSaveFilePicker;

    if (showSaveFilePicker) {
      try {
        const handle = await showSaveFilePicker({
          suggestedName: defaultName,
          types: [
            {
              description: 'Fichier texte',
              accept: { 'text/plain': ['.txt', '.asm', '.s'] },
            },
          ],
        });
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
      } catch (error) {
        if ((error as DOMException).name !== 'AbortError') {
          setSnackBar({
            visible: true,
            message: "Échec de l'enregistrement du fichier",
            type: MessageType.ERROR,
            duration: 3000,
          });
        }
      }
      return;
    }

    const fileName = window.prompt(
      'Enregistrer sous.\nChoisir le nom du fichier :',
      defaultName,
    );
    if (!fileName) {
      return;
    }
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const onUploadCode = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) {
      return;
    }
    const text = await file.text();
    setModal({
      message: UPLOAD_CODE_MESSAGE,
      visible: true,
      payload: { type: CodeAction.CHANGE_CODE, code: text },
    });
  };

  return (
    <div className='flex flex-shrink-0 min-w-[20rem]' style={{ width }}>
      <div className='relative flex flex-col p-5 bg-main-950 rounded-xl gap-2 flex-1 min-w-0'>
        <div className='absolute top-3 right-3 flex gap-1 z-10 opacity-60 hover:opacity-100 transition-opacity'>
          <button
            className='border border-main-400 rounded-md size-8 bg-main-950/80 backdrop-blur-sm flex justify-center items-center cursor-pointer hover:bg-main-900'
            title='Enregistrer sous...'
            onClick={onSaveCode}
          >
            <img src={saveSign} alt='save' className='size-4' />
          </button>
          <button
            className='border border-main-400 rounded-md size-8 bg-main-950/80 backdrop-blur-sm flex justify-center items-center cursor-pointer hover:bg-main-900'
            title='Téléverser un fichier'
            onClick={() => fileInput.current?.click()}
          >
            <img src={uploadSign} alt='upload' className='size-4' />
          </button>
          <input
            type='file'
            accept='.txt,.asm,.s'
            ref={fileInput}
            className='hidden'
            onChange={onUploadCode}
          />
          <button
            className='border border-main-400 rounded-md size-8 bg-main-950/80 backdrop-blur-sm flex justify-center items-center cursor-pointer hover:bg-main-900'
            title='Effacer le code'
            onClick={() =>
              setModal({
                message: DELETE_CODE_MESSAGE,
                visible: true,
                payload: { type: CodeAction.CHANGE_CODE, code: '' },
              })
            }
          >
            <img src={clearSign} alt='eraser' className='size-4' />
          </button>
        </div>
        <div className='flex grow gap-2 overflow-hidden'>
          <div
            className='flex flex-col text-white w-10 items-end bg-slate-800 px-2 rounded-md no-scrollbar overflow-scroll pb-24'
            ref={numberContainer}
            onScroll={() => {
              handleVerticalScroll(numberContainer, textArea);
              handleVerticalScroll(numberContainer, textVisual);
            }}
          >
            {processor.lines.map((_, i) => (
              <p key={i}>{i + 1}</p>
            ))}
          </div>
          <div className='relative flex-1 min-w-0'>
            <div
              className='absolute pointer-events-none size-full no-scrollbar overflow-y-scroll overflow-x-hidden pb-24'
              ref={textVisual}
            >
              {processor.highlightedText.map((line, iIndex) => {
                return (
                  <p
                    key={iIndex}
                    className={`h-6 w-fit mr-24 ${
                      iIndex === lineNumber
                        ? 'border-1 border-main-400 rounded-md bg-main-900/25'
                        : ''
                    }`}
                  >
                    {line.map((element, jIndex) => {
                      return (
                        <span
                          key={`${iIndex}-${jIndex}`}
                          className={`whitespace-pre ${element.color}`}
                        >
                          {element.text}
                        </span>
                      );
                    })}
                  </p>
                );
              })}
            </div>
            <textarea
              spellCheck='false'
              className='resize-none border-none outline-none size-full text-transparent caret-white'
              value={processor.code}
              onChange={(e) =>
                dispatch({
                  type: CodeAction.CHANGE_CODE,
                  code: e.target.value as string,
                })
              }
              wrap='off'
              ref={textArea}
              onScroll={() => {
                handleVerticalScroll(textArea, numberContainer);
                handleVerticalScroll(textArea, textVisual);
                handleHorizontalScroll(textArea, textVisual);
              }}
            />
          </div>
        </div>
        <div className='flex gap-2 max-w-[100rem] h-[4rem]'>
          <button
            className={`bg-transparent flex justify-center items-center overflow-hidden ${
              processor.isCompilable
                ? 'text-main-400 border-main-400 hover:bg-main-900 cursor-pointer'
                : 'text-red-500 border-red-500'
            } border-2 rounded-md p-2 gap-2 h-[4rem] flex-1`}
            disabled={!processor.isCompilable}
            onClick={() => {
              dispatch({ type: CodeAction.RESET_CODE });
              fetcher.submit(
                { processor: JSON.stringify(processor) },
                { method: 'POST', action: '/processor' },
              );
            }}
          >
            <img
              src={fetcher.state === 'submitting' ? loader : compileSign}
              alt='compile'
              className={`shrink-0 size-[2rem] ${
                fetcher.state === 'submitting' ? 'animate-spin' : ''
              }`}
            />
            <span className='inline-block align-middle truncate min-w-0'>
              Compiler
            </span>
          </button>
        </div>
      </div>
      <div
        className='flex flex-col items-center justify-center w-4 flex-shrink-0 cursor-col-resize group mx-1'
        onMouseDown={onMouseDown}
      >
        <div className='flex flex-col gap-2 opacity-30 group-hover:opacity-100 transition-opacity'>
          <div className='w-3 h-3 rounded-full bg-main-400' />
          <div className='w-3 h-3 rounded-full bg-main-400' />
          <div className='w-3 h-3 rounded-full bg-main-400' />
        </div>
      </div>
    </div>
  );
}

/**
 * Associe deux ScrollElement pour synchronisé le leur. Lien d'une seule direction.
 * Il faut l'utiliser sur les deux onScroll pour bien synchronisé les deux éléments.
 * @param scroller - l'élément qu'on défile
 * @param scrolled - l'élément qu'on veut synchronisé
 */
function handleVerticalScroll(scroller: ScrollRef, scrolled: ScrollRef): void {
  if (scroller.current && scrolled.current) {
    scrolled.current.scrollTop = scroller.current.scrollTop;
  }
}

/**
 * Associe le défilement horizontal de deux éléments html ensembles
 * Le lien ce fait d'une seule direction pour bien synchronisé deux éléments
 * il faut le faire avec les paramètres inversés
 * @param scroller - l'élément qu'on défile
 * @param scrolled - l'élément qu'on veut synchronisé
 */
function handleHorizontalScroll(
  scroller: ScrollRef,
  scrolled: ScrollRef,
): void {
  if (scroller.current && scrolled.current) {
    scrolled.current.scrollLeft = scroller.current.scrollLeft;
  }
}

function generateErrorMessage(
  processor: Processor,
  setSnackBar: SnackBarDispatch,
): void {
  let message = '';
  let isOnlyWarning = true;
  processor.tokenizedLines.forEach((tokenLine, i) => {
    tokenLine.forEach((token) => {
      if (token.error) {
        message += `Erreur ligne ${i + 1} - ${token.error}\n`;
        isOnlyWarning = false;
      }

      if (token.warning) {
        message += `Avertissement ligne ${i + 1} - ${token.warning}\n`;
      }
    });
  });
  setSnackBar({
    visible: !!message,
    type: isOnlyWarning ? MessageType.NEUTRAL : MessageType.ERROR,
    message: message,
    duration: Infinity,
  });
}
