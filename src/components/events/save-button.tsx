'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function SaveButton({
  eventId: _eventId,
  userId,
  initialSaved = false,
}: {
  eventId: string;
  userId?: string;
  initialSaved?: boolean;
}) {
  const [saved, setSaved] = useState(initialSaved);
  const [isLoading, setIsLoading] = useState(false);

  const toggleSave = async () => {
    console.debug('Toggling save for event:', _eventId);
    if (!userId) {
      toast.error('Please log in to save events.');
      return;
    }

    setIsLoading(true);
    // Real implementation would call an API here
    setTimeout(() => {
      setSaved(!saved);
      setIsLoading(false);
      toast.success(saved ? 'Event removed from saved.' : 'Event saved successfully!');
    }, 500);
  };

  return (
    <Button
      variant={saved ? 'default' : 'outline'}
      className="flex-1 rounded-2xl h-11 font-bold tracking-tight gap-2"
      onClick={toggleSave}
      disabled={isLoading}
    >
      {saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
      {saved ? 'Saved' : 'Save Event'}
    </Button>
  );
}
