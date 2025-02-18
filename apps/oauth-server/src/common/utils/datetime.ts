import * as dayjs from 'dayjs'
import * as customParseFormat from 'dayjs/plugin/customParseFormat'
import * as duration from 'dayjs/plugin/duration'
import * as isBetween from 'dayjs/plugin/isBetween'
import * as isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import * as isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import * as isoWeek from 'dayjs/plugin/isoWeek'
import * as timezone from 'dayjs/plugin/timezone'
import * as utc from 'dayjs/plugin/utc'
import * as weekOfYear from 'dayjs/plugin/weekOfYear'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isBetween)
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)
dayjs.extend(duration)
dayjs.extend(customParseFormat)
dayjs.extend(isoWeek)
dayjs.extend(weekOfYear)

class DateTimeUtils {
  private readonly dayjs: dayjs.Dayjs

  private constructor(dayjs: dayjs.Dayjs) {
    this.dayjs = dayjs
  }

  static local(date?: dayjs.ConfigType, format?: dayjs.OptionType, locale?: string, strict?: boolean) {
    return new DateTimeUtils(dayjs(date, format, locale, strict))
  }

  static utc(date?: dayjs.ConfigType, format?: string, strict?: boolean) {
    return new DateTimeUtils(dayjs.utc(date, format, strict))
  }

  static tz(timezone?: string, keepLocalTime?: boolean) {
    return new DateTimeUtils(dayjs().tz(timezone, keepLocalTime))
  }

  static utcToLocalTime(date?: dayjs.ConfigType, timezone?: string) {
    const formatDate = dayjs.tz(date, timezone).format()
    return formatDate.replace(formatDate.charAt(19), function (x) {
      if (x === '+') return '-'
      if (x === '-') return '+'
      if (x === 'Z') return '+00:00'
      return x
    })
  }

  static duration(units: number) {
    return dayjs.duration(units)
  }

  static convertTZ(date?: dayjs.ConfigType, timezone?: string, keepLocalTime?: boolean) {
    return new DateTimeUtils(dayjs(date).tz(timezone, keepLocalTime))
  }

  static addTZ(date?: dayjs.ConfigType, timezone?: string) {
    return new DateTimeUtils(dayjs.tz(date, timezone))
  }

  static toisoString(date: dayjs.ConfigType): string {
    return dayjs(date).toISOString()
  }

  toDayjs(date: dayjs.ConfigType) {
    return dayjs(date)
  }

  clone() {
    return this.dayjs.clone()
  }

  isAfter(date: dayjs.ConfigType, unit?: dayjs.OpUnitType): boolean {
    return this.dayjs.isAfter(date, unit)
  }

  add(value: number, unit?: dayjs.ManipulateType): DateTimeUtils {
    return new DateTimeUtils(this.dayjs.add(value, unit))
  }

  format(template?: string): string {
    return this.dayjs.format(template)
  }

  subtract(value: number, unit?: dayjs.ManipulateType): DateTimeUtils {
    return new DateTimeUtils(this.dayjs.subtract(value, unit))
  }

  toISOString(): string {
    return this.dayjs.toISOString()
  }

  diff(date?: dayjs.ConfigType, unit?: dayjs.QUnitType | dayjs.OpUnitType, float?: boolean) {
    return this.dayjs.diff(date, unit, float)
  }

  year() {
    return this.dayjs.year()
  }

  month() {
    return this.dayjs.month()
  }

  date() {
    return this.dayjs.date()
  }

  day() {
    return this.dayjs.day()
  }

  hour() {
    return this.dayjs.hour()
  }

  minute() {
    return this.dayjs.minute()
  }

  second() {
    return this.dayjs.second()
  }

  isValid() {
    return this.dayjs.isValid()
  }

  unix() {
    return this.dayjs.unix()
  }

  isBetween(
    min: dayjs.ConfigType,
    max: dayjs.ConfigType,
    type?: dayjs.OpUnitType | null,
    inclusivity?: '()' | '[]' | '[)' | '(]'
  ): boolean {
    return this.dayjs.isBetween(min, max, type, inclusivity)
  }

  set(unit: dayjs.UnitType, value: number) {
    return this.dayjs.set(unit, value)
  }

  isSameOrBefore(date: dayjs.ConfigType, unit?: dayjs.OpUnitType): boolean {
    return this.dayjs.isSameOrBefore(date, unit)
  }

  isSameOrAfter(date: dayjs.ConfigType, unit?: dayjs.OpUnitType): boolean {
    return this.dayjs.isSameOrAfter(date, unit)
  }

  isSame(date: dayjs.ConfigType, unit?: dayjs.OpUnitType): boolean {
    return this.dayjs.isSame(date, unit)
  }

  startOf(unit: dayjs.OpUnitType) {
    return this.dayjs.startOf(unit)
  }

  valueOf() {
    return this.dayjs.valueOf()
  }

  endOf(unit: dayjs.OpUnitType) {
    return this.dayjs.endOf(unit)
  }

  toDate() {
    return this.dayjs.toDate()
  }

  isoWeek() {
    return this.dayjs.isoWeek()
  }

  week() {
    return this.dayjs.week()
  }
}

export default DateTimeUtils
