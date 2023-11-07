// Funtion GET CUSTOM fIELD
export const getCustomField = (data, fieldName) =>{
  if (data.length < 1) return 0;

  fieldName = fieldName.toLowerCase();

  const field = data.find((item) => item.name.toLowerCase() === fieldName);
  if (!!field.value) {
    return field.value;
  }
  return 0;
}
