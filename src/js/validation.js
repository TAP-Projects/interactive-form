export default function validate() {

    // Cannot submit unless this is true
    //$('#activities :checkbox:checked').length > 0
    const email = $('#mail');
    email.on('input', function(e){
        if (email.validity.typeMismatch) {
          email.setCustomValidity("Please enter a valid email address.");
        } else {
          email.setCustomValidity("");
        }
      })


}