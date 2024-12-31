const Admin = require('../models/Admin');

// Lấy thông tin admin 
exports.getAdmin = async (req, res) => {
    try {
        const admin = await Admin.findOne();  
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.status(200).json(admin);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching admin', error });
    }
};

// Thay đổi PIN của admin
exports.updatePin = async (req, res) => {
    const { newPin } = req.body;  // Nhận newPin từ body yêu cầu
  
    try {
      // Tìm admin duy nhất trong cơ sở dữ liệu (giả sử chỉ có một admin)
      const admin = await Admin.findOne();
  
      if (!admin) {
        return res.status(404).json({ message: 'Admin không tồn tại.' });
      }
  
      // Cập nhật PIN mới mà không làm thay đổi các trường khác
      admin.pin = newPin;
  
      // Lưu lại vào cơ sở dữ liệu
      await admin.save();
  
      res.status(200).json({ message: 'PIN đã được cập nhật thành công!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Đã có lỗi xảy ra khi cập nhật PIN.' });
    }
  };
  
  