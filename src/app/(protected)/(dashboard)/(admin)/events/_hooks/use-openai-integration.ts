import { EventFormValues } from '@/lib/zod';
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useOpenAISuggestions } from './use-openai-suggestions';
import { useZonesByStreet } from '@/hooks/use-zone';

export const useOpenAIIntegration = (form: UseFormReturn<EventFormValues>) => {
  const [promptInput, setPromptInput] = useState<string>('');
  const { zonesByStreetRes } = useZonesByStreet();

  const handleSuggestionReceived = (
    type: 'eventName' | 'description',
    suggestion: string
  ) => {
    form.setValue(type, suggestion);
  };

  const { isGenerating, generateSuggestion } = useOpenAISuggestions({
    onSuggestionReceived: handleSuggestionReceived,
  });

  const generateEventNameSuggestion = () => {
    const context = promptInput || 'Hãy tạo tên cho một sự kiện';
    generateSuggestion('eventName', context);
  };

  const generateDescriptionSuggestion = () => {
    const eventName = form.getValues('eventName');
    const eventDates = form.getValues('eventDates');
    const startTimes = form.getValues('startTimes');
    const endTimes = form.getValues('endTimes');
    const zoneId = form.getValues('zoneId');

    const zoneName =
      zonesByStreetRes?.find((zone) => zone.id === zoneId)?.zoneName || '';

    let dateTimeInfo = '';
    if (eventDates?.length && startTimes?.length && endTimes?.length) {
      dateTimeInfo = `Từ ${eventDates[0]} ${startTimes[0]} đến ${eventDates[eventDates.length - 1]} ${endTimes[endTimes.length - 1]}`;
    }

    const context = promptInput || eventName || 'Tạo mô tả cho sự kiện';

    generateSuggestion('description', context, {
      eventName,
      dateTimeInfo,
      zoneName,
    });
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPromptInput(e.target.value);
  };

  return {
    promptInput,
    handlePromptChange,
    generateEventNameSuggestion,
    generateDescriptionSuggestion,
    isGenerating,
    zonesByStreetRes,
  };
};
