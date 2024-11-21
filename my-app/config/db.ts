import mongoose from 'mongoose';

export async function connectDB() {
  mongoose.set("strictQuery", false); // Mongoose 7 options
  const mongoUri = 'mongodb://127.0.0.1:27017/ListaTareasW2'; // URI de conexión a MongoDB

  try {
    await mongoose.connect(mongoUri);
    console.log('Conectado a MongoDB');
  } catch (err) {
    console.error('Error de conexión:', err);
    process.exit(1); // Termina el proceso si no se puede conectar
  }
}
