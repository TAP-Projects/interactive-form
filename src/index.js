import $ from 'jquery';
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

// Attach a change listener and handler to the activities fieldset and when an activity is checked, disable any conflicting activities 
const activities = $('fieldset#activities');
const inputs = $('fieldset#activities :checkbox');
activities.change(function(e){
    
    // If this checkbox has a day and time, store it. Otherwise, exit the function. (the return false is not working)
    if(e.target.dataset.dayAndTime === 'undefined') return false;
    const targetTime = e.target.dataset.dayAndTime;

    // If un-checking an item, re-enable any conflicting activities
    
    // Loop through the inputs
    inputs.each(function(index, item){
        console.log(item.dataset.dayAndTime)
        
        // If this activity has a day and time, store it. Otherwise, exit the function. (the return false is not working)
        if(item.dataset.dayAndTime === 'undefined') return false;
        const thisTime = item.dataset.dayAndTime;
        
        // If our target's time is the same as this activity's time, then disable this activity
        if(targetTime === thisTime){
            item.parentNode.style.color = 'red';
            //$(this).prop("disabled", true)
        }
    });
    
});