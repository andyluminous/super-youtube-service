var player;
var foundVids = [];
function onYouTubeIframeAPIReady () {
  player = new YT.Player('youtube-player');
}

function changeVideo (id) {
  console.log('changing to', id);
  player.loadVideoById(id);
  // toggleShowResults('off')
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
    let button = $(`<button>PLAY</button>`).val(el.id.videoId);
    titleDiv.append(img).append(titleP).append(button);
    titleDiv.appendTo($('#found-content'))
  })

  console.log($('button'));

  $('button').on('click',(event)=>{
    console.log('CLICKED',event)
    changeVideo(event.target.value);
  })  
}

function toggleShowResults (swtch) {
  if (swtch === 'on') {
    $('#found-content').show();
    $('button').on('click',(event)=>{
      console.log('CLICKED',event)
      changeVideo(event.target.value);
    })  
  } else {
    $('#found-content').hide();
  }
}