import { promises as fs } from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import os from 'os';
import path from 'path';
import * as XLSX from 'xlsx';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const {
      eventId,
      eventName,
      statistics,
      zoneInfo,
      dateRange,
      organizerEmail,
    } = data;

    if (!organizerEmail) {
      return NextResponse.json(
        { success: false, message: 'Thiếu email người nhận' },
        { status: 400 }
      );
    }

    const workbook = XLSX.utils.book_new();

    const generalInfoWs = XLSX.utils.json_to_sheet(
      [
        {
          'Tên sự kiện': eventName,
          'Tổng số đăng ký': statistics.totalRegistrations,
          'Địa điểm': zoneInfo?.zoneName || 'N/A',
          'Địa chỉ': zoneInfo?.street?.address || 'N/A',
          'Ngày bắt đầu': new Date(dateRange.startDate).toLocaleDateString(
            'vi-VN'
          ),
          'Ngày kết thúc': new Date(dateRange.endDate).toLocaleDateString(
            'vi-VN'
          ),
          'Thời gian xuất báo cáo': new Date().toLocaleString('vi-VN'),
        },
      ],
      { header: ['Thông số', 'Giá trị'] }
    );
    XLSX.utils.book_append_sheet(workbook, generalInfoWs, 'Thông tin chung');

    // Thêm worksheet cho biểu đồ độ tuổi
    if (statistics.ageChart && statistics.ageChart.length > 0) {
      const ageChartWs = XLSX.utils.json_to_sheet(
        statistics.ageChart.map((item: any) => ({
          'Độ tuổi': item.name,
          'Số lượng': item.value,
        }))
      );
      XLSX.utils.book_append_sheet(workbook, ageChartWs, 'Phân bố độ tuổi');
    }

    // Thêm worksheet cho biểu đồ giới tính
    if (statistics.genderChart && statistics.genderChart.length > 0) {
      const genderChartWs = XLSX.utils.json_to_sheet(
        statistics.genderChart.map((item: any) => ({
          'Giới tính': item.name,
          'Số lượng': item.value,
        }))
      );
      XLSX.utils.book_append_sheet(
        workbook,
        genderChartWs,
        'Phân bố giới tính'
      );
    }

    // Thêm worksheet cho biểu đồ nguồn tham khảo
    if (statistics.referenceChart && statistics.referenceChart.length > 0) {
      const refChartWs = XLSX.utils.json_to_sheet(
        statistics.referenceChart.map((item: any) => ({
          Nguồn: item.name,
          'Số lượng': item.value,
        }))
      );
      XLSX.utils.book_append_sheet(workbook, refChartWs, 'Nguồn tham khảo');
    }

    // Thêm worksheet cho biểu đồ địa điểm
    if (statistics.addressChart && statistics.addressChart.length > 0) {
      const addressChartWs = XLSX.utils.json_to_sheet(
        statistics.addressChart.map((item: any) => ({
          'Địa điểm': item.name,
          'Số lượng': item.value,
        }))
      );
      XLSX.utils.book_append_sheet(
        workbook,
        addressChartWs,
        'Phân bố địa điểm'
      );
    }

    // Tạo tên file với timestamp để tránh trùng lặp
    const fileName = `event_statistics_${eventId}_${Date.now()}.xlsx`;
    const tempDir = os.tmpdir();
    const filePath = path.join(tempDir, fileName);

    // Ghi file vào thư mục tạm
    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    await fs.writeFile(filePath, buffer);

    // Chuẩn bị email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: organizerEmail,
      subject: `Thống kê sự kiện: ${eventName}`,
      html: `
        <h2>Thống kê sự kiện: ${eventName}</h2>
        <p>Kính gửi Ban tổ chức sự kiện,</p>
        <p>Đính kèm là thống kê chi tiết của sự kiện "${eventName}" với tổng số ${statistics.totalRegistrations} người đăng ký tham gia.</p>
        <p><strong>Thông tin sự kiện:</strong></p>
        <ul>
          <li>Địa điểm: ${zoneInfo?.zoneName || 'N/A'}</li>
          <li>Thời gian: ${new Date(dateRange.startDate).toLocaleDateString('vi-VN')} - ${new Date(dateRange.endDate).toLocaleDateString('vi-VN')}</li>
        </ul>
        <p>Báo cáo được xuất tự động tại thời điểm: ${new Date().toLocaleString('vi-VN')}</p>
        <p>Trân trọng,<br>Hệ thống quản lý sự kiện</p>
      `,
      attachments: [
        {
          filename: fileName,
          path: filePath,
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);

    // Xóa file tạm sau khi gửi xong
    await fs.unlink(filePath);

    return NextResponse.json({
      success: true,
      message: 'Xuất thống kê thành công và đã gửi email',
      emailInfo: info.messageId,
    });
  } catch (error: any) {
    console.error('Export statistics error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Có lỗi xảy ra khi xuất thống kê',
      },
      { status: 500 }
    );
  }
}
