import $ from 'jquery';
//import help from './js/helpers.js';
//import 'normalize.css';
import './css/style.scss';

// Some DOM reference
const form = $('#regForm');
const name = $('input#name');
const mail = $('input#mail');
const jobRole = $('select#jobRole');
const size = $('select#size');
const design = $('select#design');
const color = $('select#color');
// Do I need all of those activities?

form.submit(function(e){
    e.preventDefault();
})

// Create the "Other Role" input and hide it
const elem = $('<input id="otherRole" type="text" placeholder="Your Job Role" />').hide();
jobRole.after(elem);

// Hide the color options until a design theme is chosen
const colorOptions = $('select#color option')
colorOptions.hide();

// Event listener and handler for job role change
jobRole.change(function(){
    const otherRole = $('#otherRole');
    if($('select#jobRole :selected').val() === 'other'){
        otherRole.slideDown();
    } else if(otherRole.is(':visible')){
        otherRole.slideUp();
    }
});

// Event listener and handler for design change
design.change(function(){
    colorOptions.hide();
    if($('select#design :selected').val() === 'js puns'){
        const puns = colorOptions.filter(function(index,item){
            const passes = $(this).text().indexOf('Puns') > 0;
            return passes;
        });
        console.log(puns);
        puns.show()
    } else if($('select#design :selected').val() === 'heart js'){
        const hearts = colorOptions.filter(function(index,item){
            const passes = $(this).text().indexOf('I') > 0;
            return passes;
        });
        hearts.show();  
    }
})