import html2canvas from "html2canvas";
export const print =  (node) => {
      // let width = node.offsetWidth;
      // let height = node.offsetHeight;
      // node.style.height = node.scrollWidth + 'px';
      // node.style.height = node.scrollHeight + 'px';

      html2canvas(node).then(canvas => {
        let newWindow = window.open();
        const title = document.createElement("title");
        title.innerText = "打印";
        // let imageURI = canvas.toDataURL('image/png');
        // let img = document.createElement('img');
        // img.src = imageURI;
        // img.style.width = "700px";
        // img.style.height = node.scrollHeight/node.scrollWidth*700  + 'px';


        newWindow.document.body.appendChild(title);
        newWindow.document.body.appendChild(canvas);
        canvas.style.display="block";
        canvas.style.margin="0 auto"
        // img.onload = function(){
          newWindow.print();
          newWindow.close();
          newWindow = undefined;
          // node.style.width = width + 'px';
          // node.style.height = height + 'px';
        // }

      })
  }

  export const download = (node) => {
   
    html2canvas(node).then(canvas=>{
     let image = canvas.toDataURL('image/png');
     let a = document.createElement('a');
     a.href = image;
     a.download='集采';
     document.body.appendChild(a);
     a.click();
     document.body.removeChild(a); 
    });
 }

 export const saveAsImage = (node) =>{
   html2canvas(node).then(canvas=>{
     canvas.toBlob(blob => {
       const newWindow = window.open();
       let objectUrl = URL.createObjectURL(blob);
       newWindow.location = objectUrl;
       URL.revokeObjectURL();
     })
   })
 }