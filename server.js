const express = require('express');
const router = require('./routes');
const app = express();
app.use(express.json());
app.use('/api', router);
const PORT = 3001;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

