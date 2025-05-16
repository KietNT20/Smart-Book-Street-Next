import { Event } from '@/types/event-types';
import { useDateTimeHandle } from './use-datetime-hanle';
import { useFormHandle } from './use-form-handle';
import { useImageHandle } from './use-image-handle';
import { useOpenAIIntegration } from './use-openai-integration';

type UseEventFormProps = {
  eventEdit?: Event;
};

export const useEventForm = ({ eventEdit }: UseEventFormProps) => {
  const { form, handleSubmit, isSubmitting } = useFormHandle(eventEdit);

  const imageHandling = useImageHandle(form);
  const dateTimeHandling = useDateTimeHandle(form);
  const openAIIntegration = useOpenAIIntegration(form);

  return {
    form,
    isSubmitting,
    handleSubmit,
    ...imageHandling,
    ...dateTimeHandling,
    ...openAIIntegration,
  };
};
