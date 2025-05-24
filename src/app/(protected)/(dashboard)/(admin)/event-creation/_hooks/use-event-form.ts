import { useDateTimeHandle } from './use-datetime-hanle';
import { useFormHandle } from './use-form-handle';
import { useImageHandle } from './use-image-handle';
import { useOpenAIIntegration } from './use-openai-integration';

export const useEventForm = () => {
  const { form, handleSubmit, isSubmitting } = useFormHandle();

  const imageHandling = useImageHandle(form);
  const dateTimeHandling = useDateTimeHandle(form);
  const openAIIntegration = useOpenAIIntegration(form);

  return {
    // Form handling
    form,
    isSubmitting,
    handleSubmit,

    // Image handling
    ...imageHandling,

    // Date time handling
    ...dateTimeHandling,

    // OpenAI integration & step management
    ...openAIIntegration,
  };
};
