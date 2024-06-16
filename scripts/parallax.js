// scripts.js

document.getElementById('getStarted').addEventListener('click', function () {
    window.scrollTo({
        top: document.querySelector('#content').offsetTop,
        behavior: 'smooth'
    });
});
