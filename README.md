# Interactive Form Demonstration

NOTE: This project is a part of Treehouse's Full Stack JavaScript Techdegree Program

## What is this?

This projects demonstrates several form interacitvity and validation techniques accomplished using the jQuery library, and observing best practices for graceful degradation and cross-browser/legacy-browser consistency.

## How do I use this?

The form is deployed here:

https://julianjohannesen.github.io/interactive-form/

Please feel free to try out various combinations of form entries.

In particular please note that:

- On page load, focus is set on the first text field
- When the "Other" option is selected from the "Job Role" drop down menu, a new text field appears below into which the user can add a non-standard job role.
- In the "T-Shirt Info" section, until a theme is selected from the "Design" menu, no color options appear in the "Color" drop down and the "Color" field reads "Please select a T-shirt theme". Furthermore, only color options that match the design selected in the "Design" menu will appear.
- When a new theme is selected from the "Design" menu, both the "Color" field and drop down menu is updated.
- In the "Register for Activities" section, if the user selects a workshop, any workshop with a conflicting time will be disabled. Unchecking an activity re-enables any conflicting activities.
- As a user selects activities, a running total displays below the list of checkboxes. For example, if the user selects "Main Conference", then Total: $200 should appear. If they add 1 workshop, the total should change to Total: $300.
- In the "Payment Info" section, only the payment sections related to the payment option chosen in the select menu appear.
- Validation does not rely on HTML5 validation or the  Validation Constraint API
- The name, email, and credit card fields all provide custom error messages in real time and on submit.
- The user must select at least one checkbox under the "Register for Activities" section of the form.

## Issues

Please report any issues here: https://github.com/julianjohannesen/interactive-form/issues