export const getCurrentTime = (time) => {
  const t = new Date(time);
  let hour = t.getHours();
  const minutes = t.getMinutes();

  const meridian = hour >= 12 ? "PM" : "AM";

  hour = hour % 12 || 12;

  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

  return `${hour}:${formattedMinutes} ${meridian}`;
};

export const getDateLabel = (time) => {
  const messageDate = new Date(time);

  const today = new Date();
  const isToday = messageDate.toDateString() === today.toDateString();

  if (isToday) return "Today";

  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const isYesterday = messageDate.toDateString() === yesterday.toDateString();

  if (isYesterday) return "Yesterday";

  return messageDate.toLocaleDateString();
};
