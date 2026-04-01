const express = require('express');
// const cors = require('cors');
const tasksRouter = require('./routes/tasks');

const app = express();
// app.use(cors());
app.use(express.json());

app.use('/tasks', tasksRouter);

app.listen(5000, () => console.log('Server running on port 5000'));