let witchRoom = {};

witchRoom.setWitchRoomPage = ()=> {
    utils.stopLoading();
    console.log("inside witchRoom page");


    $(".bookNowLargeButtonRoom, .bookNowLargeButton").off().on("click", ()=>{
        viewManager.bookNow("WITCH");
    })

    home.setOtherRooms();

}

