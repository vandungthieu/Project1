import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios'; 
import './DeviceManagement.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DeviceManagement = () => {
  const [devices, setDevices] = useState([]);
  const [history, setHistory] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  // Fetch devices data
  const getDevices = () => {
    axios.get('http://localhost:5000/api/devices')
      .then(response => {
        setDevices(response.data.data);
      })
      .catch(error => {
        console.error('There was a problem with the request:', error.message);
      });
  };

  // Fetch history data
  const getHistory = () => {
    axios.get('http://localhost:5000/api/history')
      .then(response => {
        setHistory(response.data.data);
      })
      .catch(error => {
        console.error('There was a problem with the request:', error.message);
      });
  };

  useEffect(() => {
    getDevices();
    getHistory();
  }, []);

  // Process history data and update chart
  useEffect(() => {
    const processHistoryData = () => {
      const logsByDate = history.reduce((acc, log) => {
        // Kết hợp date_in và time_in thành chuỗi datetime hợp lệ
        const dateTime = `${log.date_in}T${log.time_in}`;  // YYYY-MM-DDTHH:mm:ss
        const dateObject = new Date(dateTime);  // Tạo đối tượng Date từ chuỗi hợp lệ
    
        // Kiểm tra xem đối tượng Date có hợp lệ không
        if (isNaN(dateObject.getTime())) {
          console.warn(`Invalid log time:`, log);  // Log cảnh báo nếu không hợp lệ
          return acc;
        }
    
        const date = dateObject.toISOString().split('T')[0];  // Lấy ngày theo định dạng YYYY-MM-DD
        acc[date] = (acc[date] || 0) + 1;  // Tăng số lượt cho ngày đó
        return acc;
      }, {});
    
      // Lấy các ngày gần nhất (tối đa 10 ngày)
      const sortedDates = Object.keys(logsByDate).sort((a, b) => new Date(b) - new Date(a));
      const recentDates = sortedDates.slice(0, 10).reverse();  // Lấy 10 ngày gần nhất và đảo ngược thứ tự
      const labels = recentDates;
      const data = recentDates.map(date => logsByDate[date]);
    
      // Cập nhật dữ liệu cho biểu đồ
      setChartData({
        labels,
        datasets: [
          {
            label: 'Số lượt ra vào',
            data,
            backgroundColor: '#2fa44b',
            borderColor: '#2fa44b',
            borderWidth: 1,
            barThickness: 30,
          },
        ],
      });
    };
    

    if (history.length > 0) {
      processHistoryData();
    }
  }, [history]);

  return (
    <div className='device-management'>
      <div className='device-content'>
        <div className='table-device'>
          <div className='device-management-title'>Danh sách thiết bị</div>
          <table>
            <thead>
              <tr>
                <td>STT</td>
                <td>Tên cổng</td>
                <td>Vị trí</td>
              </tr>
            </thead>
            <tbody>
              {devices.map((device, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>Cổng {device.id_port}</td>
                  <td>Cổng {device.id_port}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className='device-chart'>
          <div className='device-management-title'>Số lượt ra vào</div>
          {chartData.datasets.length > 0 ? (
            <Bar
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'top' },
                },
                scales: {
                  y: {
                    ticks: {
                      stepSize: 1, // Ensure only integers are shown
                      callback: (value) => Number.isInteger(value) ? value : null,
                    },
                    beginAtZero: true,
                  },
                },
              }}
            />
          ) : (
            <p>Loading chart...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeviceManagement;

