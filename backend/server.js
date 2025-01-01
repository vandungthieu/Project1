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

client.on("message", async (topic, message) => {
    console.log("MQTT received topic:", topic.toString());
    try {
        if(topic.toString() === "/fingerprint"){
        const jsonMessage = JSON.parse(message.toString());
        await createAccessLog(jsonMessage);
        }
    } catch (error) {
        console.log("Message (Raw):", message.toString());
        console.error("Error parsing message as JSON:", error);
    }
});

// Server listener
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
