import { createLink, createTitle, startup } from "./core";

require('./scss/contact.scss');

startup(() => {
    createTitle('Webpack Starter App / Contact');
    createLink('Back', './index.html');
});