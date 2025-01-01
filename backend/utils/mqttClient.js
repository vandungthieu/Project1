const mqtt = require('mqtt');

// Cấu hình kết nối tới broker MQTT
const brokerUrl = 'd7eb729f7e76485db214a7bc692de9b4.s1.eu.hivemq.cloud'; 
const port =8883
const options = {
    brokerUrl: brokerUrl,
    port: port,
    username: 'dungthieu123',   // (nếu có) Cung cấp username nếu broker yêu cầu
    password: 'Dung.tv215547',   // (nếu có) Cung cấp password nếu broker yêu cầu
    protocol: 'mqtts', // Sử dụng 'mqtts' cho kết nối TLS
    
};

// Kết nối đến MQTT Broker
const client = mqtt.connect(options);

// Khi kết nối thành công
client.on('connect', () => {
    console.log('Đã kết nối đến MQTT Broker');
});

// Xử lý lỗi kết nối
client.on('error', (err) => {
    console.error('Lỗi kết nối MQTT:', err);
});

// Xuất client để sử dụng trong các module khác
module.exports = client;
