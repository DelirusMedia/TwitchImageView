var lastMessage = null;
var imageRegex = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp))/i;
var chatLines;

var referrerBlock = document.createElement("meta");
referrerBlock.name = "referrer";
referrerBlock.content = "never";

function getNewMessages(){
    if (lastMessage === null){
        lastMessage = chatLines.children[chatLines.children.length-1];
        console.log(lastMessage);
        return Array.prototype.slice.call(chatLines.children);
    } else {
        var nextMessages = [];
        while (lastMessage.nextElementSibling !== null){
            nextMessages.push(lastMessage.nextElementSibling);
            lastMessage = lastMessage.nextElementSibling;
        }
        return nextMessages;
    }
}

function embedImages(messageDiv){
    var message = messageDiv.childNodes[4].innerHTML;
    var imageUrlMatches = message.match(imageRegex);

    if (imageUrlMatches !== null){
        var imageUrl = imageUrlMatches[0];

        try {
			var div = document.createElement("div");
			var imageInsert = document.createElement("a");
			imageInsert.href = imageUrl;
			imageInsert.target = "_blank";
			imageInsert.style.display = "block";

			var newImage = document.createElement("img");
			newImage.src = imageUrl;
			newImage.style.border = "1px solid black";
			newImage.style.maxHeight = "150px";
			newImage.style.maxWidth = "100%";

			imageInsert.appendChild(newImage);
			messageDiv.childNodes[4].appendChild(imageInsert);
		}
		catch(err) {
			console.log(err.message);
		}
		
    }
}

function processNewMessages(){
    getNewMessages().forEach(function(newMessage){
        embedImages(newMessage);
    });
}

function initialize(){
    var remWelcome = document.getElementsByClassName("tw-flex-grow-1 tw-full-height tw-pd-b-1")[0];
    try {
		remWelcome.removeChild(remWelcome.childNodes["0"]);
	}
	catch(err) {
		console.log(err.message);
	}
    chatLines = document.getElementsByClassName("tw-flex-grow-1 tw-full-height tw-pd-b-1")[0];
    console.log(chatLines);

    if(navigator.userAgent.toLowerCase().indexOf('chrome') > -1){
        var observer = new MutationObserver(processNewMessages);
        var config = { attributes: false, childList: true, characterData: false };
        observer.observe(document.getElementsByClassName("tw-flex-grow-1 tw-full-height tw-pd-b-1")[0], config);
    } else {
        var refreshInterval = setInterval(function(){
            chatLines = document.getElementsByClassName("tw-flex-grow-1 tw-full-height tw-pd-b-1")[0];
            processNewMessages();
        }, 500);
    }
}

var waitForChatLines = setInterval(function(){
    if (document.getElementsByClassName("tw-flex-grow-1 tw-full-height tw-pd-b-1").length > 0){
        initialize();
		clearInterval(waitForChatLines);
    }
}, 5000);
