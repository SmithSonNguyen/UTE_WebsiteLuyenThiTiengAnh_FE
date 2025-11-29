const formatDateToDDMMYY = (isoDateString) => {
  const date = new Date(isoDateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()); // Chỉ 2 chữ số cuối
  return `${day}/${month}/${year}`;
};

export default formatDateToDDMMYY;
