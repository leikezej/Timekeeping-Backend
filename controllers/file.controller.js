const uploadFile = require("../middleware/upload");
const fs = require('fs');
baseUrl = "http://localhost:272/api/user/files";
const path = require('path');

const db = require("../config/db.config");
const User = db.User;

const singleUpload = (req, res) => {
  console.log(req.file);
  res.send("Single File Uploaded Successfully!");
};

const multipleUpload = (req, res) => {
    console.log(req.files);
    res.send("Multiple Files Upload Success!");
};

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

const userUpload = async (req, res) => {
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
  singleUpload,
  multipleUpload,
  userUpload,
  getListFiles,
  download,
  remove
};
