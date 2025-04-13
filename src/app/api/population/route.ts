import { personService } from '@/services/personService';
import { NextResponse } from 'next/server';

/**
 * Converts a month number to its localized name in Vietnamese
 * @param month - Month number (1-12)
 * @returns Vietnamese month name
 */
function getMonthName(month: number): string {
  const months = [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12',
  ];
  return months[month - 1];
}

/**
 * Determines which quarter a month belongs to
 * @param month - Month number (1-12)
 * @returns Quarter number (1-4)
 */
function getQuarterFromMonth(month: number): number {
  return Math.ceil(month / 3);
}

/**
 * Gets the three months that belong to a specific quarter
 * @param quarter - Quarter number (1-4)
 * @returns Array of month numbers in the quarter
 */
function getQuarterMonths(quarter: number): number[] {
  const startMonth = (quarter - 1) * 3 + 1;
  return [startMonth, startMonth + 1, startMonth + 2];
}

/**
 * Gets the six months that belong to a specific half-year
 * @param half - Half-year number (1 for first half, 2 for second half)
 * @returns Array of month numbers in the half-year
 */
function getHalfYearMonths(half: number): number[] {
  return half === 1 ? [1, 2, 3, 4, 5, 6] : [7, 8, 9, 10, 11, 12];
}

/**
 * Data point structure for population statistics
 */
interface PopulationDataPoint {
  month: number;
  monthName: string;
  gender: 'male' | 'female' | 'total';
  count: number;
  period: string;
}

/**
 * Structure defining a time period for querying data
 */
interface PeriodDefinition {
  year: number;
  months: number[];
  label: string;
}

/**
 * GET handler for the population API endpoint
 * This API provides population data for a specific year, with options to filter by quarter or half-year,
 * and to compare with previous periods.
 */
export async function GET(request: Request) {
  // Extract query parameters
  const url = new URL(request.url);
  const periodType = url.searchParams.get('periodType') || 'year'; // 'year', 'quarter', 'half'
  const compare = url.searchParams.get('compare') === 'true'; // Compare with previous period

  // Extract year parameter
  const yearParam = url.searchParams.get('year');
  let year = new Date().getFullYear(); // Default to current year

  if (yearParam) {
    const parsedYear = parseInt(yearParam);
    if (!isNaN(parsedYear)) {
      year = parsedYear;
    }
  }

  // Initialize current period to full year by default
  let currentPeriod: PeriodDefinition = {
    year,
    months: Array.from({ length: 12 }, (_, i) => i + 1), // All 12 months
    label: 'Năm ' + year,
  };

  let previousPeriod: PeriodDefinition | null = null;

  // Get current month and quarter for default values
  const currentMonth = new Date().getMonth() + 1; // Current month (1-12)
  const currentQuarter = getQuarterFromMonth(currentMonth);

  // Handle different period types
  if (periodType === 'quarter') {
    const quarter = parseInt(
      url.searchParams.get('quarter') || currentQuarter.toString()
    );

    // Validate quarter parameter
    if (quarter < 1 || quarter > 4) {
      return NextResponse.json(
        { error: 'Invalid quarter parameter (must be 1-4)' },
        { status: 400 }
      );
    }

    // Set current period to requested quarter
    currentPeriod = {
      year,
      months: getQuarterMonths(quarter),
      label: `Quý ${quarter} năm ${year}`,
    };

    // Set previous period for comparison if requested
    if (compare) {
      // If it's Q1, previous period is Q4 of previous year
      if (quarter === 1) {
        previousPeriod = {
          year: year - 1,
          months: getQuarterMonths(4),
          label: `Quý 4 năm ${year - 1}`,
        };
      } else {
        previousPeriod = {
          year,
          months: getQuarterMonths(quarter - 1),
          label: `Quý ${quarter - 1} năm ${year}`,
        };
      }
    }
  } else if (periodType === 'half') {
    const half = parseInt(
      url.searchParams.get('half') || (currentMonth <= 6 ? '1' : '2')
    );

    // Validate half parameter
    if (half !== 1 && half !== 2) {
      return NextResponse.json(
        { error: 'Invalid half parameter (must be 1 or 2)' },
        { status: 400 }
      );
    }

    // Set current period to requested half-year
    currentPeriod = {
      year,
      months: getHalfYearMonths(half),
      label: `${half === 1 ? '6 tháng đầu' : '6 tháng cuối'} năm ${year}`,
    };

    // Set previous period for comparison if requested
    if (compare) {
      if (half === 1) {
        previousPeriod = {
          year: year - 1,
          months: getHalfYearMonths(2),
          label: `6 tháng cuối năm ${year - 1}`,
        };
      } else {
        previousPeriod = {
          year,
          months: getHalfYearMonths(1),
          label: `6 tháng đầu năm ${year}`,
        };
      }
    }
  } else {
    // Full year period type
    if (compare) {
      previousPeriod = {
        year: year - 1,
        months: Array.from({ length: 12 }, (_, i) => i + 1),
        label: `Năm ${year - 1}`,
      };
    }
  }

  try {
    // Create promises for all months in the current period
    const currentPromises = currentPeriod.months.map((month) =>
      personService.monthlyPopulation(currentPeriod.year, month)
    );

    // Create promises for all months in the previous period if comparison is requested
    const previousPromises = previousPeriod
      ? previousPeriod.months.map((month) =>
          personService.monthlyPopulation(previousPeriod!.year, month)
        )
      : [];

    // Wait for all promises to complete
    const [currentResults, previousResults] = await Promise.all([
      Promise.all(currentPromises),
      previousPeriod ? Promise.all(previousPromises) : Promise.resolve([]),
    ]);

    const formattedData: PopulationDataPoint[] = [];

    // Process current period data
    currentResults.forEach((data, index) => {
      const month = currentPeriod.months[index];
      const monthName = getMonthName(month);

      if (data.success) {
        // Add male data
        formattedData.push({
          month,
          monthName,
          gender: 'male',
          count: data.statistics.male,
          period: 'current',
        });

        // Add female data
        formattedData.push({
          month,
          monthName,
          gender: 'female',
          count: data.statistics.female,
          period: 'current',
        });

        // Add total data
        formattedData.push({
          month,
          monthName,
          gender: 'total',
          count: data.statistics.total,
          period: 'current',
        });
      } else {
        // Handle error case with default values
        formattedData.push({
          month,
          monthName,
          gender: 'male',
          count: 0,
          period: 'current',
        });

        formattedData.push({
          month,
          monthName,
          gender: 'female',
          count: 0,
          period: 'current',
        });

        formattedData.push({
          month,
          monthName,
          gender: 'total',
          count: 0,
          period: 'current',
        });
      }
    });

    // Process previous period data if available
    if (previousPeriod) {
      previousResults.forEach((data, index) => {
        const month = previousPeriod!.months[index];
        const monthName = getMonthName(month);

        if (data.success) {
          // Add male data
          formattedData.push({
            month,
            monthName,
            gender: 'male',
            count: data.statistics.male,
            period: 'previous',
          });

          // Add female data
          formattedData.push({
            month,
            monthName,
            gender: 'female',
            count: data.statistics.female,
            period: 'previous',
          });

          // Add total data
          formattedData.push({
            month,
            monthName,
            gender: 'total',
            count: data.statistics.total,
            period: 'previous',
          });
        } else {
          // Handle error case with default values
          formattedData.push({
            month,
            monthName,
            gender: 'male',
            count: 0,
            period: 'previous',
          });

          formattedData.push({
            month,
            monthName,
            gender: 'female',
            count: 0,
            period: 'previous',
          });

          formattedData.push({
            month,
            monthName,
            gender: 'total',
            count: 0,
            period: 'previous',
          });
        }
      });
    }

    // Calculate aggregate statistics
    const currentTotal = currentResults.reduce(
      (sum, item) => sum + (item.success ? item.statistics.total : 0),
      0
    );

    const previousTotal =
      previousResults.length > 0
        ? previousResults.reduce(
            (sum, item) => sum + (item.success ? item.statistics.total : 0),
            0
          )
        : 0;

    // Calculate growth rate if previous data is available
    const growthRate =
      previousTotal > 0
        ? (((currentTotal - previousTotal) / previousTotal) * 100).toFixed(2)
        : null;

    return NextResponse.json({
      currentPeriod: {
        ...currentPeriod,
        total: currentTotal,
      },
      previousPeriod: previousPeriod
        ? {
            ...previousPeriod,
            total: previousTotal,
          }
        : null,
      compare,
      growthRate,
      data: formattedData,
    });
  } catch (error) {
    console.error('Error processing population data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch population data' },
      { status: 500 }
    );
  }
}
