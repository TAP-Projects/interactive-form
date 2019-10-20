import $ from 'jquery';
import './css/style.css';

if (module.hot) {
module.hot.accept('./helpers.js', function() {
console.log('Accepting the updated helper module!');
help();
})
}

