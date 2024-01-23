export const hublFixer = () => {
  Swal.fire({
    title: "Enter your Hubl code",
    input: "textarea",
    inputAttributes: {
      autocapitalize: "off",
    },
    showCancelButton: true,
    confirmButtonText: "Fix it",
    showLoaderOnConfirm: true,
    preConfirm: async (text) => {
      try {
        const textContent = await text;
        if (!textContent.length) {
          return Swal.showValidationMessage(`Empty field, please enter the Hubl code`);
        }
        const step1 = await textContent.replace(/\\"/g, "'");
        const step2 = await step1.replace(/\/[^/]+\/modules\//g, "../modules/");
        const lastStep = await step2.replace(/\\n/g, "");
        const blobHtml = new Blob([lastStep], { type: "text/html" });
        const blobText = new Blob([lastStep], { type: "text/plain" });
        const data = [
          new ClipboardItem({
            ["text/plain"]: blobText,
            ["text/html"]: blobHtml,
          }),
        ];
        await navigator.clipboard.write(data);
      } catch (error) {
        Swal.showValidationMessage(`Request failed: ${error}`);
      }
    },
    allowOutsideClick: () => !Swal.isLoading(),
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: `Code fixed correctly`,
        text: "Your new code is already on your clipboard",
        icon: "success",
        timer: 5000,
        timerProgressBar: true,
      });
    }
  });
};