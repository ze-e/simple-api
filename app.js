import express from 'express';
import bodyparser from 'body-parser';

import auth from './routes/auth.js';

const app = express();
const PORT = 5000;

app.use(bodyparser.json());
app.use('/', auth);
app.get('*', (req, res)=>res.sendStatus(404));

app.listen(PORT, ()=>{
  console.log(`Server running at http://localhost:${PORT}`);
})