const express = require('express');
const proxy = require('http-proxy-middleware');

// Config
const { routes } = require('./config.json');

const app = express();

var indexRouter = require('./index.route');
app.use('', indexRouter);

for (route of routes) {
    console.log(route);
    app.use(route.route,
        proxy({
            target: route.address,
            pathRewrite: (path, req) => {
                return path.split('/').slice(2).join('/'); // Could use replace, but take care of the leading '/'
            }
        })
    );
}

app.listen(8000, () => {
    console.log('Proxy listening on port 80');
});
