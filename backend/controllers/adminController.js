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

exports.sendPin = async(req, res) =>{
  try {
    // Tìm admin trong cơ sở dữ liệu
    const admin = await User.findOne();

    if (!admin) {
        return res.status(404).send({ message: 'Không tìm thấy admin hoặc pin không tồn tại.' });
    }

    const pin = admin.pin; // Lấy giá trị pin của admin

    // Gửi pin lên MQTT
    client.publish('/pin', JSON.stringify({ pin }), (error) => {
        if (error) {
            console.error('Lỗi khi gửi pin:', error);
            return res.status(500).send({ message: 'Gửi pin thất bại.' });
        }
        res.status(200).send({ message: 'Pin đã được gửi thành công' });
        console.log("Đã gửi pin đến kênh /pin:", pin);
    });
} catch (error) {
    console.error('Lỗi:', error);
    res.status(500).send({ message: 'Đã xảy ra lỗi.' });
}
}
  
  