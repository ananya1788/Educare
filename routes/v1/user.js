const express = require('express');
const router = express.Router();
const multer = require('multer');


var multistorage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, "uploads/user") },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + file.originalname);
    }
  
  });
  var upload = multer({ storage: multistorage });
  
  const singlestorage=multer.memoryStorage();
  const upload1=multer({storage:singlestorage});

  module.exports = router;