const express = require('express');
const { getHistoryByPort, saveHistory, getAllHistory, getHistoryByUid } = require('../controllers/historyController');

const router = express.Router();

router.get('/',getAllHistory); //lấy tất cả lịch sử

router.post('/', saveHistory); //lưu lịch sử

router.get('/user:UID', getHistoryByUid) // lấy lịch sử bởi người dùng

router.get('/device:id_port', getHistoryByPort);//lấy lịch sử theo id_port

module.exports = router;
