'use client';

import Chat from '@/components/chat';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { useIsMobile } from './hooks/useIsMobile';

export default function Home() {
  const [open, setOpen] = useState<boolean>(false);
  const isMobile = useIsMobile();

  return (
    <div className="flex bg-gray-50 min-h-screen items-center justify-center">
      {isMobile ? (
        <Chat setOpen={setOpen} />
      ) : (
        <Popover open={open} onOpenChange={() => setOpen(true)}>
          <PopoverContent align="start" className="w-[440px] mr-4">
            <Chat setOpen={setOpen} />
          </PopoverContent>
          <PopoverTrigger asChild className="fixed bottom-4 right-4">
            <Button variant="outline" className="rounded-full w-16 h-16 aspect-square bg-black hover:bg-gray-700">
              <MessageCircle size={40} className="text-white" />
            </Button>
          </PopoverTrigger>
        </Popover>
      )}
    </div>
  );
}
