export const config = {
    port: process.env.PORT || 3100,
    socketPort: process.env.SOCKET_PORT || 3000,
    databaseUrl: process.env.DATABASE_URL || 'mongodb+srv://duszakdamian034:7AqxblWyn9L0bIM7@cluster0.hbxi47n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    weatherApiKey : process.env.WEATHER_API_KEY || '380734aa92c5a03107d8754550ee3017',
    JwtSecret: process.env.JWT_SECRET || 'secret'
}