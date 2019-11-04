// Some DOM reference
const form = $('#regForm');
const name = $('input#name');
const email = $('input#mail');
const jobRole = $('select#jobRole');
const design = $('select#design');
const color = $('select#color');
const activities = $('fieldset#activities');
const activitiesInputs = $('fieldset#activities :checkbox');

form.submit(function(e){
    e.preventDefault();
})

// Create the "Other Role" input and hide it
const elem = $('<input id="otherRole" type="text" placeholder="Your Job Role" />').hide();
jobRole.after(elem);

// Hide the color options until a design theme is chosen
const colorOptions = $('select#color option')
colorOptions.hide();

// Event listener and handler for job-role change
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
    const design = $('select#design :selected');
    if(design.val() === 'js puns'){
        const puns = colorOptions.filter(function(index,item){
            const passes = $(this).text().indexOf('Puns') > 0;
            return passes;
        });
        puns.show()
    } else if(design.val() === 'heart js'){
        const hearts = colorOptions.filter(function(index,item){
            const passes = $(this).text().indexOf('I') > 0;
            return passes;
        });
        hearts.show();  
    }
})

// Attach a change listener and handler to the activities fieldset and when an activity is checked, disable any conflicting activities 
activities.change(function(e){
    // If this checkbox has a day and time, store it. Otherwise, exit the function.
    const targetInput = e.target;
    const targetTime = targetInput.dataset.dayAndTime;
    
    // Loop through the inputs
    activitiesInputs.each(function(index, item){
        // If this activity has a day and time, store it. Otherwise, exit the function.
        let thisTime = item.dataset.dayAndTime;
        
        // If our target's time is the same as this activity's time, then disable this activity
        if(targetTime === thisTime){
            // Use toggle to ensure that unchecking will re-enable conflicting events
            $(item).parent().toggleClass('grey');
            $(item).prop("disabled", function(index, value) { return !value; });
            //!NOTE: If this is not included, the target will also be greyed out and disabled and I have no idea why.
            $(targetInput).parent().removeClass('grey');
            $(targetInput).prop("disabled", false);
        }
    });
    
});

const paymentMethod = $('#paymentMethod')
const paymentInfo = $('fieldset#payment > div')
const cc = $('div#credit-card');
const pp = $('div#paypal');
const bc = $('div#bitcoin');
pp.hide();
bc.hide();
paymentMethod.change(function(e){
    // hide everything, if it's not already hidden 
    // (slideUp is not working as advertised)
    if(paymentInfo.not(':hidden')) paymentInfo.hide();
    const selected = $('option:selected', this);
    if(selected.val() === 'Credit Card' || selected.text() === 'Select Payment Method'){
        cc.toggle();
    }
    else if(selected.val() === 'PayPal'){
        pp.toggle();
    }
    else if(selected.val() === 'Bitcoin'){
        bc.toggle();
    }
})

// Add a warning message when appropriate
function checkElem(regex, elem){
    // Remove the warning, so as to avoid duplicate warning messages
    const warningP = '#' + elem[0].id + ' ~ p.warning';
    if($(warningP)) {
        $(warningP).remove();
    }
    elem.removeClass('warning');

    // Create and insert a warning message
    function addWarning(){
        elem.addClass('warning');
        const warningText = `<p class="warning">The ${elem[0].name} field requires a valid ${elem[0].name}.</p>`
        $(warningText).insertAfter(elem);
    }

    // If the elem is an input element, check it's value before adding a warning
    if(elem[0].nodeName === 'INPUT'){
        if(elem.val() === '' || !elem.val().match(regex)){
            addWarning();
            return false;
        } 
    // Otherwise just add the warning
    } else {
        addWarning();
    }
    return true;
}

// A simple name regex of my own devising
const nameRE = /[A-Za-z'-.]+(( )?([A-Za-z'-.]+)?)+/;

// A simple email regex of my own devising
const emailRE = /[A-Za-z.-]+\@[A-Za-z]+\.[A-Za-z]{2,3}\.?([A-Za-z]{2,3})?/;

// Make sure a valid name has been entered
name.on('input blur', () => checkElem(nameRE, name))
// Make sure a valid email has been entered
email.on('input blur', () => checkElem(emailRE, email));
// Make sure that at least one of the conference events has been chosen
activities.on('focusout', (e) => {
    if($('#activities :checkbox:checked').length <= 0){
        checkElem(null, activities);
    };
} );
// Remove the warning on the activities field once an activity is chosen
activitiesInputs.on('input', (e) => checkElem(null, activities))
