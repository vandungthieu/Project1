
const History = require('../models/History'); 
const User = require('../models/User'); 
const Device = require('../models/Device');

// Hàm lưu lịch sử
exports.saveHistory = async (req, res) => {
  try {
    const { UID, id_port, time } = req.body;

    // 1. Kiểm tra dữ liệu đầu vào
    if (!UID || !id_port || !time) {
      return res.status(400).json({ message: 'UID, id_port, and time are required.' });
    }

    // 2. Lấy thông tin người dùng
    const user = await User.findOne({ UID: UID });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 3. Lấy thông tin thiết bị theo id_port
    const device = await Device.findOne({ id_port: id_port });
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    // 4. Tách thời gian thành date_in và time_in
    const [date_in, time_in] = time.split(' ');
    if (!date_in || !time_in) {
      return res.status(400).json({ message: 'Invalid time format. Expected format: "YYYY-MM-DD HH:mm:ss".' });
    }

   // 5. Lấy trạng thái hiện tại từ cơ sở dữ liệu để đảm bảo tính chính xác
    const updatedUser = await User.findOne({ UID: UID });
    const userStatus = updatedUser.status.toLowerCase() === 'in' ? 'Out' : 'In';

    // 6. Tạo bản ghi lịch sử
    const newHistory = new History({
      UID: UID, // Lưu UID trực tiếp để đảm bảo thông tin vẫn tồn tại nếu User bị xóa
      status: userStatus, // Lưu trạng thái tại thời điểm tạo lịch sử
      id_port: id_port,
      date_in,
      time_in,
    });

    await newHistory.save();

    // 7. Cập nhật trạng thái của người dùng
    updatedUser.status = userStatus;
    await updatedUser.save();

    // 8. Trả về phản hồi thành công
    res.status(201).json({
      success: true,
      message: 'Check-in history saved successfully',
      data: newHistory,
    });
  } catch (error) {
    console.error('Error saving history:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


// exports.saveHistory = async (req, res) => {
//   try {
//       // Tạo và lưu showtime mới
//       const history = new History(req.body);
//       await history.save();

//       // Populate các trường tham chiếu
//       const populatedHistory = await history.populate(['userId', 'portId']);

//       // Trả về phản hồi thành công
//       res.status(201).json({
//           status: 'success',
//           message: 'Showtime created successfully',
//           data: populatedHistory,
//       });
//   } catch (error) {
//         console.error('Error saving history:', error.message);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };


exports.getAllHistory = async (req, res) => {
    try {
      // Lấy tất cả bản ghi lịch sử
      const histories = await History.find().sort({ date_in: -1, time_in: -1 })    
  
      if (!histories || histories.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No history records found',
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'All history records retrieved successfully',
        data: histories,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving history records',
        error: error.message,
      });
    }
  };



// Lấy lịch sử theo `id_port`
exports.getHistoryByPort = async (req, res) => {
  try {
    const { id_port } = req.params;
    const device = await Device.findOne({id_port : id_port})
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    const histories = await History.find({ portId: id_port }).sort({ date_in: -1, time_in: -1 }) 
    if (!histories || histories.length === 0) {
      return res.status(404).json({ message: 'No history found for this port' });
    }
    res.json(histories);
  } catch (err) {
    console.error('Error fetching histories:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Lấy lịch sử theo `UID`
exports.getHistoryByUid = async (req, res) => {
  try {
    const {UID} = req.params;
    const user = await User.findOne({UID : UID})
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const histories = await History.find({ userId: user._id }).populate('userId').sort({ date_in: -1, time_in: -1 }) 
    if (!histories || histories.length === 0) {
      return res.status(404).json({ message: 'No history found for this User' });
    }
    res.json(histories);
  } catch (err) {
    console.error('Error fetching histories:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

