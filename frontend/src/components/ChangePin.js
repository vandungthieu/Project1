import React, { useState } from 'react';
import axios from 'axios';

const ChangePin = () => {
  const [newPin, setNewPin] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // Thêm trạng thái loading để hiển thị khi đang gửi yêu cầu

  const handlePinChange = async (e) => {
    e.preventDefault();
    setLoading(true); // Khi bắt đầu gửi yêu cầu, đặt loading thành true

    try {
      // Gửi yêu cầu cập nhật PIN mới
      const response = await axios.put('http://localhost:5000/api/admin/update-pin', {
        newPin
      });

      // Hiển thị thông báo thành công
      setMessage(response.data.message || 'PIN đã được cập nhật thành công!');
    } catch (error) {
      // Xử lý lỗi nếu có
      const errorMessage = error.response?.data?.message || 'Đã có lỗi xảy ra khi cập nhật PIN.';
      setMessage(errorMessage);
    } finally {
      setLoading(false); // Đặt lại trạng thái loading khi yêu cầu hoàn tất
    }
  };

  return (
    <div>
      <h3>Thay đổi PIN</h3>
      <form onSubmit={handlePinChange}>
        <div>
          <label htmlFor="newPin">PIN mới:</label>
          <input
            type="password"  // Đặt kiểu là password để bảo mật khi nhập
            id="newPin"
            value={newPin}
            onChange={(e) => setNewPin(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}> {/* Disable nút khi đang gửi yêu cầu */}
          {loading ? 'Đang cập nhật...' : 'Cập nhật PIN'}
        </button>
      </form>
      {message && <p>{message}</p>}  {/* Hiển thị thông báo */}
    </div>
  );
};

export default ChangePin;
