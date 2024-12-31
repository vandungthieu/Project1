const express = require('express');
const http = require('http');
const cors = require('cors');
const connectDB = require('./utils/db');
const mqttClient = require('./utils/mqttClient'); // Import mqttClient

// Routes
const userRoutes = require('./routes/user');
const deviceRoutes = require('./routes/device');
const historyRoutes = require('./routes/history');
const adminRoutes = require('./routes/admin');

require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Kết nối MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes); 
app.use('/api/devices', deviceRoutes); 
app.use('/api/history', historyRoutes);
app.use('/api/admin', adminRoutes);

// sử dụng MQTT Client trong một route
app.post('/send-message', (req, res) => {
    const message = req.body.message || 'Hello MQTT from Express!';
    const topic = 'test/topic';

    // Gửi thông điệp đến topic MQTT
    mqttClient.publish(topic, message, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Lỗi khi gửi thông điệp MQTT' });
        }
        res.status(200).json({ success: `Đã gửi thông điệp: ${message} đến topic ${topic}` });
    });
});

// Server listener
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
