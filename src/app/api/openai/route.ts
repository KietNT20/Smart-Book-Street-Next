import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { prompt, type } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Yêu cầu cần có nội dung' },
        { status: 400 }
      );
    }

    let optimizedPrompt = '';
    if (type === 'eventName') {
      optimizedPrompt = `Gợi ý một tên sự kiện hấp dẫn bằng tiếng Việt cho một hoạt động tại Đường sách dựa trên thông tin sau: ${prompt}. 
      Tên sự kiện nên ngắn gọn, dễ nhớ, sáng tạo và phù hợp với không gian văn hóa đọc đường phố. 
      Chỉ trả về tên sự kiện, không có giải thích thêm.`;
    } else if (type === 'description') {
      optimizedPrompt = `Viết mô tả chi tiết và hấp dẫn bằng tiếng Việt cho sự kiện tại Đường sách với thông tin: ${prompt}.
      
      Mô tả nên bao gồm các phần:
      1. Giới thiệu chung về sự kiện tại Đường sách (không gian văn hóa độc đáo)
      2. Các hoạt động chính (liệt kê 4-5 hoạt động cụ thể phù hợp với không gian đường sách)
      3. Đối tượng tham gia (nêu rõ nhóm người phù hợp)
      4. Lý do nên tham gia (nhấn mạnh giá trị văn hóa đọc và trải nghiệm đặc biệt)
      
      Hãy viết với văn phong chuyên nghiệp nhưng thân thiện, phù hợp với không gian văn hóa đọc đường phố tại Việt Nam.
      Trả về nội dung có định dạng HTML đơn giản với các thẻ như <h3>, <p>, <ul>, <li>, <strong>.`;
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'Bạn là trợ lý tạo nội dung chuyên nghiệp cho các sự kiện tại Đường sách ở Việt Nam. Hãy đảm bảo nội dung phù hợp với không gian văn hóa đọc đường phố, tập trung vào giá trị sách và văn hóa đọc, sử dụng ngôn ngữ tự nhiên và dễ hiểu.',
        },
        {
          role: 'user',
          content: optimizedPrompt,
        },
      ],
      temperature: type === 'eventName' ? 0.8 : 0.7,
      max_tokens: type === 'eventName' ? 50 : 700,
    });

    const suggestion = response.choices[0]?.message?.content?.trim();

    return NextResponse.json({ suggestion });
  } catch (error: any) {
    console.error('OpenAI API error:', error);
    return NextResponse.json(
      { error: error.message || 'Lỗi khi gọi OpenAI API' },
      { status: 500 }
    );
  }
}
