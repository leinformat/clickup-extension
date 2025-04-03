export const formatText = (text) =>{
  // Find the start and end text
  const startIndextText = text?.toLowerCase().indexOf("what we need to do");
  const endIndextText = text?.toLowerCase().indexOf("platform");

  if (startIndextText !== -1) {
    let newText = text?.substring(startIndextText, endIndextText);
    // Replace line breaks with <br> tags
    newText = newText?.replace(/\n/g, "<br>");
    // Remove asterisks around the text
    newText = newText?.replace(/\*+/g, "");
    return newText;
  }
  return "Open the Task to more information";
}
