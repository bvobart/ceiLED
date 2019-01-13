import Color from './Color';

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
  const nowHr: number = now.getHours();
  const nowMins: number = now.getMinutes();

  // TODO: make these times configurable?
  if (nowHr >= 2 && nowHr < 7) return Color.FLUX5;
  else if (nowHr >= 1 && nowHr < 8) return Color.FLUX4;
  else if ((nowHr >= 0 && nowHr < 8) || (nowHr === 8 && nowMins < 30)) return Color.FLUX3;
  else if (nowHr < 9 || nowHr >= 22) return Color.FLUX2;
  else if (nowHr < 9 || (nowHr === 9 && nowMins < 30) || nowHr >= 20) return Color.FLUX1;
  else return Color.WHITE;
};

export default determineCurrentFlux;
