let myFn = () => {
    
    window.onload = function () {
        let content = document.createElement('div');
        content.textContent = "Hello World!"
        document.body.appendChild(content);
    };

}

export default myFn;