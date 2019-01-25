
function setView(){
    $("#main-clock").html("<a href=\"https://www.brynmawr.edu/transportation/blue-bus-bi-co\" style=\"text-decoration:none;color:white\">College Blue Bus Page</a>");
    //$("#main-clock-desc").html("Bus leaves in:");
    //$("#small-clock").html("See you there");
    //$("#small-clock-desc").html(bus.toDateFormat(dates[1], false) + " bus leaves in:");

    $('#currentViewHeader').text('Blue Bus App');
    $('#currentViewDesc').text('Is currently down. :( In the meantime, use the');

    $('#currentViewHeader').removeClass('bmc-header');
    $('#currentViewHeader').addClass('hc-header');
    $('#currentViewDesc').removeClass('bmc-desc');
    $('#currentViewDesc').addClass('hc-desc');

    $('.time').css({'background': '#A60000'});
    $('.small-clock').css({'background': '#A60000'});
    $('.small-clock').text("We're working on a fix!");
}
