import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

let isConnected = 0;

export const connectDB = () => {
    if(isConnected) {
        // console.log('Using existing connection');
        return Promise.resolve();
    }

    // console.log('Using new connection');
    if(process.env.DB_CONN_URL) {
        return mongoose.connect(process.env.DB_CONN_URL, {
            authSource: 'admin',
            bufferCommands: false,
        }).then((db) => {
            isConnected = db.connections[0].readyState
            // console.log('connected');
        }).catch(e => {
            throw e
        })
    } else {
        throw new Error('Database connection URL not found')
    }
}