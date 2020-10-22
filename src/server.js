const express = require('express');
const app = express();
const properties = require('../package.json');

// app running configurations
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`${properties.name} is running on http://localhost:${PORT}`);
});