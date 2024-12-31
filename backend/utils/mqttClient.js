const mqtt = require('mqtt');

// Cấu hình kết nối tới broker MQTT
const brokerUrl = 'mqtts://d7eb729f7e76485db214a7bc692de9b4.s1.eu.hivemq.cloud:8883'; 
const options = {
    clientId: 'nodejs_client',   // ID cho client (nên duy nhất)
    username: 'dungthieu',   // (nếu có) Cung cấp username nếu broker yêu cầu
    password: 'Dung.tv215547',   // (nếu có) Cung cấp password nếu broker yêu cầu
    clean: true,  // Mặc định là true, đảm bảo client không giữ lại trạng thái cũ khi kết nối lại
    reconnectPeriod: 1000,  // Thời gian kết nối lại nếu mất kết nối
};

// Kết nối đến MQTT Broker
const client = mqtt.connect(brokerUrl, options);

// Khi kết nối thành công
client.on('connect', () => {
    console.log('Đã kết nối đến MQTT Broker');
});

// Lắng nghe các sự kiện MQTT
client.on('message', (topic, message) => {
    console.log(`Nhận được thông điệp từ topic ${topic}: ${message.toString()}`);
});

// Xử lý lỗi kết nối
client.on('error', (err) => {
    console.error('Lỗi kết nối MQTT:', err);
});

// Xuất client để sử dụng trong các module khác
module.exports = client;
