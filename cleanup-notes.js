const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_03ykBpzhxsIo@ep-summer-mountain-ad7nf8ih-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: {
    rejectUnauthorized: false
  }
});

async function cleanupNotes() {
  try {
    console.log('🧹 Starting notes cleanup...');
    
    // Delete notes that don't have a user_id (old test data)
    const result = await pool.query('DELETE FROM notes WHERE user_id IS NULL OR user_id = \'\'');
    
    console.log(`✅ Deleted ${result.rowCount} notes without proper user_id`);
    
    // Show remaining notes count
    const countResult = await pool.query('SELECT COUNT(*) FROM notes');
    console.log(`📝 Remaining notes in database: ${countResult.rows[0].count}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    process.exit(1);
  }
}

cleanupNotes();