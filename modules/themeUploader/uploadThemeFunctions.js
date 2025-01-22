import { env } from "./env.data.js";

const { BASE_URL, FORMS_IDS:formsIds } = env;


export const goToUploadTheme = () =>{
  const uploadThemeUrl = chrome.runtime.getURL("windows/themeUploader.html");
  chrome.tabs.create({ url: uploadThemeUrl });
}

export const handlerForm = (form,loader,labelMessage) => {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formObject = Object.fromEntries(formData);
    // Loader
    loader.classList.add("active");
    labelMessage.classList.remove("susscess","error","active");

    // UPLOAD THEME
    const themeProcess = await handleUploadTheme(formObject);
    loader.classList.remove("active");
    handleMessage(labelMessage,themeProcess);
  });
};

const handleMessage = (labelMessage, themeProcess) => {
  if (themeProcess.error) {
    labelMessage.textContent = themeProcess.message;
    labelMessage.classList.add("error", "active");
    return;
  }

  labelMessage.textContent = themeProcess.message;
  labelMessage.classList.add("susscess", "active");
};

const handleUploadTheme = async (formData) => {
  const themeName = formData.themeName;
  const formatedThemeName = themeName.toLowerCase().replace(/\s+/g, "-");
  const accessToken = formData.accessToken;

  console.log(formatedThemeName)
  try {
    console.log("Process started...");

    // POST: Download theme 1
    console.log("dowloadTheme...");
    await fetch(`${BASE_URL}/api/github/download`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ destPath: formatedThemeName }),
    });

    // POST: Unzip theme 2
    console.log("Unzip theme...");
    await fetch(`${BASE_URL}/api/zip/unzip`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ folderPath: formatedThemeName }),
    });

    // POST: Create theme 3
    console.log("Create theme...");
    await fetch(`${BASE_URL}/api/zip/create-theme`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ themeName: formatedThemeName }),
    });

    // Migrate Forms 4
    console.log("Migrate Forms...");
    const migrateFormsResult = await migrateForms(themeName, accessToken);
    
    if(migrateFormsResult.error){
      return {
        error: true,
        message: "Something went wrong. Please try again"
      };
    }

    // Migrate Forms 5
    console.log("Replace FormId In Files...");
    await replaceFormIdInFiles(
      formatedThemeName,
      migrateFormsResult,
      themeName
    );

    // POST: Zip theme 6
    console.log("Zip theme ...");
    await fetch(`${BASE_URL}/api/zip/zip-theme`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ folderPath: formatedThemeName }),
    });

    // POST: Upload theme with Authorization header 7
    console.log("Upload theme with Authorization header ...");
    await fetch(`${BASE_URL}/api/zip/upload-theme`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ folderPath: formatedThemeName }),
    });

    console.log("Process finished");
    return { error: false, message: " Horizon Theme uploaded successfully" };

  } catch (error) {
    const errorMessage = error.message || "An error occurred";
    console.log(errorMessage);
    return "error";
  } finally {
    await fetch(`${BASE_URL}/api/file/clear-files`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        folderPath: formatedThemeName,
      }),
    });
  }
};

const migrateForms = async (themeName,accessToken) => {
  try {
    const forms = [];
    const migratedForms = [];
  
    for (const id of formsIds) {
      const response = await fetch(`${BASE_URL}/api/form/get-data?formId=${id}`, {
        method: "GET",
      });
      const responseData = await response.json();
  
      if (responseData.success) {
        const formObject = {
          ...responseData.data,
          name: `${responseData.data.name} - ${themeName}`,
        };
        delete formObject.guid;
        delete formObject.portableKey;
        forms.push(formObject);
      }
    }
  
    for (const formData of forms) {
      const response = await fetch(`${BASE_URL}/api/form/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formData,
          accessToken,
        }),
      });
      const responseData = await response.json();
  
      if (responseData.success) {
        migratedForms.push(responseData.data);
      }
    }
  
    const migratedIds = migratedForms.map((form) => {
      return {
        name: form.name,
        guid: form.guid,
      };
    });
  
    return migratedIds;
  } catch (error) {
    if (error.response) {
      console.log(error.response.data.error)
    } else {
      console.log("An unexpected error occurred.");
    }
    return { error: true, message: error.message };
  }  
};

const replaceFormIdInFiles = async (folderName, migratedForms, themeName) => {
  try {
    const landingForm = migratedForms.find((form) => form.name === `Onboarding Landing - ${themeName}`);
    const blogForm = migratedForms.find((form) => form.name === `Blog - Subscription Form - ${themeName}`);
    console.log(landingForm);
    console.log(blogForm);

    // Reemplazar ID del formulario de tipo "landing"
    let response = await fetch(`${BASE_URL}/api/file/replace-form-id`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        formId: landingForm.guid,
        folderName,
        type: "landing",
      }),
    });

    if (!response.ok) {
      throw new Error(`Error in landing form replacement: ${response.statusText}`);
    }

    // Reemplazar ID del formulario de tipo "blog"
    response = await fetch(`${BASE_URL}/api/file/replace-form-id`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        formId: blogForm.guid,
        folderName,
        type: "blog",
      }),
    });

    if (!response.ok) {
      throw new Error(`Error in blog form replacement: ${response.statusText}`);
    }
  } catch (error) {
    throw new Error(`Error replacing formId in files: ${error.message}`);
  }
};