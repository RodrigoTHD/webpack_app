const environmentLog = () => {
    console.log('Script from index page!');

    const isProd  = process.env.NODE_ENV == 'production';
    console.log(`%c ${isProd ? 'production mode' : 'development mode'}`, `font-weigth: bold; color:{isProd ? 'blue' : 'red'}`);
}

export const startup = (callback) => {    

    window.onload = function (e) {

        environmentLog();

        callback();
    };
}

export const createTitle = (title) => {
    const content = document.createElement('h3');
    content.textContent = title;
    document.body.appendChild(content);
}

export const createLink = (text, href) => {
    const a = document.createElement('a');
    a.textContent = text;
    a.href = href;
    document.body.appendChild(a);
}