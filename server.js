require('dotenv').config();
const app = require('./app');
const PORT = process.env.PORT || 3000;

// This part keeps the server alive and listening
app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
});