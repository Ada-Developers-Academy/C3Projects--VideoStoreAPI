"use strict";

function format_date(days_to_add) {
  var today = new Date(Date.now() + (days_to_add * 24 * 60 * 60 * 1000)),
    today_dd = today.getDate(),
    today_mm = today.getMonth() + 1,
    today_yyyy = today.getFullYear(),
    target_date;
  if(today_dd < 10) { today_dd ='0'+ today_dd; }
  if(today_mm < 10) { today_mm ='0'+ today_mm; }
  target_date = today_yyyy + "-" + today_mm + "-" + today_dd;
  return target_date;
}

module.exports = format_date;
