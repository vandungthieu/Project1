import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './AccessManagement.css';

library.add(fas);

const AccessManagement = () => {
    const [accessLogs, setAccessLogs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    // Lấy dữ liệu từ API history
    const getHistory = () => {
        axios.get('http://localhost:5000/api/history')
            .then(response => {
                setAccessLogs(response.data.data);
            })
            .catch(error => {
                console.error('Lỗi khi lấy lịch sử:', error.message);
            });
    };

    useEffect(() => {
        getHistory();
    }, []);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentLogs = accessLogs.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(accessLogs.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);

        const filteredLogs = accessLogs.filter((log) =>
            log.UID.toLowerCase().includes(value) ||
            log.time_in.toLowerCase().includes(value) ||
            log.status.toLowerCase().includes(value) ||
            log.id_port.toLowerCase().includes(value) // Sửa từ portId thành id_port
        );

        setCurrentPage(1);
        setAccessLogs(filteredLogs);
    };

    return (
        <div className='access-management'>
            <div className='access-management-title'>Lịch sử vào ra</div>

            <div className="search">
                <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" />
                <input
                    type="text"
                    className="search-input"
                    placeholder="Tìm kiếm..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>

            <table className='table-access'>
                <thead>
                    <tr>
                        <td>STT</td>
                        <td>UID</td>
                        <td>Giờ quét</td>
                        <td>Ngày quét</td>
                        <td>Trạng thái</td>
                        <td>Thiết bị</td>
                    </tr>
                </thead>
                <tbody>
                    {currentLogs.length > 0 ? (
                        currentLogs.map((log, index) => (
                            <tr key={log._id}>
                                <td>{indexOfFirstItem + index + 1}</td>
                                <td>{log.UID}</td>
                                <td>{log.time_in}</td>
                                <td>{log.date_in}</td>
                                <td>{log.status}</td>
                                <td>{log.id_port}</td> {/* Sửa từ log.portId thành log.id_port */}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" style={{ textAlign: 'center' }}>
                                Không có kết quả nào hiển thị
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="pagination">
                <button
                    className="page-button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    {"Trước"}
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        className={`page-button ${currentPage === index + 1 ? 'active' : ''}`}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    className="page-button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    {"Tiếp"}
                </button>
            </div>
        </div>
    );
};

export default AccessManagement;
