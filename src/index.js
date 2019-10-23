import $ from 'jquery';
import help from './js/helpers.js';
import 'normalize.css';
import './css/style.scss';

console.log("hello world");
help();

if (module.hot) {
    module.hot.accept('./js/helpers.js', function() {
    console.log('Accepting the updated helper module!');
    help();
})
}

