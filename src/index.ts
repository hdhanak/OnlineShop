const express = require('express')
import { NextFunction } from 'express';
import { updateNamespaceExportDeclaration } from 'typescript';
import connects from './connection/db';
import router from "./router/routers";
const i18next = require('i18next');
const i18nextMiddleware1 = require('i18next-express-middleware'); //deprected
const i18nextMiddleware = require('i18next-http-middleware');

const Backend = require('i18next-node-fs-backend');
const port = 8000 || process.env.PORT


express.application.prefix = express.Router.prefix = function (path:any ,configure:any) {
    var router = express.Router();
    this.use(path, router);
    configure(router);
    return router;
};
const app = express()
var cookies = require("cookie-parser");
import user from './userDemo'
app.use(cookies());


i18next
    .use(Backend)
    .use(i18nextMiddleware.LanguageDetector)
    .init({
        backend: {
            loadPath: __dirname + '/locales/{{lng}}/translation.json',
        },
        debug: true,
        detection: {
            order: ['querystring', 'cookie'],
            caches: ['cookie']
        },
        fallbackLng: 'en',
        preload: ['en', 'ru']
    });

app.use(i18nextMiddleware.handle(i18next));


//....prefix fun




app.use(express.json())

app.prefix('/', (route: any) => {
    user(route)
})


// app.use('/',router)
// app.use(cookieParser());

connects()

app.listen(port, () => {
    console.log(`port listining a ${port}`);

})




