export function getTimeDifference(date: string): string {
  function formatTimeDifference(difference: number): string {
    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const years = Math.floor(days / 365);

    if (years > 0) {
      return `${years} 年`;
    } else if (days > 0) {
      return `${days} 天`;
    } else if (hours > 0) {
      return `${hours} 小時`;
    } else if (minutes > 0) {
      return `${minutes} 分鐘`;
    } else {
      return `${seconds} 秒`;
    }
  }

  const subDate = new Date(date);
  const now = new Date();
  const difference = now.getTime() - subDate.getTime();
  const formattedDifference = formatTimeDifference(difference);

  return formattedDifference;
}
