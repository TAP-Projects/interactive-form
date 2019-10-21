import $ from 'jquery';
import help from './helpers.js';
import './css/style.css'

console.log("hello world");

if (module.hot) {
    module.hot.accept('./helpers.js', function() {
    console.log('Accepting the updated helper module!');
    help();
})
}

