import { useGetStreetsAll } from '@/hooks/use-street';
import { useZoneByStreetId } from '@/hooks/use-zone';
import { EventFormValues } from '@/lib/zod';
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useOpenAISuggestions } from './use-openai-suggestions';

type FormStep = 'street' | 'zone' | 'event-details';

export const useOpenAIIntegration = (form: UseFormReturn<EventFormValues>) => {
  const [promptInput, setPromptInput] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<FormStep>('street');
  const [selectedStreetId, setSelectedStreetId] = useState<string>('');
  const [selectedZoneId, setSelectedZoneId] = useState<string>('');

  // API hooks
  const { streetsRes, isLoadingStreets } = useGetStreetsAll();
  const { zoneByStreetRes, isLoadingZoneByStreet } =
    useZoneByStreetId(selectedStreetId);

  const handleSuggestionReceived = (
    type: 'eventName' | 'description',
    suggestion: string
  ) => {
    form.setValue(type, suggestion);
  };

  const { isGenerating, generateSuggestion } = useOpenAISuggestions({
    onSuggestionReceived: handleSuggestionReceived,
  });

  // Step handlers
  const handleStreetSelect = (streetId: string) => {
    setSelectedStreetId(streetId);
    setSelectedZoneId(''); // Reset zone selection
    setCurrentStep('zone');
  };

  const handleZoneSelect = (zoneId: string) => {
    setSelectedZoneId(zoneId);
    form.setValue('zoneId', zoneId); // Set zone in form
    setCurrentStep('event-details');
  };

  const handleBackToStreet = () => {
    setCurrentStep('street');
    setSelectedStreetId('');
    setSelectedZoneId('');
    form.setValue('zoneId', ''); // Clear zone from form
  };

  const handleBackToZone = () => {
    setCurrentStep('zone');
    setSelectedZoneId('');
    form.setValue('zoneId', ''); // Clear zone from form
  };

  // AI suggestion handlers
  const generateEventNameSuggestion = () => {
    const selectedStreet = streetsRes?.find(
      (street) => street.id === selectedStreetId
    );
    const selectedZone = zoneByStreetRes?.find(
      (zone) => zone.id === selectedZoneId
    );

    const context =
      promptInput ||
      `Tạo tên sự kiện tại ${selectedZone?.zoneName || ''}, ${selectedStreet?.streetName || ''}`;
    generateSuggestion('eventName', context);
  };

  const generateDescriptionSuggestion = () => {
    const eventName = form.getValues('eventName');
    const eventDates = form.getValues('eventDates');
    const startTimes = form.getValues('startTimes');
    const endTimes = form.getValues('endTimes');

    const selectedStreet = streetsRes?.find(
      (street) => street.id === selectedStreetId
    );
    const selectedZone = zoneByStreetRes?.find(
      (zone) => zone.id === selectedZoneId
    );

    let dateTimeInfo = '';
    if (eventDates?.length && startTimes?.length && endTimes?.length) {
      dateTimeInfo = `Từ ${eventDates[0]} ${startTimes[0]} đến ${eventDates[eventDates.length - 1]} ${endTimes[endTimes.length - 1]}`;
    }

    const locationInfo = `${selectedZone?.zoneName || ''}, ${selectedStreet?.streetName || ''}`;
    const context =
      promptInput || eventName || `Tạo mô tả cho sự kiện tại ${locationInfo}`;

    generateSuggestion('description', context, {
      eventName,
      dateTimeInfo,
      locationInfo,
    });
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPromptInput(e.target.value);
  };

  // Get current data based on step
  const getCurrentStepData = () => {
    const selectedStreet = streetsRes?.find(
      (street) => street.id === selectedStreetId
    );
    const selectedZone = zoneByStreetRes?.find(
      (zone) => zone.id === selectedZoneId
    );

    return {
      selectedStreet,
      selectedZone,
      availableZones: zoneByStreetRes || [],
    };
  };

  return {
    // Step management
    currentStep,
    setCurrentStep,

    // Selection handlers
    handleStreetSelect,
    handleZoneSelect,
    handleBackToStreet,
    handleBackToZone,

    // Selected values
    selectedStreetId,
    selectedZoneId,

    // Data
    streetsRes: streetsRes || [],
    zoneByStreetRes: zoneByStreetRes || [],
    isLoadingStreets,
    isLoadingZoneByStreet,

    // AI features
    promptInput,
    handlePromptChange,
    generateEventNameSuggestion,
    generateDescriptionSuggestion,
    isGenerating,

    // Helper
    getCurrentStepData,

    // Computed states
    canProceedToZone: !!selectedStreetId,
    canProceedToEventDetails: !!selectedZoneId,
    showEventForm: currentStep === 'event-details',
  };
};
