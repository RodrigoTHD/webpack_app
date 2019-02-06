class App {

    static environmentLog () {
        const isProd = process.env.NODE_ENV == 'production';

        console.log(`%c ${isProd ? 'production mode' : 'development mode'}`, `font-weigth: bold; color: ${isProd} ? 'blue' : 'red'`);
    }

    static render (handler) {
    
        window.onload = function (e) {

            App.environmentLog();           
            
            const content = handler.apply(this, [e, process]);
    
            if (content) {
                
                const root = document.getElementById('root');
    
                if (root) {

                    root.innerHTML = content;
                }
            }
        }
    }
}

export default App;