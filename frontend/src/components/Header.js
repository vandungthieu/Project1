import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import ChangePin from './ChangePin';  // Import component ChangePin

import './Header.css';

library.add(fas);

const Header = () => {
  const [showAdminInfo, setShowAdminInfo] = useState(false);
  const [adminInfo, setAdminInfo] = useState(null);
  const [adminId, setAdminId] = useState('');  // Admin ID cần thiết để cập nhật PIN

  // Fetch thông tin admin khi lần đầu click vào user
  const fetchAdminInfo = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin');
      setAdminInfo(response.data);
      setAdminId(response.data._id);  // Lưu lại adminId từ thông tin admin
    } catch (error) {
      console.error('Có lỗi khi lấy thông tin admin:', error);
    }
  };

  // Toggle hiển thị thông tin admin
  const toggleAdminInfo = () => {
    if (!adminInfo) {
      fetchAdminInfo();  // Nếu chưa có thông tin admin, gọi API
    }
    setShowAdminInfo(prevState => !prevState);  // Toggle hiển thị thông tin admin
  };

  useEffect(() => {
    // Hiện tại chỉ gọi API khi cần thiết
    // Để giảm thiểu việc gọi lại API không cần thiết
  }, [adminInfo]);

  return (
    <div className='header'>
      <div className='logo-header'>
        <FontAwesomeIcon icon="fa-solid fa-fingerprint" />
        <div className='logo-header-title'>Acheckin</div>
      </div>
      
      <div className='user' onClick={toggleAdminInfo}>
        <div className='user-name'>Dũng Thiều</div>
        <FontAwesomeIcon icon="fa-solid fa-user" />
      </div>

      {/* Hiển thị thông tin admin và form thay đổi PIN khi showAdminInfo là true */}
      {showAdminInfo && adminInfo && (
        <div className="admin-info">
          <h3>Thông tin Admin</h3>
          <p><strong>Họ và tên:</strong> {adminInfo.name}</p>
          <p><strong>Email:</strong> {adminInfo.email}</p>
          <p><strong>Chức vụ:</strong> {adminInfo.role}</p>
          <p><strong>Mã Pin:</strong> {adminInfo.pin}</p>
          
          {/* Chỉ cần hiển thị form thay đổi PIN mà không cần thêm tiêu đề "Thay đổi PIN" */}
          <ChangePin adminId={adminId} />  {/* Truyền adminId vào form */}
        </div>
      )}
    </div>
  );
};

export default Header;
