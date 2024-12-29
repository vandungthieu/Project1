const express = require('express');
const { getHistoryByPort, saveHistory, getAllHistory, getHistoryByUid } = require('../controllers/historyController');

const router = express.Router();

router.get('/:UID', getHistoryByUid) // lấy lịch sử bởi người dùng
router.get('/:id_port', getHistoryByPort);//lấy lịch sử theo id_port
router.post('/', saveHistory); //lưu lịch sử
router.get('/',getAllHistory); //lấy tất cả lịch sử

module.exports = router;
