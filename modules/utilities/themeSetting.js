export const handlerTheme = (isDaskMode) => {
    console.log("Theme ->", isDaskMode)
    const colors = {
      darkTheme: [
        {name: "white",value: "#3e3d3d"},
        {name: "white-light",value: "#000"},
        {name: "black",value: "#FFFFFF"},
        {name: "body",value: "#FFFFFF"},
      ],
      lightTheme: [
        {name: "white",value: "#F4F4F4"},
        {name: "white-light",value: "#FFFFFF"},
        {name: "black",value: "#000"},
        {name: "body",value: "#0e101a"}
      ],
    }; 
  
    if (isDaskMode) {
      document.documentElement.classList.add("clickup-settings__dark-mode");
      colors.darkTheme.forEach(color => document.documentElement.style.setProperty(`--${color.name}`, color.value));
    } else {
      colors.lightTheme.forEach(color => document.documentElement.style.setProperty(`--${color.name}`, color.value));
      document.documentElement.classList.remove("clickup-settings__dark-mode");
    }
};