const uploadFile = require("../middleware/upload");
const fs = require('fs');
const baseUrl = "http://localhost:8080/auth/files/";

// UPLOAD
// dapat ig input it name ht file tas upload name same ht pic
exports.upload = async (req, res) => {
  try {
    const filename = Date.now() + "_" + req.files.aws.name;
    const file = req.files.aws;
   
    let uploadPath = __dirname + "/assets/uploads/" + filename;
   
    file.mv(uploadPath, (err) => {
      if (err) {
        return res.send(err);
      }
    });
      
    } catch (err) {
      return res.status(500).json({ msg: err.message})
  }
}

// UPLOAD1
// Please upload a file kuno
exports.uploads = (req, res) => {
   const file = req.file;
   if (!file) {
      return res.status(400).send({ message: 'Please upload a file.' });
   }
   var sql = "INSERT INTO `files`(`name`) VALUES ('" + req.file.filename + "')";
   var query = db.query(sql, function(err, result) {
       return res.send({ message: 'File is successfully.', file });
    });
};

// UPLOAD2 
// storage errors kuno
exports.uploadss = async (req, res) => {
  try {
    await uploadFile(req, res);
    const newFile = await File.create({
      name: req.file.filename,
    });
    res.status(200).json({
      status: "success",
      message: "File created successfully!!",
    });
  } catch (error) {
    res.json({
      error,
    });
  }
};

// kadaan nga error
exports.uploadd = async (req, res) => {
  try {
    await uploadFile(req, res);
    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }
    res.status(200).send({
      message: "Uploaded the file successfully: " + req.file.originalname,
    });
  } catch (err) {
    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size cannot be larger than 2MB!",
      });
    }
    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });
  }
};

// you must select a file kuno
exports.uploadds =  (req, res) => {
  // const filename = Date.now() + "_" + req.file.originalname;
  // const file = req.file;
    
    try {
    console.log(req.file);
    if (req.file == undefined) {
      return res.send(`You must select a file.`);
    }
    Image.create({
      type: req.file.mimetype,
      name: req.file.originalname,
      data: fs.readFileSync(
        __basedir + "/assets/uploads/" + req.file.filename
      ),
    }).then((image) => {
      fs.writeFileSync(
        __basedir + "/assets/tmp/" + image.name,
        image.data
      );
     return res.status(200).send('SUCCESS');
      return res.send(`File has been uploaded.`);
    });
  } catch (error) {
    console.log(error);
     return res.status(500).send('No files were uploaded.');
    return res.send(`Error when trying upload images: ${error}`);
  }
};

exports.uploaders =  (req, res) => {
    try {
        if(!req.files || Object.keys(req.files).length === 0)
            return res.status(400).json({msg: "No files were uploaded."})
            
        const file = req.files.file;

        if(file.size > 1024 * 1024){
            removeTmp(file.tempFilePath)
            return res.status(400).json({msg: "Size too large."})
        } // 1mb

        if(file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png'){
            removeTmp(file.tempFilePath)
            return res.status(400).json({msg: "File format is incorrect."})
        }

        next()
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
};

// storage errors kuno
// {
// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, "/uploads/")
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.fieldname + "-" + Date.now()+".jpg")
//     }
//   })
    
// var upload = multer({ 
//     storage: storage,
//     limits: { fileSize: maxSize },
//     fileFilter: function (req, file, cb){
//         var filetypes = /jpeg|jpg|png/;
//         var mimetype = filetypes.test(file.mimetype);
//         var extname = filetypes.test(path.extname(
//                     file.originalname).toLowerCase());
//         if (mimetype && extname) {
//             return cb(null, true);
//         }
//         cb("Error: File upload only supports the "
//                 + "following filetypes - " + filetypes);
//       } 
// }).single("mypic"); 


// app.post("/uploadProfilePicture",function (req, res, next) {
//     upload(req,res,function(err) {
//         if(err) {
//             res.send(err)
//         }
//         else {
//             res.send("Success, Image uploaded!")
//         }
//     })
// })
// }

// GET ALL FILES
exports.getListFiles = (req, res) => {
  const directoryPath = __basedir + "/assets/uploads/";
  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(500).send({
        message: "Unable to scan files!",
      });
    }
    let fileInfos = [];
    files.forEach((file) => {
      fileInfos.push({
        name: file,
        url: baseUrl + file,
      });
    });
    res.status(200).send(fileInfos);
  });
};

// DOWNLOAD
exports.download = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + "/assets/uploads/";
  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
};

exports.userUpload = (req, res) => {
  if (!req.file) {
    console.log("No file upload");
} else {
    console.log(req.file.filename)
    var imgsrc = 'http://127.0.0.1:272/' + req.file.filename
    var insertData = "INSERT INTO files(file_src)VALUES(?)"
    db.query(insertData, [imgsrc], (err, result) => {
        if (err) throw err
        console.log("file uploaded")
    })
}
};

exports.remove = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + "/assets/uploads/";

  fs.unlink(directoryPath + fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not delete the file. " + err,
      });
    }

    res.status(200).send({
      message: "File is deleted.",
    });
  });
};

exports.removeSync = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + "/assets/uploads/";

  try {
    fs.unlinkSync(directoryPath + fileName);

    res.status(200).send({
      message: "File is deleted.",
    });
  } catch (err) {
    res.status(500).send({
      message: "Could not delete the file. " + err,
    });
  }
};

// const uploadFile = require("../middleware/upload");
// const fs = require('fs');
// const baseUrl = "http://localhost:8080/auth/files/";
// const db = require("../models");


// exports.upload = async (req, res) => {
//   try {
//     await uploadFile(req, res);
//     if (req.file == undefined) {
//       return res.status(400).send({ message: "Please upload a file!" });
//     }
//     res.status(200).send({
//       message: "Uploaded the file successfully",
//     });
//   } catch (err) {
//     if (err.code == "LIMIT_FILE_SIZE") {
//       return res.status(500).send({
//         message: "File size cannot be larger than 2MB!",
//       });
//     }
//     res.status(500).send({
//       message: `Could not upload the file`,
//     });
//   }
// }


// exports.upload = async (req, res) => {
  // try {
  //   await uploadFile(req, res);

  //   const newFile = await File.create({
  //     name: req.file.filename,
  //   });
  //   res.status(200).json({
  //     status: "success",
  //     message: "File created successfully!!",
  //   });
  // } catch (error) {
  //   res.json({
  //     error,
  //   });
  // }
// }
// // GET ALL
// exports.getListFile = (req, res) => {
//    const directoryPath = __basedir + "/assets/uploads/";
//   fs.readdir(directoryPath, function (err, files) {
//     if (err) {
//       res.status(500).send({
//         message: "Unable to scan files!",
//       });
//     }
//     let fileInfos = [];
//     files.forEach((file) => {
//       fileInfos.push({
//         name: file,
//         url: baseUrl + file,
//       });
//     });
//     res.status(200).send(fileInfos);
//   });
// }

// // DOWNLOAD
// exports.download = (req, res) => {
//     const fileName = req.params.name;
//   const directoryPath = __basedir + "/assets/uploads/";
//   res.download(directoryPath + fileName, fileName, (err) => {
//     if (err) {
//       res.status(500).send({
//         message: "Could not download the file. " + err,
//       });
//     }
//   });
// }





