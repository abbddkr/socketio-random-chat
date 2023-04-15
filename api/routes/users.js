var express = require('express');
var router = express.Router();
const crypto = require("crypto");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/guest", function (req, res, next) {
  const { nickname, gender } = req.body || false;
      // genereate a unique user ID
  const userId = crypto.randomUUID();
  const data = {
    userId,
    nickname,
    gender,
  };
  if (nickname && gender) {
    res.status(200).json({
      data,
    });
  }
  res.status(400).json({
    message: "Nickname and Gender cannot be empty",
  });
});

router.post("/verify_guest", (req, res, next) => {
  // write your verification method or middleware
  const { id, nickname } = req.body;
  const user = [id, nickname];
  res.status(200).json({
    user,
  });
});

module.exports = router;
