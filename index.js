// Some DOM reference
const form = $('#regForm');
const basic = $('#basicInfo');
const jobRole = $('select#jobRole');
const design = $('select#design');
const color = $('select#color');
const activities = $('fieldset#activities');
const activitiesInputs = $('fieldset#activities :checkbox');
const paymentMethod = $('#paymentMethod');
const paymentInfo = $('fieldset#payment > div');
const cc = $('div#credit-card');
const pp = $('div#paypal');
const bc = $('div#bitcoin');

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

cc.hide();
pp.hide();
bc.hide();
paymentMethod.change(function(e){
    // hide everything, if it's not already hidden 
    // (slideUp is not working as advertised)
    if(paymentInfo.not(':hidden')) paymentInfo.hide();
    const selected = $('option:selected', this);
    if(selected.val() === 'Credit Card'){
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
    const elemText = elem[0].title ? elem[0].title : elem[0].name;
    const warningText = `<p class="warning">The ${elemText} field requires a valid ${elemText}.</p>`
    $(warningText).insertAfter(elem);
}

// Remove the warning, so as to avoid duplicate warning messages
function removeWarning(elem){
    const warningP = '#' + elem.attr('id') + ' ~ p.warning';
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

// Input validation event handlers
const regExps = {
    // A simple name regex of my own devising
    name: /^([A-Za-z]+[.'-]?)+(( )?([A-Za-z]+[.'-]?))*/,
    // See https://emailregex.com/ and https://www.ietf.org/rfc/rfc5322.txt
    email: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
    // A simple credit card regex
    num: /\d[13,16]/,
    // A simple zip regex
    zip: /\d[5]/,
    // A simple ccv regex
    cvv: /\d[3]/
}

// Make sure a valid name and email have been entered
basic.on('input focusout', (e) => {
    if(e.target.type === 'text' || e.target.type === 'email'){
        checkElem(regExps[e.target.id], $(e.target))
    }
});

// Make sure that at least one of the conference events has been chosen
activities.on('focusout', (e) => {
    const checkedBoxes = $('fieldset#activities :checkbox:checked').length;
    removeWarning(activities);
    if(!checkedBoxes){
        addWarning(activities);
    }
} );

paymentMethod.on('input focusout', (e) => {
    removeWarning(paymentMethod);
    console.log(e);
    if(e.target.selectedOptions[0].textContent === 'Select Payment Method'){
        addWarning(paymentMethod);
    }
})

cc.on('change focusout', (e) => {
    if(paymentMethod.val() === 'Credit Card'){
        checkElem(regExps[e.target.id], $(e.target));
    }
});

