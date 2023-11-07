// Funtion to format dates
export const dateFormat = (unix, format)=>{
    if(!unix) return 0;
    
    const codeUnix = new Date(Number(unix));
    
    if(format=="month"){ 
      const date = codeUnix.toLocaleDateString('en-US',{ month: 'short'});
      return date;
    }
    else if(format=="day"){
      const date = codeUnix.toLocaleDateString('en-US',{ day: 'numeric' });
      return date;
    }
    else if(format=="month-day"){
      const date = codeUnix.toLocaleDateString('en-US',{month: 'short',day: 'numeric' });
      return date;
    }
    else if(format=="large"){
      const date = codeUnix.toLocaleDateString("en-US",{
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
      return date;
    }
    else{
      const date = codeUnix.toLocaleDateString('en-US',{ year: 'numeric', month: 'short', day: 'numeric' });
      return date.replace(/\./g, ',');
    }
}