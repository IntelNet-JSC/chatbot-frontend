'use client';
import { useEnsureRegeneratorRuntime } from '@/app/hooks/useEnsureRegeneratorRuntime';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { welcomeMessage } from '@/lib/strings';
import { useChat } from 'ai/react';
import { Share } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import Bubble from './chat/bubble';
import SendForm from './chat/send-form';
import { useAppSelector } from '../../redux/hook';
import { CloseIcon } from './icons/close-icon';
import { useIsMobile } from '@/app/hooks/useIsMobile';

interface Chat {
  setOpen?: Dispatch<SetStateAction<boolean>>;
}

export default function Chat({ setOpen }: Chat) {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const paramsQuery = Object.fromEntries(Array.from(searchParams.entries()));
  const share = searchParams.get('share');
  //@ts-ignore
  const lzstring = LZString;
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    initialMessages: share && lzstring ? JSON.parse(lzstring.decompressFromEncodedURIComponent(share)) : [],
  });

  const [chatInput, setChatInput] = useState<string>('');
  const chat = useAppSelector((state) => state.chat);

  const handleChangeChatInput = useCallback((event: any) => {
    setChatInput(event.target.value);
  }, []);

  useEnsureRegeneratorRuntime();

  const scrollAreaRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [chat]);

  return (
    <Card className={`${isMobile ? 'h-screen w-screen' : 'w-[440px]'} flex flex-col justify-between relative`}>
      <div>
        <CardHeader>
          <div className="flex flex-row items-start justify-between max-w-[100%]">
            <CardTitle className="text-lg">{paramsQuery?.title}</CardTitle>
            {!isMobile && (
              <CloseIcon
                className="cursor-pointer"
                onClick={() => {
                  setOpen && setOpen(false);
                }}
              />
            )}
            {/* <Share
            onClick={() => {
              if (typeof window !== 'undefined') {
                const tmp = new URL(window.location.href);
                tmp.searchParams.set('share', lzstring.compressToEncodedURIComponent(JSON.stringify(chat)));
                navigator.clipboard.writeText(tmp.toString()).then(() => {
                  toast({
                    description: 'Conversation link copied to dashboard',
                  });
                });
              }
            }}
            size={18}
            className="cursor-pointer"
          /> */}
          </div>
          {/* <CardDescription className=" leading-3">Powered by Mendable and Vercel</CardDescription> */}
        </CardHeader>
        <CardContent className="">
          <ScrollArea ref={scrollAreaRef} className={`${isMobile ? 'h-[80vh]' : 'h-[450px]'} overflow-y-auto w-full spacy-y-4 pr-4`}>
            <Bubble
              message={{
                role: 'assistant',
                content: paramsQuery?.welcome || welcomeMessage,
                // id: 'initialai',
              }}
            />
            {chat?.map((message, index) => (
              <Bubble key={index} message={message} />
            ))}
          </ScrollArea>
        </CardContent>
      </div>
      <CardFooter className={`${isMobile && 'fixed w-full bg-white bottom-0'}`}>
        <SendForm input={chatInput} handleSubmit={handleSubmit} handleInputChange={handleChangeChatInput} setChatInput={setChatInput} />
      </CardFooter>
    </Card>
  );
}
