$(document).ready(function() {
  function getInventoryItems(callbackFn) {
    setTimeout(function() {callbackFn(INVENTORY_ITEMS)}, 100);
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
    console.log(uniqueVendors);
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
      id: Math.random() * 1000,
      itemName: $('#itemName').val(),
      unitPrice: $('#unitPrice').val(),
      retailPrice: $('#retailPrice').val(),
      balanceOnHand: $('#balanceOnHand').val(),
      requestedInventoryLevel: $('#requestedInventoryLevel').val(),
      sold: 0,
      vendor: $('#vendor').val()
    };
    INVENTORY_ITEMS.items.push(item);
  }

  getAndDisplayItems();
  $('#sales').click(showSalesHistory);
  $('#current-inventory').click(showCurrentInvetory);
  $('#vendor-button').click(showVendors);
  $('#add-button').click(addItem);
});
