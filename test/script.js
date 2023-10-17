/*
const test = async() =>{
    try {
      const req = await fetch('https://api.clickup.com/api/v2/team/6909093/task?subtasks=true&assignees[]=43629781', {
        method: "GET",
        headers: {
          Authorization: 'pk_43629781_B80XF63D0EETYTHFLM2CBIVCZ8JMUW7I',
        },
      });
  
      const response = await req.json();
  
      console.log(response);
  
    }catch(err){
      console.log(err);
    }
  }
  test()

  let dataSaveId = crypto.randomUUID();
  console.log(dataSaveId)
  */
// Crear un elemento de audio
const audioElement = document.createElement("audio");
audioElement.src ="http://drive.google.com/uc?export=view&id=1QQMntJamiqNR3DJ-YPhA7RdkIebZg7_J";
audioElement.autoplay = true; // Reproducir automáticamente
audioElement.controls = true;
// Agregar el elemento de audio al cuerpo del documento
document.body.appendChild(audioElement);