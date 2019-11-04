// Some DOM reference
const form = $('#regForm');
const name = $('input#name');
const email = $('input#mail');
const jobRole = $('select#jobRole');
const design = $('select#design');
const color = $('select#color');
const activities = $('fieldset#activities');
const activitiesInputs = $('fieldset#activities :checkbox');

// Cost
let totalCost = 0;

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

// Attach a change listener and handler to the activities fieldset and when an activity is checked, disable any conflicting activities. Also add the acitivity's cost to the total cost or remove it as appropriate.
activities.change(function(e){

    // Grab the event's day/time and cost
    const targetInput = e.target;
    const targetTime = targetInput.dataset.dayAndTime;
    const targetCost = parseInt(targetInput.dataset.cost.substring(1))                                  ;

    // Loop through the inputs and check for conflicting events, disabling them or re-enabling them
    activitiesInputs.each(function(index, item){
        // Grag the current event's date/time
        let thisTime = item.dataset.dayAndTime;
        
        // If there's a conflict, i.e. if our target's time is the same as this activity's time, then disable the current activity (not the target activity)
        if(targetTime === thisTime){
            // Use toggle to ensure that unchecking will re-enable conflicting events
            $(item).parent().toggleClass('grey');
            // For properties like 'disabled' we use prop(). Here we're basically toggling the properties value. If it's disabled, enable it. If it's enabled, disable it.
            $(item).prop("disabled", function(index, value) { return !value; });
            //!NOTE: If this is not included, the target will also be greyed out and disabled and I have no idea why.
            $(targetInput).parent().removeClass('grey');
            $(targetInput).prop("disabled", false);
        }
    });

    // For any item that's checked, add it's cost to the total cost
    if($(targetInput).is(':checked')){
        totalCost += targetCost;
    // If after checking the checkbox, the checkbox is unchecked, then we want to remove the cost of this activity from the running total.
    } else {
        totalCost -= targetCost;
    }

    $('.totalCost').text(`Total cost: ${totalCost}`).show();
    console.log(totalCost);
    
});

const conCost = `<p class="totalCost">Total cost: $${totalCost}.</p>`;
$(conCost).insertAfter(activities).hide();

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

// Create and insert a warning message
function addWarning(elem){
    elem.addClass('warning');
    const warningText = `<p class="warning">The ${elem[0].name} field requires a valid ${elem[0].name}.</p>`
    $(warningText).insertAfter(elem);
}

// Remove the warning, so as to avoid duplicate warning messages
function removeWarning(elem){
    const warningP = '#' + elem[0].id + ' ~ p.warning';
    if($(warningP)) {
        $(warningP).remove();
    }
    elem.removeClass('warning');
}

// Add a warning message when appropriate
function checkElem(regex, elem){
    // Prevent duplicate warnings
    removeWarning(elem);
    // If the elem has no value or a nonmatching value
    if(elem.val() === '' || !elem.val().match(regex)){
        // then add the warning
        addWarning(elem);
    } 
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
    const checkedBoxes = $('fieldset#activities :checkbox:checked').length;
    removeWarning(activities);
    if(!checkedBoxes){
        addWarning(activities);
    }
} );

