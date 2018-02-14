var player;
var foundVids = [];
var foundHash = {};
var historyVids;
function onYouTubeIframeAPIReady () {
  player = new YT.Player('youtube-player');
}

function playVideo (id, fromHistory) {
  player.loadVideoById(id);
  if (!fromHistory) {
    historyCtrl.set(foundHash[id]).done((data) => {
      historyVids.unshift(data.history);
      if (historyVids.length > 10) {
        historyVids.length = 10;
      }
      drawHistory(historyVids);
    });
  }
}

$(document).ready(function () {
  var searchFn = debounce(function () {
    $.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=5&key=AIzaSyAgUGmU-tT8fl7SeGH70i_ehR5X435CxkE&q=${$('#search-form').val()}`, getSearchResults);
  }, 250);

  $('#search-form').keydown(searchFn);
  $('#search-form').focusin(() => {
    if ($('#search-form').val() && foundVids.length) {
      toggleShowResults('on');
    }
  })
  $('#search-form').focusout(() => {
      setTimeout(() => {toggleShowResults('off')}, 250);
  })
  historyCtrl.get().done((data) => {
    historyVids = data.result;
    drawHistory(historyVids);
  });
  
})

function debounce (func, wait, immediate) {
  var timeout
  return function () {
    var context = this
    var args = arguments
    var later = function () {
      timeout = null
      if (!immediate) func.apply(context, args)
    }
    var callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
};

function getSearchResults (data) {
  if (data.items.length) {
    foundVids = data.items;
    foundHash = {};
    foundVids.forEach(el => {
      foundHash[el.id.videoId] = {
        videoId : el.id.videoId,
        title : el.snippet.title,
        thumbnail: el.snippet.thumbnails.default.url
      }
    })
    drawResults(foundVids);
  }  
}

function drawResults (data) {
  $('#found-content').empty();
  data.forEach(el => {
    let publishTime = new Date(el.snippet.publishedAt);
    let img = $(`<img src="${el.snippet.thumbnails.default.url}">`);
    let titleDiv = $(`<div></div>`).addClass('found-item');
    let titleP = $(`<p><strong>${el.snippet.title}</strong> <br> Published at: ${publishTime.toLocaleDateString('en-US')}</p>`)
    let button = $(`<button>PLAY</button>`).addClass('search-play').val(el.id.videoId);
    titleDiv.append(img).append(titleP).append(button);
    titleDiv.appendTo($('#found-content'))
  });

  $('.search-play').on('click',(event)=>{
    playVideo(event.target.value);
  });
}

function drawHistory (data) {
  let historyCnt = $('#history-content');
  historyCnt.empty();
  data.forEach(el => {
    let img = $(`<img src="${el.thumbnail}">`);
    let div = $(`<div></div>`).addClass('history-item');
    let p = $(`<p>${el.title}</p>`);
    let watchAgainButton = $(`<button>▶</button>`).addClass('history-play').val(el.videoId);
    let deleteButton = $(`<button>X</button>`).addClass('history-delete').val(el._id);
    div.append([img, p, watchAgainButton, deleteButton]);
    div.appendTo(historyCnt)
  })
  $('.history-play').on('click',(event)=>{
    playVideo(event.target.value, true);
  });
  $('.history-delete').on('click',(event)=>{
    historyCtrl.delete(event.target.value).done((data) => {
      historyCtrl.get().done((data) => {
        historyVids = data.result;
        drawHistory(historyVids);
      });
    })
  });
}

function toggleShowResults (swtch) {
  if (swtch === 'on') {
    $('#found-content').show();
    $('.search-play').on('click',(event)=>{
      playVideo(event.target.value);
    })  
  } else {
    $('#found-content').hide();
  }
}