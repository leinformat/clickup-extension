const handlerQaTextData = (data) => {
  const qaData = data;
  let qaDataText = "";
  qaData.forEach((qaItem) => {
    const fieldType = qaItem.username ? "qaByUsers" : "qaByTeam";
    if (fieldType === "qaByUsers") {
      qaDataText += `<a class="cu-mention" data-user="${qaItem.id}" data-name="${qaItem.username}" data-email="${qaItem.email}" data-notify="true" data-tag_id="7fb32774-a27d-4a44-876c-f909d047bd85" href="javascript: void;"></a>`;
    } else {
      qaDataText += `<a class="cu-mention__user-group" data-group_id="${qaItem.id}" data-name="${qaItem.name}" data-handle="${qaItem.handle}" data-tag_id="86d10f3e-c3e3-48da-ae77-c64135e46de0" href="javascript: void;"></a>`;
    }
  });
  return qaDataText;
};

// This is to Send on Slack
export const copyToSlack = async (data, node) => {
  //const regex = /^week \d+$/;
  //regex.test(str);
  const clients = {
    "support projects": {
      message: ":otf1: Support",
      internalName: "- Support Projects",
    },
    "week 1": {
      message: ":otf1: Onboarding",
      internalName: "- Hubspot Onboarding",
    },
    "week 2": {
      message: ":otf1: Onboarding",
      internalName: "- Hubspot Onboarding",
    },
    "week 3": {
      message: ":otf1: Onboarding",
      internalName: "- Hubspot Onboarding",
    },
    "week 4": {
      message: ":otf1: Onboarding",
      internalName: "- Hubspot Onboarding",
    },
  };
  const clientMessage = clients[data.subClient.toLowerCase()]?.message;
  const clientIntName = clients[data.subClient.toLowerCase()]?.internalName;

  //const client = data.subClient == 'Support Projects' ?  ;
  const comment = `<p><strong>Client: </strong>${
    !!clientMessage ? clientMessage : data.subClient
  } | ${data.client.replace(clientIntName, "")}</p>
                     <p><strong>URL: </strong>${data.url}</p>
                     <p><strong>Responsible: </strong>@${data.qa}</p>
                     <p><strong>Deliver date: </strong>Today or  Tomorrow, please :handshake:</p>
                     <p><strong>PM: <strong>@${data.pm}</p>`;
  try {
    const blobHtml = new Blob([comment], { type: "text/html" });
    const blobText = new Blob([comment], { type: "text/plain" });
    const data = [
      new ClipboardItem({
        ["text/plain"]: blobText,
        ["text/html"]: blobHtml,
      }),
    ];

    await navigator.clipboard.write(data);

    node.classList.remove("fa-beat");
    node
      .closest(".clickup-extension__copy-container")
      .classList.add("copy--ok");
    setTimeout(() => {
      node
        .closest(".clickup-extension__copy-container")
        .classList.remove("copy--ok");
    }, 200);
  } catch (error) {
    console.log("We've been an Error to copy Comment: " + error);
  }
};

// This is to Send on Clickup
export const copyEstimation = async (data, node) => {
  const allData = data.data;
  const customFields = data.customFields;
  const dataQA = data.qa;
  let customFieldsText = "";
  
  // QA Fields Text
  const qaDataText = handlerQaTextData(dataQA);

  // Custom Fields Text
  Object.keys(customFields).forEach((key) => {
    const fieldType = key;
    if (fieldType === "groupFields") {
      customFieldsText += `<li class="ql-list-item ql-indent-1" data-list="bullet"><strong>${
        customFields[key][0].fieldName
      } ${
        customFields[key].some((field) => field.name) ? "✅" : "❌"
      } </strong></li>`;
    } else {
      customFields[key].forEach((field) => {
        customFieldsText += `<li class="ql-list-item ql-indent-1" data-list="bullet"><strong>${
          field.fieldName
        } ${field.name ? "✅" : "❌"} </strong></li>`;
      });
    }
  });

  const comment = `<p>Hi <a class="cu-mention" data-test="mention" data-user="${
    data.pmId
  }" data-name="${data.pm}">@${data.pm}</a></p>
                       <p><strong>ACCEPTED: </strong><strong class="ql-color-green">Yes</strong><strong>/</strong><strong class="ql-color-red">No</strong></p>
                       <p><strong>ADD TO CALENDAR: </strong>Yes</p>
                       <p><strong>CUSTOM FIELDS REVIEWED:</strong></p>
                       <ol>
                        ${customFieldsText}
                        <li class="ql-list-item ql-indent-1" data-list="bullet"><strong>Time Estimated ${
                          allData.time_estimate > 0 ? "✅" : "❌"
                        }</strong></li>
                        <li class="ql-list-item ql-indent-1" data-list="bullet"><strong>Due Date ${
                          data.dueDate ? "✅" : "❌"
                        }</strong></li>
                       </ol>
                       <p><strong>Q.A  ASSIGNED: </strong>${
                         qaDataText || "Unassigned ❌"
                       }</p>
                       <p><strong>CHECKED ACCESS: </strong>Yes</p>
                       <p><strong>DUE DATE FOR QA DELIVERY: </strong>${
                         data.dueDate
                       } COP time</p>
                       <p><strong>ACTION REQUIRED: </strong> N/A</p>`;
  try {
    const blobHtml = new Blob([comment], { type: "text/html" });
    const blobText = new Blob([comment], { type: "text/plain" });
    const data = [
      new ClipboardItem({
        ["text/plain"]: blobText,
        ["text/html"]: blobHtml,
      }),
    ];

    await navigator.clipboard.write(data);

    node.classList.remove("fa-beat");
    node
      .closest(".clickup-extension__copy-container")
      .classList.add("copy--ok");
    setTimeout(() => {
      node
        .closest(".clickup-extension__copy-container")
        .classList.remove("copy--ok");
    }, 200);
  } catch (error) {
    console.log("We've been an Error to copy Comment: " + error);
  }
};

// This is to Send on Clickup
export const copyDeliverToQA = async (data, node) => {
  const dataQA = data.qa;
  // QA Fields Text
  const qaDataText = handlerQaTextData(dataQA);
  console.log("qaDataText X->", qaDataText);

  const comment = `<p>Hi: <button class="cu-mention" data-test="mention" data-user="${data.pmId}" data-name="${data.pm}">@${data.pm}</button> and ${qaDataText || "Unassigned QA ❌"}</p>
                         <p><strong>FEEDBACK (FOR US): </strong></p><br>
                         <p><strong>WHAT I DID: </strong></p><br>
                         <p><strong>OMITS: </strong></p><br>
                         <p><strong>LIMITATION: </strong></p><br>
                         <p><strong>FILES ATTACHED: </strong></p><br>
                         <p><strong>FOR Q.A: </strong></p>
                         <p>VIDEO:</p>
                         <p><strong>RECOMMENDATIONS: </strong></p><br>
                         <p><strong>ACTION REQUIRED: </strong></p>
                         <p><button class="cu-mention" data-test="mention" data-user="${data.pmId}" data-name="${data.pm}">@${data.pm}</button> please deliver the task after Q.A is approved.</p>
                         <p><strong>CLIENT & PROJECT LOG UPDATE: </strong>N/A</p>`;
  try {
    const blobHtml = new Blob([comment], { type: "text/html" });
    const blobText = new Blob([comment], { type: "text/plain" });
    const data = [
      new ClipboardItem({
        ["text/plain"]: blobText,
        ["text/html"]: blobHtml,
      }),
    ];

    await navigator.clipboard.write(data);

    node.classList.remove("fa-beat");
    node
      .closest(".clickup-extension__copy-container")
      .classList.add("copy--ok");
    setTimeout(() => {
      node
        .closest(".clickup-extension__copy-container")
        .classList.remove("copy--ok");
    }, 200);
  } catch (error) {
    console.log("We've been an Error to copy Comment: " + error);
  }
};

// This is to Send on Clickup
export const copyCannotDeliverOnTime = async (data, node) => {
  const dataQA = data.qa;
  // QA Fields Text
  const qaDataText = handlerQaTextData(dataQA);
  console.log("qaDataText X->", qaDataText);

  const comment = `<p>Hi: <button class="cu-mention" data-test="mention" data-user="${data.pmId}" data-name="${data.pm}">@${data.pm}</button> and ${qaDataText || "Unassigned QA ❌"}</p>
                         <p><strong>FEEDBACK (FOR US): </strong></p><br>
                         <p><strong>WHAT HAS BEEN COMPLETED: </strong></p><br>
                         <p><strong>QUESTIONS: </strong></p><br>
                         <p><strong>FILES ATTACHED OR URL: </strong></p><br>
                         <p><strong>WHAT IS MISSING: </strong></p><br>
                         <p><strong>REASONS WHY THE TASK IS NOT COMPLETED: </strong></p>
                         <p>VIDEO:</p>
                         <p><strong>NEW DUE DATE: </strong>${data.dueDate} COP time</p><br>`;
  try {
    const blobHtml = new Blob([comment], { type: "text/html" });
    const blobText = new Blob([comment], { type: "text/plain" });
    const data = [
      new ClipboardItem({
        ["text/plain"]: blobText,
        ["text/html"]: blobHtml,
      }),
    ];

    await navigator.clipboard.write(data);

    node.classList.remove("fa-beat");
    node
      .closest(".clickup-extension__copy-container")
      .classList.add("copy--ok");
    setTimeout(() => {
      node
        .closest(".clickup-extension__copy-container")
        .classList.remove("copy--ok");
    }, 200);
  } catch (error) {
    console.log("We've been an Error to copy Comment: " + error);
  }
};

// This is to Send on Clickup
export const revisionQA = async (data, node) => {
  const comment = `<p><strong>Hi: </strong><button data-test="mention" data-user="${data.pmId}" data-name="${data.pm}">@${data.pm}</button> and <button data-test="mention" data-user="${data.imId}" data-name="${data.imName}">@${data.imName}</button> great work, please confirm the review with the report below</p>
  <p><strong>QA OUTCOME:</strong></p>
  <p><strong class="ql-color-blue">NOT APPROVED</strong> or <strong class="ql-color-green">APPROVED</strong></p><br>
  <hr class="ql-divider">
  <p><strong>QA ACTIONS:</strong></p><br>
  <p><strong>Issues checklists:</strong> URL</p><br>
  <p><strong>Page:</strong> URL</p><br>
  <p><strong>Reference:</strong> URL</p><br>
  <hr class="ql-divider">
  <p><strong>ISSUES REPORT:</strong></p><br>
  <p><strong>ISSUES VIDEO:</strong> URL</p><br>
  <hr class="ql-divider">
  <p><strong>PM NOTES:</strong></p><br>
  <p><strong>SUGGESTIONS:</strong></p><br>
  <p><strong>SCREENSHOTS:</strong></p>`;
  try {
    const blobHtml = new Blob([comment], { type: "text/html" });
    const blobText = new Blob([comment], { type: "text/plain" });
    const data = [
      new ClipboardItem({
        ["text/plain"]: blobText,
        ["text/html"]: blobHtml,
      }),
    ];

    await navigator.clipboard.write(data);

    node.classList.remove("fa-beat");
    node
      .closest(".clickup-extension__copy-container")
      .classList.add("copy--ok");
    setTimeout(() => {
      node
        .closest(".clickup-extension__copy-container")
        .classList.remove("copy--ok");
    }, 200);
  } catch (error) {
    console.log("We've been an Error to copy Comment: " + error);
  }
};
