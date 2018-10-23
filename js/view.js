
function setView(){
    $("#main-clock").html("<a href=\"http://bluebus.sites.haverford.edu\" style=\"text-decoration:none;color:white\">bluebus.sites.haverford.edu</a>");
    //$("#main-clock-desc").html("Bus leaves in:");
    //$("#small-clock").html("See you there");
    //$("#small-clock-desc").html(bus.toDateFormat(dates[1], false) + " bus leaves in:");

    $('#currentViewHeader').text('Bluebus Page');
    $('#currentViewDesc').text('Has Moved To');

    $('#currentViewHeader').removeClass('bmc-header');
    $('#currentViewHeader').addClass('hc-header');
    $('#currentViewDesc').removeClass('bmc-desc');
    $('#currentViewDesc').addClass('hc-desc');

    $('.time').css({'background': '#A60000'});
    $('.small-clock').css({'background': '#A60000'});
}
