$(function(){
    init();
    $('#add-to-list').click(addToList);
});

function init(){
    chrome.storage.local.get('ReadingList', function(data){
        var readingList = [];
        if(data.ReadingList)
            readingList = JSON.parse(data.ReadingList);

        clearReadingList();
        displayReadingList(readingList);
    });
}

function clearReadingList(){
    $('#reading-list').empty();
}

function displayReadingList(readingList){
    for(var i = 0; i < readingList.length; i++){
        if(readingList[i] && readingList[i].url && readingList[i].title){
            var itemToAdd = '<button type="button" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center open-item" id="'
                + readingList[i].url + '">' + readingList[i].title + '<span class="badge badge-danger badge-pill delete-item" id="x'
                + readingList[i].url + '">X</span></button>';

            $('#reading-list').append(itemToAdd);
        }
    }

    $('.list-group-item').each(function(){
        $(this).click(openItem);
    });
}

function addToList(event){
    chrome.storage.local.get('ReadingList', function(data){
        var readingList = [];
        if(data.ReadingList)
            readingList = JSON.parse(data.ReadingList);

        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs){
            if(tabs[0]){  
                var newItem = {
                    title: tabs[0].title,
                    url: tabs[0].url
                };

                readingList.push(newItem);
                chrome.storage.local.set({ 'ReadingList': JSON.stringify(readingList) }, init);
            }
        });
    });
}

function openItem(event){
    var url = event.currentTarget.id;
    removeItem(url, function(){
        chrome.tabs.create({ url: url, active: true });
    });
}

function removeItem(url, callback){
    chrome.storage.local.get('ReadingList', function(data){
        var readingList = [];
        if(data.ReadingList)
            readingList = JSON.parse(data.ReadingList);

        for(var i = 0; i < readingList.length; i++){
            if(readingList[i].url == url){
                readingList.splice(i, 1);
                chrome.storage.local.set({ 'ReadingList': JSON.stringify(readingList) }, callback);
            }
        }
    });
}
