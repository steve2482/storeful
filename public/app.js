const ROOT_URL = 'http://localhost:8080';

// Mock data
let INVENTORY_ITEMS = {
  items: [
    {
      id: "1111",
      itemName: "Can of Tomato Soup",
      unitPrice: 0.50,
      retailPrice: 0.99,
      balanceOnHand: 10,
      requestedInventoryLevel: 5,
      sold: 0,
      vendor: "The Soup Company"
    },
    {
      id: "2222",
      itemName: "Box of Cereal",
      unitPrice: 1.50,
      retailPrice: 2.99,
      balanceOnHand: 5,
      requestedInventoryLevel: 5,
      sold: 2,
      vendor: "The Cereal Company"
    },
    {
      id: "3333",
      itemName: "8 Pack of Paper Towels",
      unitPrice: 3.00,
      retailPrice: 5.99,
      balanceOnHand: 20,
      requestedInventoryLevel: 30,
      sold: 6,
      vendor: "The Cleaning Company"
    },
    {
      id: "4444",
      itemName: "Laundry Detergent 100oz",
      unitPrice: 5.75,
      retailPrice: 11.95,
      balanceOnHand: 2,
      requestedInventoryLevel: 4,
      sold: 2,
      vendor: "The Cleaning Company"
    }
  ]
};

$(document).ready(function() {
  function validateUser() {
    let user = $('#user-name').val();
    let password = $('#password').val();
    if (user === '' && password === '') {
      $('.sign-in').hide();
      $('.business-display').show();
      $('.navigation').show();
      $('.add-item').show();
      $('.business-inventory').show();
    }
  }

  function getInventoryItems(callbackFn) {
    $.get(ROOT_URL + '/inventory', function(data) {
      callbackFn(data);
    });
  }

  function displayInventoyItems(data) {
    let id = 1;
    for (let i = 0; i < data.length; i++) {
      $('#inventory-items').append(
        `<tr>
          <td class="hidden" id="id-table${id}">${data[i]._id}</td>
          <td id="itemName-table${id}">${data[i].itemName}</td>
          <td class="hidden" id="unitPrice-table${id}">${data[i].unitPrice}</td>
          <td class="hidden" id="retailPrice-table${id}">${data[i].retailPrice}</td>
          <td id="boh-table${id}">${data[i].balanceOnHand}</td>
          <td id="ril-table${id}">${data[i].requestedInventoryLevel}</td>
          <td id="sold-table${id}">${data[i].sold}</td>
          <td class="hidden" id="vendor-table${id}">${data[i].vendor}</td>
          <td><button class="update button" id="${id}">UPDATE</button></td>
          <td><button class="delete button" id="${id}">DELETE</button></td>
          <td><button class="button" id="sold-button">SOLD</button></td>          
        </tr>`);
      $('#sales-history').append(
        `<tr>
          <td>${data[i].itemName}</td>
          <td>${data[i].sold}</td>
        </tr>`);
      id++;
    }
    let vendors = [];
    for (let i = 0; i < data.length; i++) {
      vendors.push(data[i].vendor);
    }
    let uniqueVendors = [];
    $.each(vendors, function(i, el) {
      if ($.inArray(el, uniqueVendors) === -1) uniqueVendors.push(el);
    });
    uniqueVendors.sort();
    for (let i = 0; i < uniqueVendors.length; i++) {
      $('#vendors').append(
        '<tr>' +
          '<td>' + uniqueVendors[i] + '</td>' +
        '</tr>');
    }
  }

  function getAndDisplayItems() {
    getInventoryItems(displayInventoyItems);
  }

  function showSalesHistory() {
    $('.add-item').hide();
    $('.business-inventory').hide();
    $('.vendor-list').hide();
    $('.sales-history').show();
  }

  function showCurrentInvetory() {
    $('.add-item').show();
    $('.business-inventory').show();
    $('.vendor-list').hide();
    $('.sales-history').hide();
  }

  function showVendors() {
    $('.add-item').hide();
    $('.business-inventory').hide();
    $('.vendor-list').show();
    $('.sales-history').hide();
  }

  function addItem() {
    let item = {
      'itemName': $('#itemName').val(),
      'unitPrice': $('#unitPrice').val(),
      'retailPrice': $('#retailPrice').val(),
      'balanceOnHand': $('#balanceOnHand').val(),
      'requestedInventoryLevel': $('#requestedInventoryLevel').val(),
      'sold': 0,
      'vendor': $('#vendor').val()
    };
    $.ajax({
      url: ROOT_URL + '/inventory',
      type: 'POST',
      data: JSON.stringify(item),
      contentType: 'application/json',
      success: function() {
        alert(`${item.itemName} has been added to inventory`);
      }
    });
    $('#inventory-items').text('');
    $('#inventory_items').append(
      '<tr>' +
        '<th>Item</th>' +
        '<th>BOH</th>' +
        '<th>RIL</th>' +
        '<th>Sold</th>' +
      '</tr>');
    getAndDisplayItems();
  }

  function setUpdateFields(id) {
    let itemId = $(`#id-table${id}`).text();
    let item = $(`#itemName-table${id}`).text();
    let vendor = $(`#vendor-table${id}`).text();
    let unitPrice = $(`#unitPrice-table${id}`).text();
    let retailPrice = $(`#retailPrice-table${id}`).text();
    let boh = $(`#boh-table${id}`).text();
    let ril = $(`#ril-table${id}`).text();
    $('#id').val(itemId);
    $('#itemName').val(item);
    $('#vendor').val(vendor);
    $('#unitPrice').val(unitPrice);
    $('#retailPrice').val(retailPrice);
    $('#balanceOnHand').val(boh);
    $('#requestedInventoryLevel').val(ril);
    $('#add-button').hide();
    $('#update-button-form').show();
    $('.business-inventory').hide();
  }

  function updateItem() {
    let id = $('#id').val();
    let item = {
      id: id,
      itemName: $('#itemName').val(),
      unitPrice: $('#unitPrice').val(),
      retailPrice: $('#retailPrice').val(),
      balanceOnHand: $('#balanceOnHand').val(),
      requestedInventoryLevel: $('#requestedInventoryLevel').val(),
      sold: 0,
      vendor: $('#vendor').val()
    };
    $.ajax({
      url: `${ROOT_URL}/inventory/${id}`,
      type: 'PUT',
      data: JSON.stringify(item),
      contentType: 'application/json',
      success: function() {
        alert(`${item.itemName} has been updated!`);
      }
    });
    $('#inventory-items').text('');
    $('#inventory_items').append(
      '<tr>' +
        '<th>Item</th>' +
        '<th>BOH</th>' +
        '<th>RIL</th>' +
        '<th>Sold</th>' +
      '</tr>');
    getAndDisplayItems();
    $('#add-button').show();
    $('#update-button-form').hide();
    $('.business-inventory').show();
  }

  function removeItem(id) {
    $.ajax({
      url: `${ROOT_URL}/inventory/${id}`,
      type: 'DELETE',
      success: function() {
        alert('Item deleted!');
      }
    });
  }

  getAndDisplayItems();
  $('#sales').click(showSalesHistory);
  $('#current-inventory').click(showCurrentInvetory);
  $('#vendor-button').click(showVendors);
  $('#add-button').click(addItem);
  $('#submit').click(validateUser);
  $('#inventory-items').click('button', function(e) {
    let id = e.target.id;
    setUpdateFields(id);
  });
  $('#update-button-form').click(updateItem);
  $('#inventory-items').click('button', function(e) {
    let id = e.target.id;
    removeItem(id);
  });
});
