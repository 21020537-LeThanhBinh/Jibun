export function formatDurationDetails(milliseconds: number): string {
  let result = [];

  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours == 1) {
    result.push(`${hours}hr`);
  } else if (hours > 1) {
    result.push(`${hours}hrs`);
  }

  if (minutes == 1) {
    result.push(`${minutes - hours * 60}mins`);
  } else if (minutes > 1) {
    result.push(`${minutes- hours * 60}mins`);
  }

  return result.join(', ');
}