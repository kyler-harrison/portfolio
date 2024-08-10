function contentLoad(event, contentName) {
    var allBtns = document.getElementsByClassName("content-button");
    var allContent = document.getElementsByClassName("content-tab");

    // set all buttons to default color
    for (var i = 0; i < allBtns.length; i++) {
        allBtns[i].style.color = "#f2f2f2";
    }

    // hide all content
    for (var i = 0; i < allContent.length; i++) {
        allContent[i].style.display = "none";
    }

    // update color of clicked button and display content
    var clickedBtn = event["srcElement"];
    var contentElem = document.getElementsByClassName(contentName)[0];
    contentElem.style.display = "flex";
    clickedBtn.style.color = "#aaaaaa";
    contentElem.scrollIntoView({"behavior": "smooth"});
}