package com.example.leave.util;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public final class DateUtils {
  private DateUtils() {}

  public static double calculateLeaveDays(LocalDate startDate, LocalDate endDate, boolean halfDay) {
    if (startDate.isAfter(endDate)) {
      throw new IllegalArgumentException("Start date must be before end date");
    }
    if (halfDay) {
      return 0.5;
    }
    long days = ChronoUnit.DAYS.between(startDate, endDate) + 1;
    double total = 0.0;
    for (int i = 0; i < days; i++) {
      LocalDate date = startDate.plusDays(i);
      if (!isWeekend(date)) {
        total += 1.0;
      }
    }
    return total;
  }

  public static boolean isWeekend(LocalDate date) {
    DayOfWeek day = date.getDayOfWeek();
    return day == DayOfWeek.SATURDAY || day == DayOfWeek.SUNDAY;
  }
}
