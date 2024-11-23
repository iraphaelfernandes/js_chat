const fs = require('fs');
const path = require('path');
const express = require('express');
const { program } = require('commander');


const app = express();






/**
 * Prepare command line arguments
 */
program
.option('-p, --port <PORT>', 'Select port on which the server will be run', 8000);
program.parse();
let port = program.opts().port;




/** 
 * Directory index middleware
 */
app.all('*', (req, res, next) => {
  let dirPath = path.join(__dirname, req.path);
  let stats = fs.lstatSync(dirPath, {throwIfNoEntry: false});

  if (stats && stats.isDirectory()) {
    /* List directory entries */
    let entries = fs.readdirSync(dirPath, {withFileTypes: true});

    /* Sort directory entries : 
      - directories before files
      - alphabetical order within directories and files
    */
    entries.sort((a, b) => {
      if (a.isDirectory() && b.isFile()) return -1;
      if (a.isFile() && b.isDirectory()) return 1;
      return a.name.localeCompare(b.name);
    });

    let htmlEntriesList = entries.map(entry => {
      /* concatenate a '/' after name if it's a directory */
      let entryName = entry.name + (entry.isDirectory() ? '/' : '');

      /* Generate list of <li> elements for each entry */
      return `<li><a href="${entryName}">${entryName}</a></li>`;
    }).join('\n');

    /* Add ".." path for not root directory */
    if (req.path != "/") {
      htmlEntriesList = '<li><a href="..">../</a></li>\n' + htmlEntriesList;
    };

    let htmlIndexTemplate = `<!DOCTYPE html>
      <html>
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
          <title>Directory listing for ${req.path}</title>
        </head>
        <body>
          <h1>Directory listing for ${req.path}</h1>
          <hr>
          ${htmlEntriesList}
          <hr>
        </body>
    </html>`;
    res.send(htmlIndexTemplate);
  }
  next();
});

/**
 * Serve all static files
 */
app.use(express.static(__dirname, {
  dotFiles: 'allow',
}));



app.listen(port, () => {
  console.log(`Frontend server started. You can access content at http://localhost:${port}\n`);
});