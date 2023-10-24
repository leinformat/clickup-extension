
const test = async() =>{
    try {
      const req = await fetch('https://api.clickup.com/api/v2/team/6909093/task?subtasks=true', {
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

  /*
  let dataSaveId = crypto.randomUUID();
  console.log(dataSaveId)
  */
  to be delivered