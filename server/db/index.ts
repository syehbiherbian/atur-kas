import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

// Get database URL from runtime config
const getDatabaseUrl = () => {
    const config = useRuntimeConfig()
    if (!config.databaseUrl) {
        throw new Error('NUXT_DATABASE_URL environment variable is required')
    }
    return config.databaseUrl
}

// Create a function to get db instance
export const useDb = () => {
    const sql = neon(getDatabaseUrl())
    return drizzle(sql, { schema })
}

// Export schema for convenience
export * from './schema'
