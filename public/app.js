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
      requestedInventoryLevel: 4,
      sold: 2,
      vendor: "The Cleaning Company"
    }
  ]
};

function getInventoryItems(callbackFn) {
  setTimeout(function() {callbackFn(INVENTORY_ITEMS)}, 100);
}

function displayInventoyItems(data) {
  for (let i = 0; i < data.items.length; i++) {
    $('body').append(
      '<p>' + data.items[i].itemName + '</p>');
  }
}

function getAndDisplayItems() {
  getInventoryItems(displayInventoyItems);
}

$(document).ready(function() {
  getAndDisplayItems();
});