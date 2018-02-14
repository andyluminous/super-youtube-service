const historyCtrl = (function() {
  return {
    get: function() {
      return $.ajax({
        method: 'GET',  
        url: '/api/history'
      });
    },
    set: function(data) {
      return $.ajax({
        method: 'POST',  
        url: '/api/history', 
        data: JSON.stringify(data),
        contentType: 'application/json',
      });   
    },
    delete: function(data) {
        return $.ajax({
            method: 'DELETE',  
            url: `/api/history/${data}`, 
          }); 
    },
  };
  })();
