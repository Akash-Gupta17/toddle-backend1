require('./database'); // sets up DB and tables

const express = require('express');
const app = express();

app.use(express.json());

const authRoutes = require('./routes/auth'); // Make sure this file exists and path is correct
app.use('/api/auth', authRoutes);            // Mount route at /api/auth\

const journalRoutes = require('./routes/journal');
app.use('/api/journal', journalRoutes);


app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
//trigger redeploy