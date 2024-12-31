import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import './UserManagement.css';

const generateUID = () => Math.floor(Math.random() * 10000);

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [newUserName, setNewUserName] = useState("");
    const [newUserUID, setNewUserUID] = useState("");
    const [newUserStatus, setNewUserStatus] = useState("");
    const [newUserFingerprint, setNewUserFingerprint] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 4;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/users');
                setUsers(response.data.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleAddUser = async () => {
        if (newUserName.trim() === "" || newUserUID.trim() === "" || newUserStatus.trim() === "") return;

        const newUser = {
            UID: newUserUID || generateUID(),
            name: newUserName,
            finger: newUserFingerprint,
            status: newUserStatus,
        };

        try {
            const response = await axios.post('http://localhost:5000/api/users', newUser);
            setUsers([...users, response.data.data]);
            resetForm();
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    const handleDeleteUser = async (UID) => {
        try {
            await axios.delete(`http://localhost:5000/api/users/${UID}`);
            setUsers(users.filter(user => user.UID !== UID));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const resetForm = () => {
        setNewUserName("");
        setNewUserUID("");
        setNewUserStatus("");
        setNewUserFingerprint("");
        setModalOpen(false);
    };

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser).filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const totalPages = Math.ceil(users.length / usersPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    return (
        <div className='container'>
            <h2>Danh sách người dùng</h2>
            <div className="first-row">
                <div className='search-user'>
                    <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Tìm kiếm..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
                <div className='button-container'>
                    <button onClick={() => setModalOpen(true)}>Thêm</button>
                </div>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>UID</th>
                            <th>Status</th>
                            <th>Fingerprint</th>
                            <th>Created At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.map(user => (
                            <tr key={user.UID}>
                                <td>{user.name}</td>
                                <td>{user.UID}</td>
                                <td>{user.status}</td>
                                <td>{user.finger ? user.finger : "N/A"}</td>
                                <td>{new Date(user.createdAt).toLocaleString()}</td>
                                <td>
                                    <button className="delete-button" onClick={() => handleDeleteUser(user.UID)}>Xóa</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Phân trang */}
            <div className="pagination">
                <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className={currentPage === 1 ? "disabled" : ""}
                >
                    Trước
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => paginate(index + 1)}
                        className={currentPage === index + 1 ? "active" : ""}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className={currentPage === totalPages ? "disabled" : ""}
                >
                    Sau
                </button>
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setModalOpen(false)}>&times;</span>
                        <h2 className="modal-title">Thêm Người Dùng</h2>
                        <input
                            className="modal-input"
                            type="text"
                            placeholder="Tên người dùng"
                            value={newUserName}
                            onChange={(e) => setNewUserName(e.target.value)}
                        />
                        <input
                            className="modal-input"
                            type="text"
                            placeholder="UID"
                            value={newUserUID}
                            onChange={(e) => setNewUserUID(e.target.value)}
                        />
                        <input
                            className="modal-input"
                            type="text"
                            placeholder="Fingerprint"
                            value={newUserFingerprint}
                            onChange={(e) => setNewUserFingerprint(e.target.value)}
                        />
                        <select
                            className="modal-input"
                            value={newUserStatus}
                            onChange={(e) => setNewUserStatus(e.target.value)}
                        >
                            <option value="">Chọn trạng thái</option>
                            <option value="in">In</option>
                            <option value="out">Out</option>
                        </select>
                        <button className="modal-button" onClick={handleAddUser}>Xác Nhận</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserManagement;
