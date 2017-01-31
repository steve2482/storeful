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
  function getInventoryItems(callbackFn) {
    $.get(ROOT_URL + '/inventory', function(data) {
      return data;
    });
  }

  function displayInventoyItems(data) {
    for (let i = 0; i < data.items.length; i++) {
      $('#inventory-items').append(
        `<tr>
          <td>${data.items[i].itemName}</td>
          <td>${data.items[i].balanceOnHand}</td>
          <td>${data.items[i].requestedInventoryLevel}</td>
          <td>${data.items[i].sold}</td>
          <td><button class="button" id="update-button">UPDATE</button></td>
          <td><button class="button" id="delete-button">DELETE</button></td>
          <td><button class="button" id="sold-button">SOLD</button></td>
        </tr>`);
      $('#sales-history').append(
        `<tr>
          <td>${data.items[i].itemName}</td>
          <td>${data.items[i].sold}</td>
        </tr>`);
    }
    let vendors = [];
    for (let i = 0; i < data.items.length; i++) {
      vendors.push(data.items[i].vendor);
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
      contentType: 'application/json; charset=utf-8',
      success: function() {
        alert(`${item.itemName} has been added to inventory`);
      }
    });
  }

  getAndDisplayItems();
  $('#sales').click(showSalesHistory);
  $('#current-inventory').click(showCurrentInvetory);
  $('#vendor-button').click(showVendors);
  $('#add-button').click(addItem);
});
