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
  tech: '💻',
  food: '🍽️',
  education: '📚',
  charity: '❤️',
  business: '💼',
  culture: '🏮',
  festival: '🎪',
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

  // Helper function to clean event name from unwanted characters
  const cleanEventName = (eventName: string): string => {
    // Remove emojis (most common Unicode emoji ranges)
    let cleaned = eventName.replace(
      /[\uD83C-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27FF]|[\uD83C][\uDF00-\uDFFF]|[\uD83D][\uDC00-\uDE4F]|[\uD83D][\uDE80-\uDEFF]/g,
      ''
    );

    // Remove ellipsis and dots at the end
    cleaned = cleaned.replace(/\.{2,}$|…$/, '');

    // Remove quotes if they wrap the entire string
    cleaned = cleaned.replace(/^["']|["']$/g, '');

    // Clean up extra spaces
    cleaned = cleaned.replace(/\s+/g, ' ').trim();

    return cleaned;
  };

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
        
        YÊU CẦU:
        - Chỉ trả về tên sự kiện, không thêm diễn giải hay giải thích
        - KHÔNG sử dụng emoji hay biểu tượng cảm xúc
        - KHÔNG sử dụng dấu ba chấm (...) hay dấu chấm ở cuối
        - KHÔNG đặt tên trong dấu ngoặc kép
        - Tên sự kiện phải ngắn gọn (tối đa 100 ký tự), dễ nhớ và phù hợp
        - Sử dụng tiếng Việt tự nhiên, không cần formal
        
        Ví dụ tốt: "Hội thảo khởi nghiệp công nghệ 2024"
        Ví dụ tránh: "🚀 Hội thảo khởi nghiệp công nghệ 2024..." hoặc "Hội thảo khởi nghiệp công nghệ 2024"`;
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

        // For event names, clean up unwanted characters
        if (type === 'eventName') {
          processedSuggestion = cleanEventName(processedSuggestion);
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
