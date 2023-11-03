// Funtion GET QA data
export const getDataFromObject = (object, value) => {
  if (!object.length) return "Unassigned";
  let data = "";
  object.forEach((item) => {
    const name = item[value] || item["name"];
    data += name + ", ";
  });

  return data.slice(0, -2);
}