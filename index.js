// Cost
let totalCost = 0;
// Error flag
let hasError = false;

// BASIC INFO AREA ==================================================================

// DOM refs
const form = $('#regForm');
const basic = $('#basicInfo');
const jobRole = $('select#jobRole');
const otherRole = $('input#otherRole');
// Hide the other-role field
otherRole.hide();
// If the user selects 'other', show the 'Other' field
jobRole.change(e=> $(e.target).val() === 'other' ? otherRole.toggle() : otherRole.hide());

// T-SHIRT AREA =====================================================================

// DOM refs
const design = $('select#design');
const colorDiv = $('#colors-js-puns');
const colorOptions = $('select#color option');

// Hide the color options until a design theme is chosen
colorDiv.hide();

// Do not show the t-shirt color options until the user selects a design, and then show only the relevant t-shirt color options, with the first options selected
design.change(e=>{
    // Hide the color div and color options
    colorDiv.hide();
    colorOptions.hide();
    // findOptions takes a jQuery collection and a string, and returns a jQuery collection of items containing that string
    function findOptions(elem, text){
        return elem.filter(function (index, item) {   
            const passes = $(this).text().indexOf(text) > 0;
            return passes;
        });
    }
    // If the user selects the 'js puns' designs, show the puns colors
    if (design.val() === 'js puns') {
        // Show the color section
        colorDiv.show();
        // Show the puns options with the first option selected
        findOptions(colorOptions, 'Pun').show().first().prop('selected', true);
        // Else, if the user selects the 'heart js' designs, show the heart colors
    } else if (design.val() === 'heart js') {
        colorDiv.show();
        // Show the heart options with the first option selected
        findOptions(colorOptions, 'I').show().first().prop('selected', true);
    }
});

// ACTIVITIES AREA ==================================================================

// DOM refs
const activities = $('fieldset#activities');
const activitiesInputs = $('fieldset#activities :checkbox');

// Prevent the user from choosing events that conflict with one another and also keep a running total of the total cost of the events selected
activities.change(e=>{
    
    // Grab the event's day/time and cost
    const targetInput = e.target;
    const targetTime = targetInput.dataset.dayAndTime;
    const targetCost = parseInt(targetInput.dataset.cost.substring(1));
    
    // Loop through the inputs and check for conflicting events, disabling them or re-enabling them
    activitiesInputs.each(function (index, item) {
        // Grag the current event's date/time
        let thisTime = item.dataset.dayAndTime;

        // If there's a conflict, i.e. if our target's time is the same as this activity's time, then disable the current activity (not the target activity)
        if (targetTime === thisTime) {
            // Use toggle to ensure that unchecking will re-enable conflicting events
            $(item).parent().toggleClass('grey');
            // For properties like 'disabled' we use prop(). Here we're basically toggling the properties value by using props() option callback parameter. If it's disabled, enable it. If it's enabled, disable it.
            $(item).prop("disabled", function (index, value) { return !value; });
            //!NOTE: If this is not included, the target will also be greyed out and disabled and I have no idea why.
            $(targetInput).parent().removeClass('grey');
            $(targetInput).prop("disabled", false);
        }
    });

    // For any item that's checked, add it's cost to the total cost
    if ($(targetInput).is(':checked')) {
        totalCost += targetCost;
    // If after checking the checkbox, the checkbox is unchecked, then we want to remove the cost of this activity from the running total.
    } else {
        totalCost -= targetCost;
    }

    // Show the running total cost
    $('.totalCost').text(`Total cost: \$${totalCost}`).show();

});

// Create the running total cost element and insert it after the activities section, then hide it.
const conCost = `<p class="totalCost">Total cost: $${totalCost}.</p>`;
$(conCost).insertAfter(activities).hide();

// PAYMENT AREA =====================================================================

// DOM refs
const paymentInfo = $('fieldset#payment > div');
const paymentMethod = $('select#paymentMethod');
const cc = $('div#credit-card');
const pp = $('div#paypal');
const bc = $('div#bitcoin');

// Show the credit card info by default
$('select#paymentMethod option[value="Credit Card"]').prop('selected',true);
cc.show()
// Hide other options
pp.hide();
bc.hide();
// These methods will hide the payment information for all but the selected payment type
const showInfo = {
    'Credit Card': ()=>{paymentInfo.hide(); cc.toggle()},
    'PayPal': ()=>{paymentInfo.hide(); pp.toggle()},
    'Bitcoin': ()=>{paymentInfo.hide(); bc.toggle()}
}
// When the user selects a payment method, show the corresponding payment details
paymentMethod.change(e=>showInfo[$(e.target).val()]())

// Create and insert a warning message
function addWarning(elem, warningText) {
    hasError = true;
    elem.addClass('warning');
    if (!warningText) {
        const elemText = elem.attr('title') ? elem.attr('title') : elem.attr('name');
        warningText = `<p class="warning">The ${elemText} field requires a valid ${elemText}.</p>`
    }
    $(warningText).insertAfter(elem);
}

// Remove the warning, so as to avoid duplicate warning messages
function removeWarning(elem) {
    hasError = false;
    const warningP = '#' + elem.attr('id') + ' ~ p.warning';
    if ($(warningP)) {
        $(warningP).remove();
    }
    elem.removeClass('warning');
}

// Add a warning message when appropriate
function checkElem(regex, elem) {
    // Prevent duplicate warnings
    removeWarning(elem);
    // If the elem has no value or a non-matching value
    if (elem.val() === '' || !elem.val().match(regex)) {
        // then add the warning
        addWarning(elem);
        return true;
    }
    return false;
}

// Regular expressions for input validation event handler
const regExps = {
    // A simple name regex of my own devising
    name: /^([A-Za-z]+[.'-]?)+(( )?([A-Za-z]+[.'-]?))*/,
    // See https://emailregex.com/ and https://www.ietf.org/rfc/rfc5322.txt
    email: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
    // A simple credit card regex
    num: /^\d{13,16}$/,
    // A simple zip regex
    zip: /^\d{5}$/,
    // A simple ccv regex
    cvv: /^\d{3}$/
}

// Make sure a valid name and email have been entered
basic.on('input focusout', (e) => {
    if (e.target.type === 'text' || e.target.type === 'email') {
        checkElem(regExps[e.target.id], $(e.target))
    }
});

// Make sure that at least one of the conference events has been chosen
activities.on('focusout', (e) => {
    // This is sort of redundant given that I already have 'activities', but I wanted to make everything as 'pure' as possible
    const acts = $(e.target).parent().parent();
    const checkedBoxes = $('fieldset#activities :checkbox:checked').length;
    removeWarning(acts);
    if (!checkedBoxes) {
        addWarning(acts);
    }
});

paymentMethod.on('input focusout', (e) => {
    const target = $(e.target);
    const selected = '#' + e.target.id + ' option:selected';
    removeWarning(target);
    if ($(selected).text() === 'Select Payment Method') {
        addWarning(target);
    }
})

cc.on('input focusout', (e) => {
    if (paymentMethod.val() === 'Credit Card') {
        checkElem(regExps[e.target.id], $(e.target));
    }
});


// Handle the form submit event
form.submit(function (e) {
    e.preventDefault();

    // Remove any previous warnings to avoid duplicate warnings
    removeWarning(form);

    const checkedBoxes = $('fieldset#activities :checkbox:checked').length;
    const ccYes = paymentMethod.val() === 'Credit Card' ? true : false;

    if (
        // A valid name must be present
        checkElem(regExps['name'], $('#name'))
        ||
        // A valid email must be present
        checkElem(regExps['email'], $('#email'))
        ||
        // A conference activity must be selected
        !checkedBoxes
        ||
        // A payment method must be selected
        ($('#paymentMethod option:selected').text() === 'Select Payment Method')
        ||
        // If the payment method is credit card, valid credit card details must be present
        (ccYes && checkElem(regExps['num'], $('#num')))
        ||
        (ccYes && checkElem(regExps['zip'], $('#zip')))
        ||
        (ccYes && checkElem(regExps['cvv'], $('#cvv')))
    ) {
        hasError = true;
    } else {
        hasError = false;
    }

    // If the hasError flag is true, there's an error somewhere on the page
    if (hasError) {
        addWarning(form, '<p class="warning">Your form is missing required information or there is an error in one of the form fields.</p>');
    } else {
        console.log("Form submitted successfully.")
    }
});








 // const paymentType = $(e.target).val();
    // if      (paymentType === 'Credit Card') cc.toggle();
    // else if (paymentType === 'PayPal') pp.toggle();
    // else if (paymentType === 'Bitcoin') bc.toggle();