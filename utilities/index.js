const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

module.exports = Util

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<li>'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + 'details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>'
        grid += '<div class="namePrice">'
        grid += '<hr />'
        grid += '<h2>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
      })
      grid += '</ul>'
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
  }

/**
 * Build the Detail view For Inventory Listing
 */

Util.buildDetailView = async function(data){
  let print
  if(data.length > 0){
    car = data[0]
    print = '<div id="inv-detail">'
    print += '<h2>'+car.inv_make+' '+car.inv_model+'</h2>'
    print += '<img src="' + car.inv_image+'" alt="Image of '+ car.inv_make + ' ' + car.inv_model+' on CSE Motors" />'
    print += '<div id="inv-detail-breakdown">'
    print += '<p><strong>Make: </strong>'+car.inv_make+'</p>'
    print += '<p><strong>Model: </strong>'+car.inv_model+'</p>'
    print += '<p><strong>Year: </strong>'+car.inv_year+'</p>'
    print += '<p><strong>Miles: </strong>'+car.inv_miles+'</p>'
    print += '<p><strong>Color: </strong>'+car.inv_color+'</p>'
    print += '<p><strong>Price: </strong>'+car.inv_price+'</p>'
    print += '<p>'+car.inv_description+'</p>'
    print += '</div>'
    print += '</div>'
  }
  return print
}