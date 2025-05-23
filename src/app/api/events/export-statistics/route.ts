import {
  ExportStatisticsRequest,
  ExportStatisticsResponse,
} from '@/types/event-registrations-types';
import { EventStatistics } from '@/types/event-types';
import ExcelJS from 'exceljs';
import { promises as fs } from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import os from 'os';
import path from 'path';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

const createWorkbookHeader = (workbook: ExcelJS.Workbook) => {
  workbook.creator = 'Hệ thống quản lý sự kiện';
  workbook.lastModifiedBy = 'Hệ thống quản lý sự kiện';
  workbook.created = new Date();
  workbook.modified = new Date();
};

const createStyledHeaderRow = (
  sheet: ExcelJS.Worksheet,
  headers: string[]
): ExcelJS.Row => {
  const headerRow = sheet.addRow(headers);

  for (let i = 1; i <= headers.length; i++) {
    const cell = headerRow.getCell(i);
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' },
    };
    cell.alignment = { horizontal: 'center' };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
  }

  return headerRow;
};

const addDataRowsWithPercentage = (
  sheet: ExcelJS.Worksheet,
  data: EventStatistics[],
  sortDesc: boolean = true
) => {
  const sortedData = sortDesc
    ? [...data].sort((a, b) => b.value - a.value)
    : data;

  const total = sortedData.reduce((sum, item) => sum + item.value, 0);

  sortedData.forEach((item) => {
    const percentage = ((item.value / total) * 100).toFixed(2);
    const row = sheet.addRow([item.label, item.value, `${percentage}%`]);

    for (let i = 1; i <= 3; i++) {
      const cell = row.getCell(i);
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    }

    row.getCell(2).alignment = { horizontal: 'center' };
    row.getCell(3).alignment = { horizontal: 'right' };
  });

  // Add total row
  const totalRow = sheet.addRow(['Tổng cộng', total, '100%']);
  for (let i = 1; i <= 3; i++) {
    const cell = totalRow.getCell(i);
    cell.font = { bold: true };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD9E1F2' },
    };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
  }
  totalRow.getCell(2).alignment = { horizontal: 'center' };
  totalRow.getCell(3).alignment = { horizontal: 'right' };
};

const createOverviewSheet = (
  workbook: ExcelJS.Workbook,
  data: ExportStatisticsRequest
) => {
  const overviewSheet = workbook.addWorksheet('Tổng quan');
  overviewSheet.columns = [{ width: 40 }, { width: 70 }];

  // Title
  const titleRow = overviewSheet.addRow([
    `THỐNG KÊ SỰ KIỆN: ${data.eventName.toUpperCase()}`,
  ]);
  overviewSheet.mergeCells('A1:B1');
  titleRow.font = { bold: true, size: 16 };
  titleRow.alignment = { horizontal: 'center', vertical: 'top' };
  titleRow.height = 30;

  overviewSheet.addRow(['']);

  // Info header
  const infoHeaderRow = overviewSheet.addRow(['THÔNG TIN CHUNG', '']);
  overviewSheet.mergeCells('A3:B3');
  infoHeaderRow.getCell(1).font = { bold: true };
  infoHeaderRow.getCell(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFD9E1F2' },
  };
  infoHeaderRow.getCell(1).border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  };

  overviewSheet.addRow(['']);

  // Event info
  const eventInfo = [
    ['Tên sự kiện', data.eventName],
    ['Mô tả', data.description || 'N/A'],
    ['Địa điểm', data.zoneInfo?.zoneName || 'N/A'],
    ['Địa chỉ', data.zoneInfo?.street?.address || 'N/A'],
    [
      'Thời gian bắt đầu',
      new Date(data.dateRange.startDate).toLocaleDateString('vi-VN'),
    ],
    [
      'Thời gian kết thúc',
      new Date(data.dateRange.endDate).toLocaleDateString('vi-VN'),
    ],
  ];

  eventInfo.forEach((info) => {
    const row = overviewSheet.addRow(info);
    [1, 2].forEach((cellIndex) => {
      row.getCell(cellIndex).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    if (info[0] === 'Mô tả') {
      row.getCell(2).alignment = { wrapText: true, vertical: 'top' };
      row.height = 60;
    }
  });

  // Statistics section
  overviewSheet.addRow(['']);
  const statsRow = overviewSheet.getRow(overviewSheet.rowCount + 1);
  statsRow.getCell(1).value = 'TỔNG QUAN SỐ LIỆU';
  overviewSheet.mergeCells(`A${statsRow.number}:B${statsRow.number}`);
  statsRow.getCell(1).font = { bold: true };
  statsRow.getCell(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFD9E1F2' },
  };
  statsRow.getCell(1).border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  };
  statsRow.commit();

  overviewSheet.addRow(['']);

  // Total registrations
  const regRow = overviewSheet.addRow([
    'Tổng số đăng ký',
    data.statistics.totalRegistrations?.toString() || '0',
  ]);

  [1, 2].forEach((cellIndex) => {
    regRow.getCell(cellIndex).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
  });

  regRow.getCell(2).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE2EFDA' },
  };
  regRow.getCell(2).font = { bold: true };

  overviewSheet.addRow(['']);

  // Report time
  const timeRow = overviewSheet.addRow([
    'Báo cáo được tạo lúc:',
    new Date().toLocaleString('vi-VN'),
  ]);
  timeRow.font = { italic: true };
};

const createStatisticsSheet = (
  workbook: ExcelJS.Workbook,
  sheetName: string,
  headerLabel: string,
  data: EventStatistics[]
) => {
  if (!data || data.length === 0) return;

  const sheet = workbook.addWorksheet(sheetName);
  sheet.columns = [{ width: 30 }, { width: 15 }, { width: 15 }];

  // Auto filter
  sheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: 3 },
  };

  // Header
  createStyledHeaderRow(sheet, [headerLabel, 'Số lượng', 'Tỷ lệ (%)']);

  // Data rows
  addDataRowsWithPercentage(sheet, data);
};

const createSummarySheet = (
  workbook: ExcelJS.Workbook,
  data: ExportStatisticsRequest
) => {
  const summarySheet = workbook.addWorksheet('Tổng hợp');

  summarySheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: 4 },
  };

  summarySheet.columns = [
    { width: 15 },
    { width: 25 },
    { width: 15 },
    { width: 15 },
  ];

  // Title
  const summaryTitleRow = summarySheet.addRow(['TỔNG HỢP SỐ LIỆU']);
  summarySheet.mergeCells('A1:D1');
  summaryTitleRow.getCell(1).font = { bold: true, size: 16 };
  summaryTitleRow.getCell(1).alignment = {
    horizontal: 'center',
    vertical: 'middle',
  };
  summaryTitleRow.height = 30;

  summarySheet.addRow(['']);

  // Header
  createStyledHeaderRow(summarySheet, [
    'Phân loại',
    'Dữ liệu',
    'Số lượng',
    'Tỷ lệ',
  ]);

  let currentRow = 4;

  // Helper function to add category data
  const addCategoryData = (
    categoryName: string,
    chartData: EventStatistics[]
  ) => {
    if (!chartData || chartData.length === 0) return;

    const firstRow = currentRow;
    const total = chartData.reduce((sum, item) => sum + item.value, 0);

    chartData.forEach((item, index) => {
      const percentage = ((item.value / total) * 100).toFixed(2);
      const rowData =
        index === 0
          ? [categoryName, item.label, item.value.toString(), `${percentage}%`]
          : ['', item.label, item.value.toString(), `${percentage}%`];

      const row = summarySheet.addRow(rowData);

      for (let i = 1; i <= 4; i++) {
        const cell = row.getCell(i);
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };

        if (i === 1 && index === 0) {
          cell.font = { bold: true };
        }
      }

      row.getCell(3).alignment = { horizontal: 'center' };
      row.getCell(4).alignment = { horizontal: 'right' };
      currentRow++;
    });

    if (chartData.length > 1) {
      summarySheet.mergeCells(`A${firstRow}:A${currentRow - 1}`);
    }

    summarySheet.addRow(['']);
    currentRow++;
  };

  // Add different categories
  const { customOptions, statistics } = data;

  if (!customOptions || customOptions.includeAge) {
    addCategoryData('Độ tuổi', statistics.ageChart);
  }

  if (!customOptions || customOptions.includeGender) {
    addCategoryData('Giới tính', statistics.genderChart);
  }

  if (!customOptions || customOptions.includeReference) {
    addCategoryData('Nguồn', statistics.referenceChart);
  }

  if (!customOptions || customOptions.includeAddress) {
    addCategoryData('Địa điểm', statistics.addressChart);
  }
};

const generateEmailContent = (data: ExportStatisticsRequest): string => {
  return `
    <h2>${data.emailSubject || `Thống kê sự kiện: ${data.eventName}`}</h2>
    <p>Kính gửi Ban tổ chức sự kiện,</p>
    ${data.emailMessage ? `<p>${data.emailMessage}</p>` : ''}
    <p>Đính kèm là thống kê chi tiết của sự kiện "<strong>${data.eventName}</strong>" với tổng số <strong>${data.statistics.totalRegistrations}</strong> người đăng ký tham gia.</p>
    <p><strong>Thông tin sự kiện:</strong></p>
    <ul>
      <li>Địa điểm: ${data.zoneInfo?.zoneName || 'N/A'}</li>
      <li>Thời gian: ${new Date(data.dateRange.startDate).toLocaleDateString('vi-VN')} - ${new Date(data.dateRange.endDate).toLocaleDateString('vi-VN')}</li>
    </ul>
    <p>Báo cáo được xuất tự động tại thời điểm: ${new Date().toLocaleString('vi-VN')}</p>
    <p>Trân trọng,<br>Hệ thống quản lý sự kiện</p>
  `;
};

export async function POST(
  req: NextRequest
): Promise<NextResponse<ExportStatisticsResponse>> {
  try {
    const requestData = (await req.json()) as ExportStatisticsRequest;

    const { eventId, eventName, statistics, organizerEmail, customOptions } =
      requestData;

    if (!organizerEmail) {
      return NextResponse.json(
        { success: false, message: 'Thiếu email người nhận' },
        { status: 400 }
      );
    }

    const workbook = new ExcelJS.Workbook();
    createWorkbookHeader(workbook);

    // Create sheets based on options
    if (!customOptions || customOptions.includeGeneral) {
      createOverviewSheet(workbook, requestData);
    }

    if (!customOptions || customOptions.includeAge) {
      createStatisticsSheet(
        workbook,
        'Phân bố độ tuổi',
        'Độ tuổi',
        statistics.ageChart
      );
    }

    if (!customOptions || customOptions.includeGender) {
      createStatisticsSheet(
        workbook,
        'Phân bố giới tính',
        'Giới tính',
        statistics.genderChart
      );
    }

    if (!customOptions || customOptions.includeReference) {
      createStatisticsSheet(
        workbook,
        'Nguồn tham khảo',
        'Nguồn tham khảo',
        statistics.referenceChart
      );
    }

    if (!customOptions || customOptions.includeAddress) {
      createStatisticsSheet(
        workbook,
        'Phân bố địa điểm',
        'Địa điểm',
        statistics.addressChart
      );
    }

    // Always create summary sheet
    createSummarySheet(workbook, requestData);

    // Generate file
    const fileName = `Thong_ke_su_kien_${eventId}_${Date.now()}.xlsx`;
    const tempDir = os.tmpdir();
    const filePath = path.join(tempDir, fileName);

    await workbook.xlsx.writeFile(filePath);

    // Send email
    const emailContent = generateEmailContent(requestData);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: organizerEmail,
      subject: requestData.emailSubject || `Thống kê sự kiện: ${eventName}`,
      html: emailContent,
      attachments: [
        {
          filename: fileName,
          path: filePath,
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    await fs.unlink(filePath);

    return NextResponse.json({
      success: true,
      message: 'Xuất thống kê thành công và đã gửi email',
      emailInfo: info.messageId,
    });
  } catch (error) {
    console.error('Export statistics error:', error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Có lỗi xảy ra khi xuất thống kê',
      },
      { status: 500 }
    );
  }
}
