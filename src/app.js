import { createLink, createTitle, startup } from "./core";

require('./scss/app.scss');

startup(() => {
    createTitle('Webpack Starter App / Index');
    createLink('Contact', './contact.html');
});
