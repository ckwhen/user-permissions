const server = require('json-server');
const generate = require('./generate');

const app = server.create();
const router = server.router(generate());

// port要修改的話,/examples/webpack.config.js也要改
const port = 8082;
const host = 'localhost';

app.use('/api', router);
app.listen(port, host, (error) => {
  if (error) throw error;
  console.log('server running at http://%s:%d', host, port);
});
