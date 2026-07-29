const mongoose = require('mongoose');

const atlasUri = 'mongodb+srv://surya2406:SnxqpyFJDi3RgoOj@suryakavi18.808kvyg.mongodb.net/ridelink_ai?retryWrites=true&w=majority&appName=SURYAKAVI18';

async function testAtlas() {
  try {
    console.log('Connecting to MongoDB Atlas Cloud...');
    await mongoose.connect(atlasUri);
    console.log('✅ Successfully connected to MongoDB Atlas Cloud!');
    
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('Collections in Atlas:', collections.map(c => c.name));

    const User = require('./models/User');
    const count = await User.countDocuments();
    console.log(`Users count in Atlas: ${count}`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Atlas Connection Failed:', err.message);
    process.exit(1);
  }
}

testAtlas();
