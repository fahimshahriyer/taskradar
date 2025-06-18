export const getRandomAngle = () => Math.random() * 2 * Math.PI;

export const polarToCartesian = (angle: number, radius: number) => ({
  x: radius * Math.cos(angle),
  y: radius * Math.sin(angle),
});

export const cartesianToPolar = (x: number, y: number) => ({
  angle: Math.atan2(y, x),
  radius: Math.sqrt(x * x + y * y),
});

export const getDaysFromNow = (date: Date) => {
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getDateFromDaysFromNow = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};
