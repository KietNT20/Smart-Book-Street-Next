import { NextJS_API } from '@/enums/endpoint';
import { useState } from 'react';
import { toast } from 'sonner';

type SuggestionType = 'eventName' | 'description';

interface UseSuggestionsProps {
  onSuggestionReceived: (type: SuggestionType, suggestion: string) => void;
  useEmojis?: boolean;
}

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

const buildPrompt = (
  type: SuggestionType,
  prompt: string,
  context?: Record<string, any>,
  getEventEmoji?: (name: string) => string
): string => {
  if (type === 'eventName') {
    return `Gợi ý một tên sự kiện hấp dẫn và thu hút dựa trên thông tin sau: ${prompt}. 
    YÊU CẦU:
    - Chỉ trả về tên sự kiện, không thêm diễn giải hay giải thích
    - KHÔNG sử dụng emoji hay biểu tượng cảm xúc
    - KHÔNG sử dụng dấu ba chấm (...) hay dấu chấm ở cuối
    - KHÔNG đặt tên trong dấu ngoặc kép
    - Tên sự kiện phải ngắn gọn (tối đa 200 ký tự), dễ nhớ và phù hợp
    - Sử dụng tiếng Việt tự nhiên, không cần formal
    - Tránh sử dụng các ký tự đặc biệt không cần thiết
    - Thiết kế màu sắc và kiểu chữ phù hợp với sự kiện
    - Có thể dùng định dạng Bold cho các từ khóa quan trọng
    - Tránh sử dụng từ ngữ quá chung chung hoặc mơ hồ
    - Có thể viết in hoa
    - Tránh lặp lại từ ngữ không cần thiết`;
  }

  if (type === 'description') {
    const eventName = context?.eventName || prompt;
    const eventEmoji = getEventEmoji ? getEventEmoji(eventName) : '';
    return `Viết mô tả chi tiết, hấp dẫn và sinh động cho sự kiện với thông tin sau:
    - Tên sự kiện: ${eventEmoji} ${eventName}
    - Thời gian: ${context?.startDate ? `từ ${context.startDate}` : ''} ${context?.endDate ? `đến ${context.endDate}` : ''}
    - Khu vực: ${context?.zoneName || ''}
    
    Mô tả nên bao gồm:
    - Giới thiệu chung về sự kiện
    - Các hoạt động chính diễn ra trong sự kiện
    - Lý do nên tham gia sự kiện này
    - Sử dụng ngôn ngữ sinh động, hấp dẫn và lôi cuốn
    - Đối tượng tham gia
    
    Sử dụng ngôn ngữ sinh động, hấp dẫn và lôi cuốn. Trả về nội dung có định dạng HTML đơn giản với các thẻ như <p>, <h3>, <ul>, <li>, <strong>, <em>.
    Viết mô tả theo đoạn văn dễ đọc, tạo cảm giác hồi hộp và thu hút người đọc.`;
  }

  return '';
};

export const useOpenAISuggestions = ({
  onSuggestionReceived,
  useEmojis = true,
}: UseSuggestionsProps) => {
  const [isGenerating, setIsGenerating] = useState({
    eventName: false,
    description: false,
  });

  const cleanEventName = (eventName: string): string => {
    let cleaned = eventName.replace(
      /[\uD83C-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27FF]|[\uD83C][\uDF00-\uDFFF]|[\uD83D][\uDC00-\uDE4F]|[\uD83D][\uDE80-\uDEFF]/g,
      ''
    );
    cleaned = cleaned.replace(/\.{2,}$|…$/, '');
    cleaned = cleaned.replace(/^["']|["']$/g, '');
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    return cleaned;
  };

  const getEventEmoji = (eventName: string): string => {
    if (!useEmojis) return '';
    const lower = eventName.toLowerCase();

    if (lower.includes('hội nghị') || lower.includes('conference'))
      return EVENT_EMOJIS.conference;
    if (lower.includes('tiệc') || lower.includes('party'))
      return EVENT_EMOJIS.party;
    if (lower.includes('workshop') || lower.includes('hội thảo'))
      return EVENT_EMOJIS.workshop;
    if (
      lower.includes('concert') ||
      lower.includes('âm nhạc') ||
      lower.includes('nhạc')
    )
      return EVENT_EMOJIS.concert;
    if (lower.includes('triển lãm') || lower.includes('exhibition'))
      return EVENT_EMOJIS.exhibition;
    if (lower.includes('tech') || lower.includes('công nghệ'))
      return EVENT_EMOJIS.tech;
    if (lower.includes('ẩm thực') || lower.includes('food'))
      return EVENT_EMOJIS.food;
    if (lower.includes('học') || lower.includes('education'))
      return EVENT_EMOJIS.education;
    if (lower.includes('từ thiện') || lower.includes('charity'))
      return EVENT_EMOJIS.charity;
    if (lower.includes('kinh doanh') || lower.includes('business'))
      return EVENT_EMOJIS.business;
    if (lower.includes('văn hóa') || lower.includes('culture'))
      return EVENT_EMOJIS.culture;
    if (lower.includes('lễ hội') || lower.includes('festival'))
      return EVENT_EMOJIS.festival;

    return EVENT_EMOJIS.default;
  };

  const enhanceHtmlContent = (content: string, eventType?: string): string => {
    if (!useEmojis) return content;

    let enhanced = content
      .replace(/<h3>Giới thiệu<\/h3>/g, '<h3>✨ Giới thiệu</h3>')
      .replace(/<h3>Hoạt động chính<\/h3>/g, '<h3>🎯 Hoạt động chính</h3>')
      .replace(/<h3>Lý do tham gia<\/h3>/g, '<h3>🌟 Lý do tham gia</h3>')
      .replace(/<h3>Đối tượng<\/h3>/g, '<h3>👥 Đối tượng tham gia</h3>')
      .replace(/<h3>Thông tin thêm<\/h3>/g, '<h3>ℹ️ Thông tin thêm</h3>')
      .replace(/<li>/g, '<li style="margin-bottom: 8px;">');

    const footerEmoji = eventType ? getEventEmoji(eventType) : '🎟️';
    enhanced += `<p style="margin-top: 20px; font-style: italic;">${footerEmoji} Đăng ký ngay hôm nay để không bỏ lỡ cơ hội tuyệt vời này!</p>`;
    return enhanced;
  };

  const generateSuggestion = async (
    type: SuggestionType,
    prompt: string,
    additionalContext?: Record<string, any>
  ) => {
    try {
      setIsGenerating((prev) => ({ ...prev, [type]: true }));

      const content = buildPrompt(
        type,
        prompt,
        additionalContext,
        getEventEmoji
      );

      const response = await fetch(NextJS_API.OPENAI, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: content, type }),
      });

      if (!response.ok) throw new Error('Không thể tạo gợi ý');

      const data = await response.json();
      if (data.suggestion) {
        let suggestion = data.suggestion;

        if (type === 'eventName') {
          suggestion = cleanEventName(suggestion);
        } else if (type === 'description') {
          suggestion = enhanceHtmlContent(
            suggestion,
            additionalContext?.eventName || ''
          );
        }

        onSuggestionReceived(type, suggestion);
        toast.success(
          type === 'eventName'
            ? '✨ Đã tạo tên sự kiện thành công!'
            : '📝 Đã tạo mô tả sự kiện thành công!'
        );
      }
    } catch (err) {
      console.error(err);
      toast.error(
        type === 'eventName'
          ? '❌ Không thể tạo tên sự kiện'
          : '❌ Không thể tạo mô tả sự kiện'
      );
    } finally {
      setIsGenerating((prev) => ({ ...prev, [type]: false }));
    }
  };

  return { isGenerating, generateSuggestion };
};
