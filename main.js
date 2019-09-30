// This file is a .gs file (Google App Script) it is made for syncing a Trello Dashboard working with Agile Corello Power ups (for points)
// You have to change your key and token by generating your own on https://developers.trello.com/

function insertRow(sheet, rowData, optIndex) {
  var index = optIndex || 1;
  sheet.insertRowBefore(index).getRange(index, 1, 1, rowData.length).setValues([rowData]);
}

function myFunction(board_id, page_name) {
  var key = "LOOK-AT-THE-COMMENTS";
  var token = "LOOK-AT-THE-COMMENTS";
  var url = 'https://api.trello.com/1/';
  var start_cell = 4;
  var sheet = SpreadsheetApp.getActive().getSheetByName(page_name);
  var listResponse = UrlFetchApp.fetch(url + 'boards/' + board_id + '/lists' + '?key=' + key  + '&token=' + token, {'muteHttpExceptions': true});
  listResponse = JSON.parse(listResponse.getContentText());
  for (var list in listResponse) {
    if (listResponse[list].name == "A faire")
      var toDoId = listResponse[list].id;
    else if (listResponse[list].name == "En cours")
      var inProgressId = listResponse[list].id;
    else if (listResponse[list].name == "Achevé")
      var doneId = listResponse[list].id;
  }
  var cardResponse = UrlFetchApp.fetch(url + 'boards/' + board_id + '/cards' + '?key=' + key  + '&token=' + token, {'muteHttpExceptions': true});
  cardResponse = JSON.parse(cardResponse.getContentText());
  var toDoTable = [];
  var doneTable = [];
  var inProgressTable = [];
  for (var card in cardResponse) {
    if (cardResponse[card].idList == doneId)
      doneTable.push(cardResponse[card]);
    else if (cardResponse[card].idList == inProgressId)
      inProgressTable.push(cardResponse[card]);
    else if (cardResponse[card].idList == toDoId)
      toDoTable.push(cardResponse[card]);
  }
  var idx = start_cell;
  var points = 0;
  var toBeAdded = 1;
  for (var toDoCard in toDoTable) {
    cardResponse = UrlFetchApp.fetch(url + '/cards/' + toDoTable[toDoCard].id + '/pluginData' + '?key=' + key  + '&token=' + token, {'muteHttpExceptions': true});
    idx = start_cell;
    toBeAdded = 1;

    if (cardResponse.getContentText().length == 2) {
      points = 0;
    }
    else {
      points = parseInt(JSON.parse(JSON.parse(cardResponse.getContentText())[0].value).points);
    }
    while (sheet.getRange('A' + idx).getValue() != "") {
      if (sheet.getRange('A' + idx).getValue() == toDoTable[toDoCard].id) {
        toBeAdded = 0;
        sheet.getRange('B' + idx).setValue("A faire");
        sheet.getRange('C' + idx).setValue(toDoTable[toDoCard].labels[0].name);
        sheet.getRange('D' + idx).setValue(toDoTable[toDoCard].name);
        sheet.getRange('E' + idx).setValue(points);
      }
      idx++;
    }
    if (toBeAdded == 1) {
      insertRow(sheet, [toDoTable[toDoCard].id, "A faire", toDoTable[toDoCard].labels[0].name, toDoTable[toDoCard].name, points], start_cell);
    }
  }
  for (var doneCard in doneTable) {
    cardResponse = UrlFetchApp.fetch(url + '/cards/' + doneTable[doneCard].id + '/pluginData' + '?key=' + key  + '&token=' + token, {'muteHttpExceptions': true});
    idx = start_cell;
    toBeAdded = 1;
    if (cardResponse.getContentText().length == 2) {
      points = 0;
    }
    else {
      points = parseInt(JSON.parse(JSON.parse(cardResponse.getContentText())[0].value).points);
    }
    while (sheet.getRange('A' + idx).getValue() != "") {
      if (sheet.getRange('A' + idx).getValue() == doneTable[doneCard].id) {
        toBeAdded = 0;
        sheet.getRange('B' + idx).setValue("Achevé");
        sheet.getRange('C' + idx).setValue(doneTable[doneCard].labels[0].name);
        sheet.getRange('D' + idx).setValue(doneTable[doneCard].name);
        sheet.getRange('E' + idx).setValue(points);
      }
      idx++;
    }
    if (toBeAdded == 1) {
      insertRow(sheet, [doneTable[doneCard].id, "Achevé", doneTable[doneCard].labels[0].name, doneTable[doneCard].name, points], start_cell);
    }
  }
  for (var inProgressCard in inProgressTable) {
    cardResponse = UrlFetchApp.fetch(url + '/cards/' + inProgressTable[inProgressCard].id + '/pluginData' + '?key=' + key  + '&token=' + token, {'muteHttpExceptions': true});
        idx = start_cell;
    toBeAdded = 1;
    if (cardResponse.getContentText().length == 2) {
      points = 0;
    }
    else {
      points = parseInt(JSON.parse(JSON.parse(cardResponse.getContentText())[0].value).points);
    }
    while (sheet.getRange('A' + idx).getValue() != "") {
      if (sheet.getRange('A' + idx).getValue() == inProgressTable[inProgressCard].id) {
        toBeAdded = 0;
        sheet.getRange('B' + idx).setValue("En cours");
        sheet.getRange('C' + idx).setValue(inProgressTable[inProgressCard].labels[0].name);
        sheet.getRange('D' + idx).setValue(inProgressTable[inProgressCard].name);
        sheet.getRange('E' + idx).setValue(points);
      }
      idx++;
    }
    if (toBeAdded == 1) {
      insertRow(sheet, [inProgressTable[inProgressCard].id, "En cours", inProgressTable[inProgressCard].labels[0].name, inProgressTable[inProgressCard].name, points], start_cell);
    }
   }
}

function main() {
  //myFunction(BOARD_ID, SPREADSHEET_NAME);
}