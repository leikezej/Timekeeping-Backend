const uploadFile = require("../middleware/upload");
const fs = require('fs');
baseUrl = "http://localhost:272/api/user/files";
const path = require('path');

const upload = (req, res) => {
    const files = req.files
        // console.log(files)
    Object.keys(files).forEach(key => {
    const filepath = path.join(__dirname, '/assets/avatar', files[key].name)
        files[key].mv(filepath, (err) => {
            if (err) 
         return res.status(500).send(err);
                res.send({
          status: true,
          message: 'File Uploaded to' + filepath,
          data: {
              name: req.files.name,
              mimetype: req.files.mimetype,
              size: req.files.size
          }
      });
        })
    })
};

// kelangan anay ig declare it base filename ht file hn "uploadedFile" para makarawat it pag upload
const uploader = (req, res) => {
  let uploadedFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send({
      status: false,
      message: 'No File Uploaded'
    });
  }
  uploadedFile = req.files.uploadedFile;
  uploadPath = __dirname + '/assets/avatar/' + uploadedFile.name;

  uploadedFile.mv(uploadPath, function(err) {
    if (err)
      return res.status(500).send(err);

    res.send({
        status: true,
        message: 'File Uploaded to' + uploadPath,
        data: {
            name: uploadedFile.name,
            mimetype: uploadedFile.mimetype,
            size: uploadedFile.size
        }
    });
  });
};

const userUpload = (req, res) => {
    const files = req.files

  if (!req.file) {
    console.log("No file upload");
} 
else {
    console.log(req.file.filename)
    var imgsrc = 'https://i.scdn.co/image/ab6761610000e5eba00b11c129b27a88fc72f36b' + req.file.filename
    var insertData = "INSERT INTO files VALUES(?)"
    db.query(insertData, [imgsrc], (err, result) => {
        if (err) throw err
        console.log("file uploaded")
    })
  }
};


const getListFiles = (req, res) => {
  const directoryPath = __basedir + "/assets/uploads";
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

const download = (req, res) => {
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

const remove = (req, res) => {
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

module.exports = {
  upload,
  uploader,
  userUpload,
  getListFiles,
  download,
  remove
};