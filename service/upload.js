const fs=require('fs')

const uploadfile=async(req,folder)=>{
    let file_name="uploads/"+folder+"/image_"+req.file.originalname;
    fs.writeFileSync(file_name,req.file.buffer);
    return file_name;
}

module.exports={uploadfile}