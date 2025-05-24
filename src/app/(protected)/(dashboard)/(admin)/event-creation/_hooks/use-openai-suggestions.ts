import { NextJS_API } from '@/enums/endpoint';
import { useState } from 'react';
import { toast } from 'sonner';

type SuggestionType = 'eventName' | 'description';

// Extended interface to include emoji preferences
interface UseSuggestionsProps {
  onSuggestionReceived: (type: SuggestionType, suggestion: string) => void;
  useEmojis?: boolean; // Optional flag to toggle emojis
}

// Event category emojis mapping
const EVENT_EMOJIS = {
  conference: '🎤',
  party: '🎉',
  workshop: '🔧',
  concert: '🎵',
  exhibition: '🖼️',
  sports: '🏆',
  tech: '💻',
  food: '🍽️',
  education: '📚',
  charity: '❤️',
  business: '💼',
  culture: '🏮',
  festival: '🎪',
  holiday: '🎄',
  travel: '✈️',
  default: '📅',
};

export const useOpenAISuggestions = ({
  onSuggestionReceived,
  useEmojis = true, // Enable emojis by default
}: UseSuggestionsProps) => {
  const [isGenerating, setIsGenerating] = useState<{
    eventName: boolean;
    description: boolean;
  }>({
    eventName: false,
    description: false,
  });

  // Helper function to detect event type and return appropriate emoji
  const getEventEmoji = (eventName: string): string => {
    if (!useEmojis) return '';

    const lowerCaseEventName = eventName.toLowerCase();

    if (
      lowerCaseEventName.includes('hội nghị') ||
      lowerCaseEventName.includes('conference')
    )
      return EVENT_EMOJIS.conference;
    if (
      lowerCaseEventName.includes('tiệc') ||
      lowerCaseEventName.includes('party')
    )
      return EVENT_EMOJIS.party;
    if (
      lowerCaseEventName.includes('workshop') ||
      lowerCaseEventName.includes('hội thảo')
    )
      return EVENT_EMOJIS.workshop;
    if (
      lowerCaseEventName.includes('concert') ||
      lowerCaseEventName.includes('âm nhạc') ||
      lowerCaseEventName.includes('nhạc')
    )
      return EVENT_EMOJIS.concert;
    if (
      lowerCaseEventName.includes('triển lãm') ||
      lowerCaseEventName.includes('exhibition')
    )
      return EVENT_EMOJIS.exhibition;
    if (
      lowerCaseEventName.includes('thể thao') ||
      lowerCaseEventName.includes('sports')
    )
      return EVENT_EMOJIS.sports;
    if (
      lowerCaseEventName.includes('tech') ||
      lowerCaseEventName.includes('công nghệ')
    )
      return EVENT_EMOJIS.tech;
    if (
      lowerCaseEventName.includes('ẩm thực') ||
      lowerCaseEventName.includes('food')
    )
      return EVENT_EMOJIS.food;
    if (
      lowerCaseEventName.includes('học') ||
      lowerCaseEventName.includes('education')
    )
      return EVENT_EMOJIS.education;
    if (
      lowerCaseEventName.includes('từ thiện') ||
      lowerCaseEventName.includes('charity')
    )
      return EVENT_EMOJIS.charity;
    if (
      lowerCaseEventName.includes('kinh doanh') ||
      lowerCaseEventName.includes('business')
    )
      return EVENT_EMOJIS.business;
    if (
      lowerCaseEventName.includes('văn hóa') ||
      lowerCaseEventName.includes('culture')
    )
      return EVENT_EMOJIS.culture;
    if (
      lowerCaseEventName.includes('lễ hội') ||
      lowerCaseEventName.includes('festival')
    )
      return EVENT_EMOJIS.festival;

    return EVENT_EMOJIS.default;
  };

  // Enhanced HTML formatting with emojis and styling
  const enhanceHtmlContent = (content: string, eventType?: string): string => {
    if (!useEmojis) return content;

    // Add section emojis
    let enhancedContent = content
      .replace(/<h3>Giới thiệu<\/h3>/g, '<h3>✨ Giới thiệu</h3>')
      .replace(/<h3>Hoạt động chính<\/h3>/g, '<h3>🎯 Hoạt động chính</h3>')
      .replace(/<h3>Lý do tham gia<\/h3>/g, '<h3>🌟 Lý do tham gia</h3>')
      .replace(/<h3>Đối tượng<\/h3>/g, '<h3>👥 Đối tượng tham gia</h3>')
      .replace(/<h3>Thông tin thêm<\/h3>/g, '<h3>ℹ️ Thông tin thêm</h3>');

    // Add bullet points with emojis
    enhancedContent = enhancedContent.replace(
      /<li>/g,
      '<li style="margin-bottom: 8px;">'
    );

    // Add a dynamic footer
    const footerEmoji = eventType ? getEventEmoji(eventType) : '🎟️';
    enhancedContent += `<p style="margin-top: 20px; font-style: italic;">${footerEmoji} Đăng ký ngay hôm nay để không bỏ lỡ cơ hội tuyệt vời này!</p>`;

    return enhancedContent;
  };

  const generateSuggestion = async (
    type: SuggestionType,
    prompt: string,
    additionalContext?: Record<string, any>
  ) => {
    try {
      setIsGenerating((prev) => ({ ...prev, [type]: true }));

      // Customize prompt based on type
      let content = '';

      if (type === 'eventName') {
        content = `Gợi ý một tên sự kiện hấp dẫn, ngắn gọn và thu hút dựa trên thông tin sau: ${prompt}. 
        Chỉ trả về tên sự kiện không có thêm diễn giải. Đảm bảo tên sự kiện ngắn gọn, dễ nhớ và phù hợp với mục đích sự kiện.`;
      } else if (type === 'description') {
        const eventName = additionalContext?.eventName || prompt;
        const eventEmoji = getEventEmoji(eventName);

        content = `Viết mô tả chi tiết, hấp dẫn và sinh động cho sự kiện với thông tin sau:
          - Tên sự kiện: ${eventEmoji} ${eventName}
          - Thời gian: ${additionalContext?.startDate ? `từ ${additionalContext.startDate}` : ''} ${additionalContext?.endDate ? `đến ${additionalContext.endDate}` : ''}
          - Khu vực: ${additionalContext?.zoneName || ''}
          
          Mô tả nên bao gồm:
          - Giới thiệu chung về sự kiện 
          - Những hoạt động chính
          - Lý do nên tham gia
          - Đối tượng tham gia
          
          Sử dụng ngôn ngữ sinh động, hấp dẫn và lôi cuốn. Trả về nội dung có định dạng HTML đơn giản với các thẻ như <p>, <h3>, <ul>, <li>, <strong>, <em>.
          Viết mô tả theo đoạn văn dễ đọc, tạo cảm giác hồi hộp và thu hút người đọc.`;
      }

      const response = await fetch(NextJS_API.OPENAI, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: content,
          type,
        }),
      });

      if (!response.ok) {
        throw new Error('Không thể tạo gợi ý');
      }

      const data = await response.json();

      if (data.suggestion) {
        // Process the suggestion before passing it back
        let processedSuggestion = data.suggestion;

        // For event names, we may want to add an emoji prefix
        if (type === 'eventName') {
          const emoji = getEventEmoji(processedSuggestion);
          processedSuggestion = useEmojis
            ? `${emoji} ${processedSuggestion}`
            : processedSuggestion;
        }
        // For descriptions, enhance the HTML content
        else if (type === 'description') {
          processedSuggestion = enhanceHtmlContent(
            processedSuggestion,
            additionalContext?.eventName || ''
          );
        }

        onSuggestionReceived(type, processedSuggestion);

        // Enhanced toast notifications with emojis
        if (type === 'eventName') {
          toast.success(`✨ Đã tạo tên sự kiện thành công!`);
        } else {
          toast.success(`📝 Đã tạo mô tả hấp dẫn thành công!`);
        }
      }
    } catch (error) {
      console.error('Lỗi khi tạo gợi ý:', error);

      // Enhanced error toasts with emojis
      if (type === 'eventName') {
        toast.error(`❌ Không thể tạo tên sự kiện`);
      } else {
        toast.error(`❌ Không thể tạo mô tả`);
      }
    } finally {
      setIsGenerating((prev) => ({ ...prev, [type]: false }));
    }
  };

  return {
    isGenerating,
    generateSuggestion,
  };
};
