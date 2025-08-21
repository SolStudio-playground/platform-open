require('dotenv').config()
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const ProjectLogin = require('./src/routes/ProjectLogin');
const Token = require('./src/routes/Token');
const TokenOrder = require('./src/routes/tokenOrder');
const openBook = require('./src/routes/openBook');
const Transactions = require('./src/routes/Transactions');
const blog = require('./src/routes/blog');
const path = require('path');
const airdrop = require('./src/routes/airdropRoutes');
const admin = require('./src/routes/adminRoutes');
const csvRoutes = require('./src/routes/csvRoutes'); 
const multisender = require('./src/routes/multisenderRoutes');
require('./src/jobs/deleteSnapshots');
require('./src/jobs/updateAllTokens.js');
require('./src/jobs/updateStatus.js');
// database url example:
// mongodb://127.0.0.1:27017/web3solana
mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.log('Error:', error);
}
);


app.use(cors(
    // {
    //     origin: ['https://www.app.solstudio.so','https://app.solstudio.so','https://www.solstudio.so','https://solstudio.so'],
    //     methods: ['GET', 'POST', 'PUT', 'DELETE'],
    // }
));
app.use(express.json({ limit: '3mb' })); 
app.use(express.urlencoded({ extended: true, limit: '3mb' })); 



app.use('/api', ProjectLogin);
app.use('/api', Token);
app.use('/api', TokenOrder);
app.use('/api', openBook);
app.use('/api', Transactions);
app.use('/api', blog);
app.use('/api', airdrop);
app.use('/api', admin);
app.use('/api', csvRoutes);
app.use('/api', multisender);
app.use('/', express.static(path.join(__dirname, 'public')));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
