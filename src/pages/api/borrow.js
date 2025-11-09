import { MongoClient } from 'mongodb';

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  console.log('📡 Attempting to connect to MongoDB...');
  
  if (cachedClient && cachedDb) {
    console.log('✅ Using cached database connection');
    return { client: cachedClient, db: cachedDb };
  }

  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined in environment variables');
    throw new Error('MONGODB_URI is not defined');
  }

  console.log('🔗 Creating new MongoDB connection...');
  const client = await MongoClient.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db(); // Uses database from connection string
  console.log('✅ Connected to database:', db.databaseName);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export default async function handler(req, res) {
  console.log('\n=== API ROUTE CALLED ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Headers:', req.headers);

  if (req.method !== 'POST') {
    console.log('❌ Method not allowed:', req.method);
    return res.status(405).json({ message: 'Method not allowed' });
  }

  console.log('📦 Request body:', JSON.stringify(req.body, null, 2));

  try {
    const {
      username,
      password,
      pickupDate,
      pickupTime,
      returnDate,
      returnTime,
      agreedToPolicy,
      toolQuantities
    } = req.body;

    // Validation
    console.log('🔍 Validating request data...');
    
    if (!username || !password) {
      console.log('❌ Validation failed: Missing username or password');
      return res.status(400).json({ message: 'Username and password are required' });
    }

    if (!pickupDate || !pickupTime || !returnDate || !returnTime) {
      console.log('❌ Validation failed: Missing date/time fields');
      return res.status(400).json({ message: 'All date and time fields are required' });
    }

    if (!agreedToPolicy) {
      console.log('❌ Validation failed: Policy not agreed');
      return res.status(400).json({ message: 'You must agree to the policy' });
    }

    const selectedTools = Object.values(toolQuantities).filter(tool => tool.quantity > 0);
    console.log('🔧 Selected tools:', selectedTools);
    
    if (selectedTools.length === 0) {
      console.log('❌ Validation failed: No tools selected');
      return res.status(400).json({ message: 'Please select at least one tool' });
    }

    console.log('✅ All validations passed');

    // Connect to MongoDB
    console.log('🔌 Connecting to database...');
    const { db } = await connectToDatabase();

    // Create borrow request document
    const borrowRequest = {
      username,
      // Note: In production, NEVER store passwords in plain text!
      // This should be verified against a hashed password in a users collection
      pickupDate,
      pickupTime,
      returnDate,
      returnTime,
      tools: selectedTools,
      agreedToPolicy,
      status: 'pending', // pending, approved, rejected, returned
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('💾 Inserting document into database:', JSON.stringify(borrowRequest, null, 2));

    // Insert into database
    const result = await db.collection('borrowRequests').insertOne(borrowRequest);

    console.log('✅ Document inserted successfully!');
    console.log('📝 Inserted ID:', result.insertedId);

    return res.status(201).json({
      message: 'Borrow request submitted successfully',
      requestId: result.insertedId
    });

  } catch (error) {
    console.error('❌ ERROR in API route:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return res.status(500).json({ 
      message: 'Internal server error', 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}