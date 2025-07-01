const express = require('express');
const path = require('path');
const app = express();

const port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/dist/untitled2/browser'));

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/untitled2/browser/index.html'));
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on port ${port}`);
});
