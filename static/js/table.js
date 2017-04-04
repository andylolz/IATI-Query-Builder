$(function() {
  var o = {
    allow_single_deselect: true,
    search_contains: true
  };
  $(".chosen-select").chosen(o)

  $('#submit').on('click', function() {
    refresh()
  });

  $('#reset').on('click', function() {
    reset()
  });

  var reset = function() {
    if ($.fn.dataTable.isDataTable('#data-table')) {
      $('#data-table').DataTable().destroy()
    }
    $('#pinned-results').hide()
    $('#download-csv').hide()
  }

  var refresh = function() {
    reset()
    $('#data-table').hide()
    $('#loading').show()
    $('#pinned-results').show()
    var datastore_url = 'http://datastore.iatistandard.org/api/1/access/'
    var proxy_url = 'https://allorigins.me/get?method=raw&url='

    var format = $('[name=format]:checked').val()
    datastore_url += format

    var group_by = $('[name=group_by]:checked').val()
    datastore_url += group_by

    datastore_url += '.csv'

    var reporting_org = $('#reporting-org').val()
    var reporting_org_type = $('#reporting-org-type').val()
    var sector = $('#sector').val()
    var recipient_country = $('#recipient-country').val()
    var recipient_region = $('#recipient-region').val()

    var datastore_url_params = []
    if (reporting_org) {
      datastore_url_params.push('reporting-org=' + reporting_org.join('|'))
    }
    if (reporting_org_type) {
      datastore_url_params.push('reporting-org.type=' + reporting_org_type.join('|'))
    }
    if (sector) {
      datastore_url_params.push('sector=' + sector.join('|'))
    }
    if (recipient_country) {
      datastore_url_params.push('recipient-country=' + recipient_country.join('|'))
    }
    if (recipient_region) {
      datastore_url_params.push('recipient-region=' + recipient_region.join('|'))
    }

    if (datastore_url_params.length > 0) {
      datastore_url += '?'
      datastore_url += datastore_url_params.join('&')
    }

    Papa.parse(proxy_url + encodeURIComponent(datastore_url), {
      download: true,
      skipEmptyLines: true,
      worker: true,
      complete: function(results) {
        var $table = $('#data-table');
        $table.html(dataToHtml(results.data));
        $('#loading').hide()
        $table.show()
        $table.DataTable({
        "paging":    false,
        "ordering":  false,
        "info":      false,
        "searching": false
        });
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
