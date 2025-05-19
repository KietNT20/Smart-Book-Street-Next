import { Zone } from '@/types/zone-types';
import ExcelJS from 'exceljs';
import { promises as fs } from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import os from 'os';
import path from 'path';

interface EventStatistics {
  label: string;
  value: number;
}

interface EventStatisticsData {
  eventId: string;
  eventName: string;
  description: string;
  statistics: {
    ageChart?: EventStatistics[];
    genderChart?: EventStatistics[];
    referenceChart?: EventStatistics[];
    addressChart?: EventStatistics[];
    totalRegistrations?: number;
  };
  zoneInfo: Zone;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  organizerEmail: string;
  emailSubject: string;
  emailMessage: string;
  customOptions: any;
}

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
      description,
      statistics,
      zoneInfo,
      dateRange,
      organizerEmail,
      emailSubject,
      emailMessage,
      customOptions,
    } = data as EventStatisticsData;

    if (!organizerEmail) {
      return NextResponse.json(
        { success: false, message: 'Thiếu email người nhận' },
        { status: 400 }
      );
    }

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Hệ thống quản lý sự kiện';
    workbook.lastModifiedBy = 'Hệ thống quản lý sự kiện';
    workbook.created = new Date();
    workbook.modified = new Date();

    // ---------- TRANG TỔNG QUAN ----------
    if (!customOptions || customOptions.includeGeneral) {
      const overviewSheet = workbook.addWorksheet('Tổng quan');

      overviewSheet.columns = [{ width: 40 }, { width: 70 }];

      const titleRow = overviewSheet.addRow([
        `THỐNG KÊ SỰ KIỆN: ${eventName.toUpperCase()}`,
      ]);
      overviewSheet.mergeCells('A1:B1');
      titleRow.font = { bold: true, size: 16 };
      titleRow.alignment = { horizontal: 'center', vertical: 'top' };
      titleRow.height = 30;

      overviewSheet.addRow(['']);

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

      const rowData = [
        ['Tên sự kiện', eventName],
        ['Mô tả', description || 'N/A'],
        ['Địa điểm', zoneInfo?.zoneName || 'N/A'],
        ['Địa chỉ', zoneInfo?.street?.address || 'N/A'],
        [
          'Thời gian bắt đầu',
          new Date(dateRange.startDate).toLocaleDateString('vi-VN'),
        ],
        [
          'Thời gian kết thúc',
          new Date(dateRange.endDate).toLocaleDateString('vi-VN'),
        ],
      ];

      let rowIndex = 5;
      rowData.forEach((data) => {
        const row = overviewSheet.addRow(data);

        row.getCell(1).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };

        row.getCell(2).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };

        if (data[0] === 'Mô tả') {
          row.getCell(2).alignment = { wrapText: true, vertical: 'top' };
          row.height = 60;
        }

        rowIndex++;
      });

      overviewSheet.addRow(['']);
      rowIndex++;

      const statsHeaderRow = overviewSheet.addRow(['TỔNG QUAN SỐ LIỆU', '']);
      overviewSheet.mergeCells(`A${rowIndex}:B${rowIndex}`);
      statsHeaderRow.getCell(1).font = { bold: true };
      statsHeaderRow.getCell(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD9E1F2' },
      };
      statsHeaderRow.getCell(1).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };

      overviewSheet.addRow(['']);
      rowIndex += 2;

      const regRow = overviewSheet.addRow([
        'Tổng số đăng ký',
        statistics.totalRegistrations?.toString() || '0',
      ]);

      regRow.getCell(1).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };

      regRow.getCell(2).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };

      regRow.getCell(2).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE2EFDA' },
      };
      regRow.getCell(2).font = { bold: true };

      overviewSheet.addRow(['']);
      rowIndex += 2;

      const timeRow = overviewSheet.addRow([
        'Báo cáo được tạo lúc:',
        new Date().toLocaleString('vi-VN'),
      ]);
      timeRow.font = { italic: true };
    }

    // ---------- PHÂN BỐ ĐỘ TUỔI ----------
    if (
      (!customOptions || customOptions.includeAge) &&
      statistics.ageChart &&
      statistics.ageChart.length > 0
    ) {
      const ageSheet = workbook.addWorksheet('Phân bố độ tuổi');
      // Sort data by desc
      const sortedAgeData = [...statistics.ageChart].sort(
        (a, b) => b.value - a.value
      );

      ageSheet.columns = [{ width: 20 }, { width: 15 }, { width: 15 }];

      const headerRow = ageSheet.addRow(['Độ tuổi', 'Số lượng', 'Tỷ lệ (%)']);

      ageSheet.autoFilter = {
        from: { row: 1, column: 1 },
        to: { row: 1, column: 3 },
      };

      for (let i = 1; i <= 3; i++) {
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

      let totalAge = 0;
      sortedAgeData.forEach((item: EventStatistics) => {
        totalAge += item.value;
      });

      sortedAgeData.forEach((item: EventStatistics) => {
        const percentage = ((item.value / totalAge) * 100).toFixed(2);
        const row = ageSheet.addRow([item.label, item.value, `${percentage}%`]);

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

      const totalRow = ageSheet.addRow(['Tổng cộng', totalAge, '100%']);

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
    }

    // ---------- PHÂN BỐ GIỚI TÍNH ----------
    if (
      (!customOptions || customOptions.includeGender) &&
      statistics.genderChart &&
      statistics.genderChart.length > 0
    ) {
      const genderSheet = workbook.addWorksheet('Phân bố giới tính');
      const sortedGenderData = [...statistics.genderChart].sort(
        (a, b) => b.value - a.value
      );

      genderSheet.columns = [{ width: 20 }, { width: 15 }, { width: 15 }];

      genderSheet.autoFilter = {
        from: { row: 1, column: 1 },
        to: { row: 1, column: 3 },
      };

      const headerRow = genderSheet.addRow([
        'Giới tính',
        'Số lượng',
        'Tỷ lệ (%)',
      ]);

      for (let i = 1; i <= 3; i++) {
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

      let totalGender = 0;
      sortedGenderData.forEach((item: EventStatistics) => {
        totalGender += item.value;
      });

      sortedGenderData.forEach((item: EventStatistics) => {
        const percentage = ((item.value / totalGender) * 100).toFixed(2);
        const row = genderSheet.addRow([
          item.label,
          item.value,
          `${percentage}%`,
        ]);

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

      const totalRow = genderSheet.addRow(['Tổng cộng', totalGender, '100%']);

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
    }

    // ---------- NGUỒN THAM KHẢO ----------
    if (
      (!customOptions || customOptions.includeReference) &&
      statistics.referenceChart &&
      statistics.referenceChart.length > 0
    ) {
      const refSheet = workbook.addWorksheet('Nguồn tham khảo');
      const sortedRefData = [...statistics.referenceChart].sort(
        (a, b) => b.value - a.value
      );

      refSheet.columns = [{ width: 30 }, { width: 15 }, { width: 15 }];

      refSheet.autoFilter = {
        from: { row: 1, column: 1 },
        to: { row: 1, column: 3 },
      };

      const headerRow = refSheet.addRow([
        'Nguồn tham khảo',
        'Số lượng',
        'Tỷ lệ (%)',
      ]);

      for (let i = 1; i <= 3; i++) {
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

      let totalRef = 0;
      sortedRefData.forEach((item: EventStatistics) => {
        totalRef += item.value;
      });

      sortedRefData.forEach((item: EventStatistics) => {
        const percentage = ((item.value / totalRef) * 100).toFixed(2);
        const row = refSheet.addRow([item.label, item.value, `${percentage}%`]);

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

      const totalRow = refSheet.addRow(['Tổng cộng', totalRef, '100%']);

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
    }

    // ---------- PHÂN BỐ ĐỊA ĐIỂM ----------
    if (
      (!customOptions || customOptions.includeAddress) &&
      statistics.addressChart &&
      statistics.addressChart.length > 0
    ) {
      const addressSheet = workbook.addWorksheet('Phân bố địa điểm');
      const sortedAddressData = [...statistics.addressChart].sort(
        (a, b) => b.value - a.value
      );

      addressSheet.columns = [{ width: 30 }, { width: 15 }, { width: 15 }];

      const headerRow = addressSheet.addRow([
        'Địa điểm',
        'Số lượng',
        'Tỷ lệ (%)',
      ]);

      addressSheet.autoFilter = {
        from: { row: 1, column: 1 },
        to: { row: 1, column: 3 },
      };

      for (let i = 1; i <= 3; i++) {
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

      let totalAddress = 0;
      sortedAddressData.forEach((item: EventStatistics) => {
        totalAddress += item.value;
      });

      sortedAddressData.forEach((item: EventStatistics) => {
        const percentage = ((item.value / totalAddress) * 100).toFixed(2);
        const row = addressSheet.addRow([
          item.label,
          item.value,
          `${percentage}%`,
        ]);

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

      const totalRow = addressSheet.addRow(['Tổng cộng', totalAddress, '100%']);

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
    }

    // ---------- TRANG TỔNG HỢP ----------
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

    const summaryTitleRow = summarySheet.addRow(['TỔNG HỢP SỐ LIỆU']);
    summarySheet.mergeCells('A1:D1');
    summaryTitleRow.getCell(1).font = { bold: true, size: 16 };
    summaryTitleRow.getCell(1).alignment = {
      horizontal: 'center',
      vertical: 'middle',
    };
    summaryTitleRow.height = 30;

    summarySheet.addRow(['']);

    const summaryHeaderRow = summarySheet.addRow([
      'Phân loại',
      'Dữ liệu',
      'Số lượng',
      'Tỷ lệ',
    ]);

    for (let i = 1; i <= 4; i++) {
      const cell = summaryHeaderRow.getCell(i);
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

    let currentRow = 4;

    if (
      (!customOptions || customOptions.includeAge) &&
      statistics.ageChart &&
      statistics.ageChart.length > 0
    ) {
      const firstAgeRow = currentRow;
      let totalAge = 0;
      statistics.ageChart.forEach(
        (item: EventStatistics) => (totalAge += item.value)
      );

      statistics.ageChart.forEach((item: EventStatistics, index: number) => {
        const percentage = ((item.value / totalAge) * 100).toFixed(2);
        const data =
          index === 0
            ? ['Độ tuổi', item.label, item.value.toString(), `${percentage}%`]
            : ['', item.label, item.value.toString(), `${percentage}%`];

        const row = summarySheet.addRow(data);

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

      if (statistics.ageChart.length > 1) {
        summarySheet.mergeCells(`A${firstAgeRow}:A${currentRow - 1}`);
      }

      summarySheet.addRow(['']);
      currentRow++;
    }

    if (
      (!customOptions || customOptions.includeGender) &&
      statistics.genderChart &&
      statistics.genderChart.length > 0
    ) {
      const firstGenderRow = currentRow;
      let totalGender = 0;
      statistics.genderChart.forEach(
        (item: EventStatistics) => (totalGender += item.value)
      );

      statistics.genderChart.forEach((item: EventStatistics, index: number) => {
        const percentage = ((item.value / totalGender) * 100).toFixed(2);
        const data =
          index === 0
            ? ['Giới tính', item.label, item.value.toString(), `${percentage}%`]
            : ['', item.label, item.value.toString(), `${percentage}%`];

        const row = summarySheet.addRow(data);

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

      if (statistics.genderChart.length > 1) {
        summarySheet.mergeCells(`A${firstGenderRow}:A${currentRow - 1}`);
      }

      summarySheet.addRow(['']);
      currentRow++;
    }

    if (
      (!customOptions || customOptions.includeReference) &&
      statistics.referenceChart &&
      statistics.referenceChart.length > 0
    ) {
      const firstRefRow = currentRow;
      let totalRef = 0;
      statistics.referenceChart.forEach(
        (item: EventStatistics) => (totalRef += item.value)
      );

      statistics.referenceChart.forEach(
        (item: EventStatistics, index: number) => {
          const percentage = ((item.value / totalRef) * 100).toFixed(2);
          const data =
            index === 0
              ? ['Nguồn', item.label, item.value.toString(), `${percentage}%`]
              : ['', item.label, item.value.toString(), `${percentage}%`];

          const row = summarySheet.addRow(data);

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
        }
      );

      if (statistics.referenceChart.length > 1) {
        summarySheet.mergeCells(`A${firstRefRow}:A${currentRow - 1}`);
      }
    }

    // Create file name with timestamp to avoid duplicate
    const fileName = `Thong_ke_su_kien_${eventId}_${Date.now()}.xlsx`;
    const tempDir = os.tmpdir();
    const filePath = path.join(tempDir, fileName);

    await workbook.xlsx.writeFile(filePath);

    const emailContent = `
      <h2>${emailSubject || `Thống kê sự kiện: ${eventName}`}</h2>
      <p>Kính gửi Ban tổ chức sự kiện,</p>
      ${emailMessage ? `<p>${emailMessage}</p>` : ''}
      <p>Đính kèm là thống kê chi tiết của sự kiện "<strong>${eventName}</strong>" với tổng số <strong>${statistics.totalRegistrations}</strong> người đăng ký tham gia.</p>
      <p><strong>Thông tin sự kiện:</strong></p>
      <ul>
        <li>Địa điểm: ${zoneInfo?.zoneName || 'N/A'}</li>
        <li>Thời gian: ${new Date(dateRange.startDate).toLocaleDateString('vi-VN')} - ${new Date(dateRange.endDate).toLocaleDateString('vi-VN')}</li>
      </ul>
      <p>Báo cáo được xuất tự động tại thời điểm: ${new Date().toLocaleString('vi-VN')}</p>
      <p>Trân trọng,<br>Hệ thống quản lý sự kiện</p>
    `;

    // Send email with attachment
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: organizerEmail,
      subject: emailSubject || `Thống kê sự kiện: ${eventName}`,
      html: emailContent,
      attachments: [
        {
          filename: fileName,
          path: filePath,
        },
      ],
    };
    // Send email
    const info = await transporter.sendMail(mailOptions);

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
