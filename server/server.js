require('dotenv').config();
const app = require('./index');
const connectDB = require('./src/config/db')

connectDB();

const PORT = process.env.PORT || 5000

app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`)
});