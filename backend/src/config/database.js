const { createClient } = require('@supabase/supabase-js');
const logger = require('../utils/logger');

// Validate required environment variables
if (!process.env.SUPABASE_URL) {
  throw new Error('SUPABASE_URL environment variable is required');
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is required');
}

// Create Supabase client with service role key for backend operations
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Test database connection
const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      logger.error('Database connection test failed:', error);
      throw error;
    }
    
    logger.info('Database connection successful');
    return true;
  } catch (error) {
    logger.error('Failed to connect to database:', error.message);
    throw error;
  }
};

// Test connection on startup
testConnection().catch(error => {
  logger.error('Database connection failed on startup:', error.message);
  process.exit(1);
});

module.exports = supabase;