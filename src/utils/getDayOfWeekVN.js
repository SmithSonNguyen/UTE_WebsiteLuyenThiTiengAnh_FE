const getDayOfWeekVN = (isoDateString) => {
  const date = new Date(isoDateString);
  const daysVN = [
    "Chủ Nhật",
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
  ];
  return daysVN[date.getDay()];
};

export default getDayOfWeekVN;
