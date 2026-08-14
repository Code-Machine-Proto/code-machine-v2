import CodeEditor, { MIN_EDITOR_WIDTH } from '@src/components/code/CodeEditor';
import { ProcessorContext } from '@src/components/code/CodeProvider';
import ExecutionControl from '@src/components/execution/ExecutionControl';
import Memory from '@src/components/Memory';
import { PROCESSOR_ACTIONS } from '@src/constants/Memory';
import { useContext, useState } from 'react';
import { Outlet } from 'react-router';

/**
 * Layout de la page processeurs pour accueillir une simulation d'un processeur
 * @returns Le composant de la page des processeur
 */
export default function Processor() {
  const currentStep = useContext(ProcessorContext).currentStep;
  const [enableMemory, setEnableMemory] = useState<boolean>(false);
  const [isVisualMode, setVisualMode] = useState<boolean>(false);
  const [editorWidth, setEditorWidth] = useState<number>(MIN_EDITOR_WIDTH);

  return (
    <div className='flex p-5 bg-back gap-5 h-full overflow-hidden'>
      <CodeEditor width={editorWidth} onResize={setEditorWidth} />
      <div className='flex flex-col grow bg-main-950 rounded-xl p-5 gap-5 min-w-0'>
        <ExecutionControl
          memoryState={[enableMemory, setEnableMemory]}
          visualSetting={[isVisualMode, setVisualMode]}
        />
        <p className='bg-white w-fit p-3 rounded-md'>
          {PROCESSOR_ACTIONS[currentStep.instructionState]}
        </p>
        <div className='flex grow gap-5'>
          <Outlet context={isVisualMode} />
          {enableMemory && (
            <Memory
              className='bg-green-500'
              memoryContent={currentStep.memoryState}
              stimulatedCell={currentStep.stimulatedMemory}
              nom='Mémoire principale'
            />
          )}
        </div>
      </div>
    </div>
  );
}
