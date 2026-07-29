const axios = require('axios');

async function testRegister() {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/register', {
      name: "Surya K",
      email: "surya2008sky@gmail.com",
      password: "password123",
      phone: "9025953166",
      role: "Passenger",
      gender: "Male",
      organizationName: "Sri Eshwar College of Engineering"
    });
    console.log('REGISTER SUCCESS:', res.data);
  } catch (err) {
    console.error('REGISTER ERROR STATUS:', err.response?.status);
    console.error('REGISTER ERROR DATA:', err.response?.data);
  }
}

testRegister();
