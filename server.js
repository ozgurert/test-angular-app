const express = require('express');
const path = require('path');
const app = express();

// Angular projesinin build sonrası çıktılarının bulunduğu klasörü belirtiyoruz.
const appName = 'untitled2';
app.use(express.static(__dirname + `/dist/${appName}`));

// Gelen tüm istekler için ana HTML dosyasını gönder (Angular routing'in çalışması için)
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + `/dist/${appName}/index.html`));
});

// Azure'un bize verdiği portu dinle
app.listen(process.env.PORT || 8080);
