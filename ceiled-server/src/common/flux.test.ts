import {
  determineCurrentFlux,
  currentFluxLevel,
  TimeOfDay,
  millisUntilNextFluxChange,
} from './flux';
import Color from './Color';

describe('determineCurrentFlux', () => {
  it('returns flux 4 after 07:00 and before 08:00', () => {
    const date = new Date();
    date.setHours(7, 0);
    expect(determineCurrentFlux(date)).toEqual(Color.FLUX4);
    date.setHours(7, 59);
    expect(determineCurrentFlux(date)).toEqual(Color.FLUX4);
  });

  it('returns flux 3 after 08:00 and before 08:30', () => {
    const date = new Date();
    date.setHours(8, 0);
    expect(determineCurrentFlux(date)).toEqual(Color.FLUX3);
    date.setHours(8, 29);
    expect(determineCurrentFlux(date)).toEqual(Color.FLUX3);
  });

  it('returns flux 2 after 08:30 and before 09:00', () => {
    const date = new Date();
    date.setHours(8, 30);
    expect(determineCurrentFlux(date)).toEqual(Color.FLUX2);
    date.setHours(8, 59);
    expect(determineCurrentFlux(date)).toEqual(Color.FLUX2);
  });

  it('returns flux 1 after 09:00 and before 09:30', () => {
    const date = new Date();
    date.setHours(9, 0);
    expect(determineCurrentFlux(date)).toEqual(Color.FLUX1);
    date.setHours(9, 29);
    expect(determineCurrentFlux(date)).toEqual(Color.FLUX1);
  });

  it('returns white after 9:30 and before 20:00', () => {
    const date = new Date();
    date.setHours(9, 30);
    expect(determineCurrentFlux(date)).toEqual(Color.WHITE);
    date.setHours(19, 59);
    expect(determineCurrentFlux(date)).toEqual(Color.WHITE);
  });

  it('returns flux 1 after 20:00 and before 22:00', () => {
    const date = new Date();
    date.setHours(20, 0);
    expect(determineCurrentFlux(date)).toEqual(Color.FLUX1);
    date.setHours(21, 59);
    expect(determineCurrentFlux(date)).toEqual(Color.FLUX1);
  });

  it('returns flux 2 after 22:00 and before 00:00', () => {
    const date = new Date();
    date.setHours(22, 0);
    expect(determineCurrentFlux(date)).toEqual(Color.FLUX2);
    date.setHours(23, 59);
    expect(determineCurrentFlux(date)).toEqual(Color.FLUX2);
  });

  it('returns flux 3 after 00:00 and before 01:00', () => {
    const date = new Date();
    date.setHours(0, 0);
    expect(determineCurrentFlux(date)).toEqual(Color.FLUX3);
    date.setHours(0, 59);
    expect(determineCurrentFlux(date)).toEqual(Color.FLUX3);
  });

  it('returns flux 4 after 01:00 and before 02:00', () => {
    const date = new Date();
    date.setHours(1, 0);
    expect(determineCurrentFlux(date)).toEqual(Color.FLUX4);
    date.setHours(1, 59);
    expect(determineCurrentFlux(date)).toEqual(Color.FLUX4);
  });

  it('returns flux 5 after 02:00 and before 07:00', () => {
    const date = new Date();
    date.setHours(2, 0);
    expect(determineCurrentFlux(date)).toEqual(Color.FLUX5);
    date.setHours(6, 59);
    expect(determineCurrentFlux(date)).toEqual(Color.FLUX5);
  });
});

describe('currentFluxLevel', () => {
  it('returns flux 4 after 07:00 and before 08:00', () => {
    const date = new Date();
    date.setHours(7, 0);
    expect(currentFluxLevel(date)).toEqual(4);
    date.setHours(7, 59);
    expect(currentFluxLevel(date)).toEqual(4);
  });

  it('returns flux 3 after 08:00 and before 08:30', () => {
    const date = new Date();
    date.setHours(8, 0);
    expect(currentFluxLevel(date)).toEqual(3);
    date.setHours(8, 29);
    expect(currentFluxLevel(date)).toEqual(3);
  });

  it('returns flux 2 after 08:30 and before 09:00', () => {
    const date = new Date();
    date.setHours(8, 30);
    expect(currentFluxLevel(date)).toEqual(2);
    date.setHours(8, 59);
    expect(currentFluxLevel(date)).toEqual(2);
  });

  it('returns flux 1 after 09:00 and before 09:30', () => {
    const date = new Date();
    date.setHours(9, 0);
    expect(currentFluxLevel(date)).toEqual(1);
    date.setHours(9, 29);
    expect(currentFluxLevel(date)).toEqual(1);
  });

  it('returns white after 9:30 and before 20:00', () => {
    const date = new Date();
    date.setHours(9, 30);
    expect(currentFluxLevel(date)).toEqual(0);
    date.setHours(19, 59);
    expect(currentFluxLevel(date)).toEqual(0);
  });

  it('returns flux 1 after 20:00 and before 22:00', () => {
    const date = new Date();
    date.setHours(20, 0);
    expect(currentFluxLevel(date)).toEqual(1);
    date.setHours(21, 59);
    expect(currentFluxLevel(date)).toEqual(1);
  });

  it('returns flux 2 after 22:00 and before 00:00', () => {
    const date = new Date();
    date.setHours(22, 0);
    expect(currentFluxLevel(date)).toEqual(2);
    date.setHours(23, 59);
    expect(currentFluxLevel(date)).toEqual(2);
  });

  it('returns flux 3 after 00:00 and before 01:00', () => {
    const date = new Date();
    date.setHours(0, 0);
    expect(currentFluxLevel(date)).toEqual(3);
    date.setHours(0, 59);
    expect(currentFluxLevel(date)).toEqual(3);
  });

  it('returns flux 4 after 01:00 and before 02:00', () => {
    const date = new Date();
    date.setHours(1, 0);
    expect(currentFluxLevel(date)).toEqual(4);
    date.setHours(1, 59);
    expect(currentFluxLevel(date)).toEqual(4);
  });

  it('returns flux 5 after 02:00 and before 07:00', () => {
    const date = new Date();
    date.setHours(2, 0);
    expect(currentFluxLevel(date)).toEqual(5);
    date.setHours(6, 59);
    expect(currentFluxLevel(date)).toEqual(5);
  });
});

describe('millisUntilNextFluxChange', () => {
  it('returns 30 mins at 19:30', () => {
    const date = new Date();
    date.setHours(19, 30, 0, 0);
    expect(millisUntilNextFluxChange(date)).toEqual(30 * 60 * 1000);
  });

  it('returns 30 mins at 21:30', () => {
    const date = new Date();
    date.setHours(21, 30, 0, 0);
    expect(millisUntilNextFluxChange(date)).toEqual(30 * 60 * 1000);
  });

  it('returns 1 mins at 21:59', () => {
    const date = new Date();
    date.setHours(21, 59, 0, 0);
    expect(millisUntilNextFluxChange(date)).toEqual(60 * 1000);
  });

  it('returns 30 mins at 00:30', () => {
    const date = new Date();
    date.setHours(0, 30, 0, 0);
    expect(millisUntilNextFluxChange(date)).toEqual(30 * 60 * 1000);
  });

  it('returns 0 mins at 22:00', () => {
    const date = new Date();
    date.setHours(22, 0, 0, 0);
    expect(millisUntilNextFluxChange(date)).toEqual(0);
  });

  it('returns next time, even when just past last change', () => {
    const date = new Date();
    date.setHours(22, 0, 0, 1);
    expect(millisUntilNextFluxChange(date)).toEqual(2 * 60 * 60 * 1000 - 1);

    date.setHours(22, 0, 1, 0);
    expect(millisUntilNextFluxChange(date)).toEqual(2 * 60 * 60 * 1000 - 1000);

    date.setHours(22, 1, 0, 0);
    expect(millisUntilNextFluxChange(date)).toEqual(2 * 60 * 60 * 1000 - 60000);
  });
});
