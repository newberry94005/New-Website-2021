let pirateRoom = {};

pirateRoom.setPirateRoomPage = ()=> {
    utils.stopLoading();
    console.log("inside pirateRoom page");


    $(".bookNowLargeButtonRoom, .bookNowLargeButton").off().on("click", ()=>{
        viewManager.bookNow("DAVY");
    })

    home.setOtherRooms();

}

