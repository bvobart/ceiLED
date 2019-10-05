/// <reference types="../typings" />
import Duration = require('duration');
import Color from './Color';

export class TimeOfDay {
  public hours: number;
  public minutes: number;

  constructor(hours: number, minutes: number) {
    this.hours = hours;
    this.minutes = minutes;
  }

  public isMore(other: TimeOfDay): boolean {
    return (
      this.hours > other.hours || (this.hours === other.hours && this.minutes >= other.minutes)
    );
  }

  public isLess(other: TimeOfDay): boolean {
    return this.hours < other.hours || (this.hours === other.hours && this.minutes < other.minutes);
  }

  /**
   * Returns the next Date on which this time of day occurs.
   * @param now Date from which point on to calculate the next time this time of day occurs.
   */
  public nextDate(now: Date): Date {
    const msUntil = now.getMilliseconds() === 0 ? 0 : 1000 - now.getMilliseconds();
    const secsUntil = (now.getSeconds() === 0 ? 0 : 60 - now.getSeconds()) + msUntil / 1000;
    const minsUntil = this.minutes - now.getMinutes() - secsUntil / 60;

    const hrsUntil = minsUntil < 0 ? this.hours - now.getHours() - 1 : this.hours - now.getHours();
    const nextDay = hrsUntil < 0 ? now.getDate() + 1 : now.getDate();

    return new Date(now.getFullYear(), now.getMonth(), nextDay, this.hours, this.minutes, 0, 0);
  }

  public isWithin(time: FluxTime): boolean {
    const start = time.start;
    if (time.end.hours < start.hours) {
      const end = new TimeOfDay(time.end.hours + 24, time.end.minutes);
      const thisNext = new TimeOfDay(this.hours + 24, this.minutes);

      if (this.isLess(start)) {
        return thisNext.isMore(start) && thisNext.isLess(end);
      } else {
        return this.isMore(start);
      }
    }
    return this.isMore(start) && this.isLess(time.end);
  }
}

interface FluxTime {
  start: TimeOfDay;
  end: TimeOfDay;
}

// TODO: make these configurable using some commands
const flux5: FluxTime = {
  start: new TimeOfDay(2, 0),
  end: new TimeOfDay(7, 0),
};

const flux4: FluxTime = {
  start: new TimeOfDay(1, 0),
  end: new TimeOfDay(8, 0),
};

const flux3: FluxTime = {
  start: new TimeOfDay(0, 0),
  end: new TimeOfDay(8, 30),
};

const flux2: FluxTime = {
  start: new TimeOfDay(22, 0),
  end: new TimeOfDay(9, 0),
};

const flux1: FluxTime = {
  start: new TimeOfDay(20, 0),
  end: new TimeOfDay(9, 30),
};

/**
 * Determines the current colour to use for flux calculation by the current time of day.
 * @param now the current time.
 *
 * From 20:00 to 21:00: flux 1
 * From 22:00 to 00:00: flux 2
 * From 00:00 to 01:00: flux 3
 * From 01:00 to 02:00: flux 4
 * From 02:00 to 07:00: flux 5
 * From 07:00 to 08:00: flux 4
 * From 08:00 to 08:30: flux 3
 * From 08:30 to 09:00: flux 2
 * From 09:00 to 09:30: flux 1
 */
export const determineCurrentFlux = (now: Date): Color => {
  const nowTime = new TimeOfDay(now.getHours(), now.getMinutes());

  // TODO: make these times configurable?
  if (nowTime.isWithin(flux5)) return Color.FLUX5;
  else if (nowTime.isWithin(flux4)) return Color.FLUX4;
  else if (nowTime.isWithin(flux3)) return Color.FLUX3;
  else if (nowTime.isWithin(flux2)) return Color.FLUX2;
  else if (nowTime.isWithin(flux1)) return Color.FLUX1;
  else return Color.WHITE;
};

export const currentFluxLevel = (now: Date): number => {
  const nowTime = new TimeOfDay(now.getHours(), now.getMinutes());

  // TODO: make these times configurable?
  if (nowTime.isWithin(flux5)) return 5;
  else if (nowTime.isWithin(flux4)) return 4;
  else if (nowTime.isWithin(flux3)) return 3;
  else if (nowTime.isWithin(flux2)) return 2;
  else if (nowTime.isWithin(flux1)) return 1;
  else return 0;
};

export const millisUntilNextFluxChange = (now: Date): number => {
  const timesUntil = [
    new Duration(now, flux5.start.nextDate(now)),
    new Duration(now, flux5.end.nextDate(now)),
    new Duration(now, flux4.start.nextDate(now)),
    new Duration(now, flux4.end.nextDate(now)),
    new Duration(now, flux3.start.nextDate(now)),
    new Duration(now, flux3.end.nextDate(now)),
    new Duration(now, flux2.start.nextDate(now)),
    new Duration(now, flux2.end.nextDate(now)),
    new Duration(now, flux1.start.nextDate(now)),
    new Duration(now, flux1.end.nextDate(now)),
  ];

  const nextTime = timesUntil.sort((one: Duration, two: Duration) => {
    return one.valueOf() - two.valueOf();
  })[0];
  return nextTime.valueOf();
};

export default determineCurrentFlux;
