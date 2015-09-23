"use strict";

var ourWebsite = require("../url_base");

function formatCustomerInfo(dataArray) {
  var output = dataArray.map(function(dataItem) {
    var formattedCustomerInfo = { meta: {} }
    formattedCustomerInfo.meta.moreCustomerInfo = ourWebsite + "/customers/" + dataItem.id;
    formattedCustomerInfo.data = dataItem;

    return formattedCustomerInfo;
  })

  return output;
}

module.exports = formatCustomerInfo;
