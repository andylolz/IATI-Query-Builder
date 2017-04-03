$(function() {
  var o = {
    allow_single_deselect: true,
    search_contains: true
  };
  $(".chosen-select").chosen(o);

  $('select,input').on('change', function() {
    refresh();
  });

  var refresh = function() {
    $('#data-table').hide()
    $('#download-csv').hide()
    $('#loading').show()
    var datastore_url = 'http://datastore.iatistandard.org/api/1/access/'

    var format = $('[name=format]:checked').val()
    datastore_url += format

    var group_by = $('[name=group_by]:checked').val()
    datastore_url += group_by

    datastore_url += '.csv'

    var reporting_org = $('#reporting-org').val()
    if (reporting_org) {
      datastore_url += '?reporting-org=' + reporting_org.join('|')
    } else {
      $('#loading').hide()
      return
    }

    Papa.parse(datastore_url, {
      download: true,
      skipEmptyLines: true,
      worker: true,
      complete: function(results) {
        var $table = $('#data-table');
        $table.html(dataToHtml(results.data));
        $('#loading').hide()
        $table.show()
        // $table.DataTable();
        // $table.floatThead({
        //   scrollContainer: function($table) {
        //     return $table.closest('.table-container');
        //   }
        // });

        var stream = $('[name=stream]:checked').val()
        if (stream === 'True') {
          datastore_url += '&stream=True'
        }

        $('#download-csv').attr('href', datastore_url).show()
      }
    });

    function dataToHtml(data) {
      var s = '<thead><tr>'
      $.each(data[0], function(idx, value) {
        s += '<td>'
        s += value
        s += '</td>'
      })
      s += '</tr></thead><tbody>'
      data = data.slice(1)
      $.each(data, function(idx, row) {
        s += '<tr>'
        $.each(row, function(idx, value) {
          s += '<td>'
          s += value
          s += '</td>'
        })
        s += '</tr>'
      })
      s += '</tbody>'
      return s
    }
  }
});
