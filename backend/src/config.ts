export const config = {
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/transactions',
    port: process.env.PORT || 5000,
    isProduction: process.env.NODE_ENV === 'production',
    maxUploadSize: 500 * 1024 * 1024 // 500MB max file size,
}