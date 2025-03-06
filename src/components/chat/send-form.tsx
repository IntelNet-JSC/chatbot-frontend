import { useEnsureRegeneratorRuntime } from '@/app/hooks/useEnsureRegeneratorRuntime';
import { Textarea } from '@/components/ui/textarea';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { Grid } from 'react-loader-spinner';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { MicIcon } from '../icons/mic-icon';
import { Button } from '../ui/button';
import { toast } from '../ui/use-toast';
import { useCreateChatMutation } from '../../../redux/services/chat';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import { setChat } from '../../../redux/features/chat';
import { useSearchParams } from 'next/navigation';

interface SendForm {
  input: string;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  setChatInput?: Dispatch<SetStateAction<string>>;
}

export default function SendForm({ input, handleSubmit, handleInputChange, setChatInput }: SendForm) {
  const searchParams = useSearchParams();
  const paramsQuery = Object.fromEntries(Array.from(searchParams.entries()));

  useEnsureRegeneratorRuntime();

  const dispatch = useAppDispatch();
  const chat = useAppSelector((state) => state.chat);

  const [textareaHeight, setTextareaHeight] = useState('h-10');

  const textareaRef = useRef(null);

  const { listening, browserSupportsSpeechRecognition, resetTranscript, transcript } = useSpeechRecognition();

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      toast({
        description: 'Your browser does not support speech recognition',
      });
    }
  }, [browserSupportsSpeechRecognition]);

  useEffect(() => {
    const textarea = document.querySelector('.mendable-textarea');
    if (textarea) {
      if (input === '') {
        resetTranscript();
        setTextareaHeight('h-10');
      } else {
        const shouldExpand = textarea.scrollHeight > textarea.clientHeight && textareaHeight !== 'h-20';
        if (shouldExpand) {
          setTextareaHeight('h-20');
        }
      }

      if (listening) {
        textarea.scrollTop = textarea.scrollHeight;
      }
    }
  }, [listening, input, textareaHeight]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && listening) {
        SpeechRecognition.stopListening();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [listening]);

  useEffect(() => {
    if (transcript) {
      updateInputWithTranscript(transcript);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript]);

  const updateInputWithTranscript = (transcriptValue: string) => {
    const fakeEvent: any = {
      target: { value: transcriptValue },
    };
    handleInputChange(fakeEvent);
  };

  function toggleSpeech() {
    if (listening) {
      SpeechRecognition.stopListening();
      return;
    } else {
      SpeechRecognition.startListening({ continuous: true });
      return;
    }
  }

  const [createChat, { isLoading: isLoadingCreateChat }] = useCreateChatMutation();

  return (
    <form
      onSubmit={async (event) => {
        handleSubmit(event);

        await dispatch(setChat([...chat, { content: input, role: 'user' }]));

        createChat({
          link: paramsQuery?.link,
          chatInput: input,
          metadata: Object.fromEntries(Object.entries(paramsQuery).filter(([key]) => key !== 'link')),
        });

        setChatInput && setChatInput('');
      }}
      className="flex items-center justify-center w-full space-x-2"
    >
      <div className="relative w-full max-w-xs">
        <MicIcon
          onClick={toggleSpeech}
          className={`absolute right-2 h-4 w-4 top-1/2 transition-all transform -translate-y-2 ${
            listening ? 'text-red-500 scale-125 animate-pulse' : 'text-gray-500'
          } dark:text-gray-400 hover:scale-125 cursor-pointer`}
        />

        <Textarea
          value={input}
          onChange={handleInputChange}
          className={`pr-8 resize-none mendable-textarea min-h-[20px] ${textareaHeight}`}
          placeholder="Nhập tin nhắn..."
          ref={textareaRef}
        />
      </div>

      <Button className="h-10">
        {isLoadingCreateChat ? (
          <div className="flex gap-2 items-center">
            <Grid height={12} width={12} radius={5} ariaLabel="grid-loading" color="#fff" visible={true} />
            {'Đang tải...'}
          </div>
        ) : (
          <div className="flex flex-col w-16">Gửi</div>
        )}
      </Button>
    </form>
  );
}
