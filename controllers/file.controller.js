const uploadFile = require("../middleware/upload");
const fs = require('fs');
const baseUrl = "http://localhost:8080/auth/files/";

// UPLOAD
exports.upload = async (req, res) => {
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
}

// UPLOAD1
exports.uploads = async (req, res) => {
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
      // message: "Could not upload the file: " +  req.file.originalname,
      message: "Could not upload the file: ",
    });
  }
};

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
    var imgsrc = 'http://127.0.0.1:8080/user/images/' + req.file.filename
    var insertData = "INSERT INTO users_image(file_src)VALUES(?)"
    db.query(insertData, [imgsrc], (err, result) => {
        if (err) throw err
        console.log("file uploaded")
    })
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





