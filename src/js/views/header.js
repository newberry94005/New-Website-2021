let header = {};

header.autoRun = true;
header.location = "#header";
header.refreshData = true;
header.checkHoursInterval;


header.setHeader = ()=>{

    $(header.location).html(templates.header());

    setHoursInterval();
    checkHours(moment());

    $(".back_to_top").off().on("click", function(){
        $('html, body').animate({scrollTop: 0}, 'slow');
    })

    $("#gamesButton, #gamesButtonMobile, .mobile_logo").off().on("click", function(){
        viewManager.registerView("#home");
        removeNavSlider();
    })

    $("#faqsButton, #faqsButtonMobile").off().on("click", function(){
        viewManager.registerView("#faqs");
        removeNavSlider();
    })

    $("#groupsButton, #groupsButtonMobile").off().on("click", ()=>{
        viewManager.registerView("#groups");
        removeNavSlider();
    })

    $("#whatButton, #whatButtonMobile").off().on("click", ()=>{
        viewManager.registerView("#what");
        removeNavSlider();
    })

    $("#howButton, #howButtonMobile").off().on("click", ()=>{
        viewManager.registerView("#how");
        removeNavSlider();
    })

    $("#giftcardsButton, #giftcardsButtonMobile").off().on("click", ()=>{
        viewManager.registerView("#giftcards");
        removeNavSlider();
    })

    $(".book_now_button, .book_now_button_mobile").off().on("click", ()=>{
        viewManager.bookNow("HEADER");
    })

    $("#choiceAwardBanner, #choiceAwardBannerMobile").off().on("click", function(){
		window.open("https://www.tripadvisor.com/Attraction_Review-g54171-d8513810-Reviews-Escape_in_60-Charleston_South_Carolina.html","_blank");
    });
    
    $("#annoucementBanner, #annoucementBannerMobile").off().on("click", function(){
        window.open("booknow.html", "_self");
    });
    


    $(".nav_hamburger").off().on("click", function(){
	   
        if(utils.checkForMobile){
            showNavSlider(); 
        }
     });
     
     $(".nav_slider_block").off().on("click", function(){
         
         removeNavSlider();
         
     })
     
     // Show the Mobile Nav Slider
     function showNavSlider(){
         
        $(".nav_slider_block").show();
        $(".nav_slider").css("right", "0"); 
         
     }
     
     function removeNavSlider(){
         
        $(".nav_slider_block").hide();
        $(".nav_slider").css("right", "-80vw"); 
         
     }

     header.setCallOptions();
     header.setMapOptions();

}

header.setMapOptions = ()=>{
    $(".map_nav").off().on("click", function(){
        if(config.analytics){
            gtag('event', "MAP Clicked", {
                'event_category': "Business Details",
                'event_label': "Mobile: "+app.isMobile
            });
        }
    })
}

header.setCallOptions = ()=>{
    $(".phone_nav").off().on("click", function(){
        utils.showSwal("Do you want to Call or Text?", "","",true,true,'<i class="fas fa-mobile"></i>&nbsp;Call Us',true,'<i class="fas fa-comment-dots"></i>&nbsp;Text Us').then(function(result){
            // Confirm TEXT

            if(result){
                if(config.analytics){
                    gtag('event', "TEXT Clicked", {
                        'event_category': "Business Details",
                        'event_label': "Mobile: "+app.isMobile
                    });
                }
                window.open('sms:843-709-6266', '_self');
            }
        }).catch(function(result){
            // Cancel Button means CALL

            if(result.dismiss == "cancel"){
                if(config.analytics){
                    gtag('event', "PHONE Clicked", {
                        'event_category': "Business Details",
                        'event_label': "Mobile: "+app.isMobile
                    });
                }
                window.open('tel:843-709-6266', '_self');
            }
        });
    })
}

// Check the Date/Time and Update it
function setHoursInterval(){
    clearInterval(header.checkHoursInterval);
    // Every 15 minutes check for a new time
    header.checkHoursInterval = setInterval(function(){
        checkHours(moment());
        header.refreshData = true;
    }, 600000);
}


// Use the supplied Hours to set the values
async function checkHours(dateTime){
    // Grab the hours information from the DB
    home.hoursInfo = await apiGet.getHoursData();

    var dayOfWeek = moment(dateTime).format('dddd');
    var currentDate = moment(dateTime).format("YYYY-MM-DD");
    var dayOfWeekStart = currentDate+ 'T' +home.hoursInfo.codeHours.startingTimes[dayOfWeek.toLowerCase()];
    var dayOfWeekEnd = currentDate+ 'T' +home.hoursInfo.codeHours.endTimes[dayOfWeek.toLowerCase()];
    var closingHour = moment(dayOfWeekEnd).fromNow();
    
    $('.calendar_item[data-value="'+dayOfWeek+'"]').find(".day").html('<span class="active_day" style="color: #3be631;text-shadow: 0px 0px 2px black;"><i class="fas fa-calendar-check"></i></span> '+dayOfWeek+' :')
    
    let openStatus = "";
    let closingStatus = '';
    
    /**** ONLY WHEN DAYS ARE CLOSED ***/

    if(isDayClosed(dayOfWeek)){
        openStatus = `<i class="fal fa-clock"></i><br><span style="color:#dd0d0d;font-weight:bold;text-shadow: 1px 1px 0px #3c3c3c;">We're Closed</span>`;
        closingStatus = `Check our availability for another day and book your next escape adventure! `;
    }else{
        //console.log(moment(dateTime).isBetween(dayOfWeekStart, dayOfWeekEnd));
        if(moment(dateTime).isBetween(dayOfWeekStart, dayOfWeekEnd)){
            openStatus = `<i class="fal fa-clock"></i><br><span style="color:#00e600;font-weight:bold;text-shadow: 1px 1px 0px #3c3c3c;">We're Open</span>`;
            closingStatus = `Closing ${closingHour}. Check our availability and book your next escape adventure! `;
        }else{
            openStatus = `<i class="fal fa-clock"></i><br><span style="color:#dd0d0d;font-weight:bold;text-shadow: 1px 1px 0px #3c3c3c;">We're Closed</span>`;
            closingStatus = `Check our availability and book your next escape adventure! `;
        }
    }
    
    $(".hours_modal_status").html(openStatus);
    $(".more_info_box_hours .different_text").html(closingStatus);
    $(".status_text").html(openStatus);	
    $(".nav_slider_hours").html(openStatus);    
}

function isDayClosed(day){
    let isClosed = false;
    for( let item in home.hoursInfo.closedDays){
        if(item === day.toLowerCase() && home.hoursInfo.closedDays[item]){
           isClosed = true;
        }
    }

    return isClosed;
}

$(document).ready(function() {
    // IF AUTORUN IS ON, START THE PAGE
    if(header.autoRun){
        header.setHeader();
    }
});


