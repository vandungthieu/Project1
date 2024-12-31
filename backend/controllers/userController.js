const User = require('../models/User');

//  lấy tất cả người dùng
exports.getAllUser = async (req, res) => {
  try {
    // Truy vấn tất cả người dùng từ cơ sở dữ liệu
    const users = await User.find();

    // Kiểm tra nếu không có người dùng nào
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No users found.',
      });
    }

    // Trả về danh sách người dùng
    return res.status(200).json({
      success: true,
      message: 'All users retrieved successfully.',
      data: users,
    });

  } catch (error) {
    // Xử lý lỗi
    return res.status(500).json({
      success: false,
      message: 'Error retrieving users.',
      error: error.message,
    });
  }
};

// Lấy thông tin người dùng theo `UID`
exports.getUserByUID = async (req, res) => {
  try {
    const { UID } = req.params;
    const user = await User.findOne({ UID });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error fetching user:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Tìm mã vân tay theo UID 
exports.getFingerprintByUid = async (req, res) => {
  const { UID } = req.params;

  try {
    // Tìm người dùng theo UID
    const user = await User.findOne({ UID });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Trả về mã vân tay
    res.status(200).json({ fingerprint: user.fingerprint });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user data', error });
  }
};

// Tạo người dùng mới
exports.createUser = async (req, res) => {
  try {
    const { UID, name,  finger } = req.body;

    if (!UID || !name ||  !finger) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: UID, name, or finger.',
      });
    }

    // Kiểm tra xem người dùng đã tồn tại chưa
    const existingUser = await User.findOne({ UID });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this UID already exists.',
      });
    }

    // Tạo người dùng mới
    const user = new User({
      UID,
      name,
      finger,
    });

    // Lưu người dùng vào cơ sở dữ liệu
    await user.save();

    // Trả về kết quả thành công
    return res.status(201).json({
      success: true,
      message: 'User created successfully.',
      data: user,
    });

  } catch (error) {
    // Xử lý lỗi
    return res.status(500).json({
      success: false,
      message: 'Error creating user.',
      error: error.message,
    });
  }
};

// // Hàm updateUser để cập nhật thông tin người dùng
// exports.updateUser = async (req, res) => {
//   try {
//     const { UID } = req.params;  
//     const { name, email, finger } = req.body;

//     if (!UID) {
//       return res.status(400).json({
//         success: false,
//         message: 'UID is required.',
//       });
//     }

//     // Tìm người dùng dựa trên UID
//     const user = await User.findOne({ UID });
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found.',
//       });
//     }

//     // Cập nhật các trường
//     user.name = name || user.name;
//     user.avatar = avatar || user.avatar;
//     user.email = email || user.email;
//     user.finger = finger || user.finger;  
//     user.date_update = date_update || user.date_update; ; 

//     await user.save();

//     return res.status(200).json({
//       success: true,
//       message: 'User updated successfully.',
//       data: user,
//     });

//   } catch (error) {
//     // Xử lý lỗi
//     return res.status(500).json({
//       success: false,
//       message: 'Error updating user.',
//       error: error.message,
//     });
//   }
// };

// Hàm deleteUser để xóa người dùng
exports.deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
      // Xóa User
      await User.findByIdAndDelete(userId);

      // Cập nhật các bản ghi History liên quan, đặt userId thành null
      await History.updateMany({ userId }, { $set: { userId: null } });

      res.status(200).json({ message: 'User and related history updated successfully' });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
};




