export const getCurrentTime = (time) => {
  const t = new Date(time);
  let hour = t.getHours();
  const minutes = t.getMinutes();

  const meridian = hour >= 12 ? "PM" : "AM";

  hour = hour % 12 || 12;

  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

  return `${hour}:${formattedMinutes} ${meridian}`;
};

const getDate = (time) => {
  const messageDate = new Date(time);
  const today = new Date();
  const isToday = messageDate.toDateString() === today.toDateString();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const isYesterday = messageDate.toDateString() === yesterday.toDateString();
  return { messageDate, today, yesterday, isToday, isYesterday };
};

export const getDateLabel = (time) => {
  const { messageDate, today, yesterday, isToday, isYesterday } = getDate(time);
  if (isToday) return "Today";
  if (isYesterday) return "Yesterday";
  return messageDate.toLocaleDateString();
};

export const getCurrentDate = (time) => {
  if (!time) return "";
  const { messageDate, today, yesterday, isToday, isYesterday } = getDate(time);
  if (isToday) {
    const hours = String(messageDate.getHours()).padStart(2, "0");
    const minutes = String(messageDate.getMinutes()).padStart(2, "0");
    const timeString = `${hours}:${minutes}`;
    return timeString;
  }
  if (isYesterday) return "Yesterday";
  return messageDate.toLocaleDateString();
};

export const formatMessage = (message) => {
  if (message.length < 22) return message;
  else return message.slice(0, 22) + "...";
};
