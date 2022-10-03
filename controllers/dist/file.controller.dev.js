"use strict";

var uploadFile = require("../middleware/upload");

var fs = require('fs');

var baseUrl = "http://localhost:8080/auth/files/";

exports.uploader = function _callee(req, res) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(uploadFile(req, res));

        case 3:
          _context.next = 10;
          break;

        case 5:
          _context.prev = 5;
          _context.t0 = _context["catch"](0);

          if (!(_context.t0.code == "LIMIT_FILE_SIZE")) {
            _context.next = 9;
            break;
          }

          return _context.abrupt("return", res.status(500).send({
            message: "File size cannot be larger than 2MB!"
          }));

        case 9:
          res.status(500).send({
            message: "Could not upload the file: ".concat(req.file.originalname, ". ").concat(_context.t0)
          });

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 5]]);
}; // UPLOAD
// dapat ig input it name ht file tas upload name same ht pic


exports.upload = function _callee2(req, res) {
  var filename, file, uploadPath;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          filename = Date.now() + "_" + req.files.aws.name;
          file = req.files.aws;
          uploadPath = __dirname + "/assets/uploads/" + filename;
          file.mv(uploadPath, function (err) {
            if (err) {
              return res.send(err);
            }
          });
          _context2.next = 10;
          break;

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          return _context2.abrupt("return", res.status(500).json({
            msg: _context2.t0.message
          }));

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
}; // UPLOAD1
// Please upload a file kuno


exports.uploads = function (req, res) {
  var file = req.file;

  if (!file) {
    return res.status(400).send({
      message: 'Please upload a file.'
    });
  }

  var sql = "INSERT INTO `files`(`name`) VALUES ('" + req.file.filename + "')";
  var query = db.query(sql, function (err, result) {
    return res.send({
      message: 'File is successfully.',
      file: file
    });
  });
}; // UPLOAD2 
// storage errors kuno


exports.uploadss = function _callee3(req, res) {
  var newFile;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(uploadFile(req, res));

        case 3:
          _context3.next = 5;
          return regeneratorRuntime.awrap(File.create({
            name: req.file.filename
          }));

        case 5:
          newFile = _context3.sent;
          res.status(200).json({
            status: "success",
            message: "File created successfully!!"
          });
          _context3.next = 12;
          break;

        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](0);
          res.json({
            error: _context3.t0
          });

        case 12:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 9]]);
}; // kadaan nga error


exports.uploadd = function _callee4(req, res) {
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(uploadFile(req, res));

        case 3:
          if (!(req.file == undefined)) {
            _context4.next = 5;
            break;
          }

          return _context4.abrupt("return", res.status(400).send({
            message: "Please upload a file!"
          }));

        case 5:
          res.status(200).send({
            message: "Uploaded the file successfully: " + req.file.originalname
          });
          _context4.next = 13;
          break;

        case 8:
          _context4.prev = 8;
          _context4.t0 = _context4["catch"](0);

          if (!(_context4.t0.code == "LIMIT_FILE_SIZE")) {
            _context4.next = 12;
            break;
          }

          return _context4.abrupt("return", res.status(500).send({
            message: "File size cannot be larger than 2MB!"
          }));

        case 12:
          res.status(500).send({
            message: "Could not upload the file: ".concat(req.file.originalname, ". ").concat(_context4.t0)
          });

        case 13:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 8]]);
}; // you must select a file kuno


exports.uploadds = function (req, res) {
  // const filename = Date.now() + "_" + req.file.originalname;
  // const file = req.file;
  try {
    console.log(req.file);

    if (req.file == undefined) {
      return res.send("You must select a file.");
    }

    Image.create({
      type: req.file.mimetype,
      name: req.file.originalname,
      data: fs.readFileSync(__basedir + "/assets/uploads/" + req.file.filename)
    }).then(function (image) {
      fs.writeFileSync(__basedir + "/assets/tmp/" + image.name, image.data);
      return res.status(200).send('SUCCESS');
      return res.send("File has been uploaded.");
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send('No files were uploaded.');
    return res.send("Error when trying upload images: ".concat(error));
  }
}; // storage errors kuno
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


exports.getListFiles = function (req, res) {
  var directoryPath = __basedir + "/assets/uploads/";
  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(500).send({
        message: "Unable to scan files!"
      });
    }

    var fileInfos = [];
    files.forEach(function (file) {
      fileInfos.push({
        name: file,
        url: baseUrl + file
      });
    });
    res.status(200).send(fileInfos);
  });
}; // DOWNLOAD


exports.download = function (req, res) {
  var fileName = req.params.name;
  var directoryPath = __basedir + "/assets/uploads/";
  res.download(directoryPath + fileName, fileName, function (err) {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err
      });
    }
  });
};

exports.userUpload = function (req, res) {
  if (!req.file) {
    console.log("No file upload");
  } else {
    console.log(req.file.filename);
    var imgsrc = 'http://127.0.0.1:272/' + req.file.filename;
    var insertData = "INSERT INTO files(file_src)VALUES(?)";
    db.query(insertData, [imgsrc], function (err, result) {
      if (err) throw err;
      console.log("file uploaded");
    });
  }
};

exports.remove = function (req, res) {
  var fileName = req.params.name;
  var directoryPath = __basedir + "/assets/uploads/";
  fs.unlink(directoryPath + fileName, function (err) {
    if (err) {
      res.status(500).send({
        message: "Could not delete the file. " + err
      });
    }

    res.status(200).send({
      message: "File is deleted."
    });
  });
};

exports.removeSync = function (req, res) {
  var fileName = req.params.name;
  var directoryPath = __basedir + "/assets/uploads/";

  try {
    fs.unlinkSync(directoryPath + fileName);
    res.status(200).send({
      message: "File is deleted."
    });
  } catch (err) {
    res.status(500).send({
      message: "Could not delete the file. " + err
    });
  }
}; // const uploadFile = require("../middleware/upload");
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