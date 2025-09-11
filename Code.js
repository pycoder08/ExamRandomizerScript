/**
 * Tayba Foundation - Exam Generator Script 2.0
 * 
 *  # Overview
 * 
 *  # Usage
 */


/*------------------------------------------------------------------
  Initialize Menu
-------------------------------------------------------------------*/

function onOpen(e) {
  
}

/*------------------------------------------------------------------
  Initialize Constants
-------------------------------------------------------------------*/

const sheet = SpreadsheetApp.getActiveSheet();
const startRow = 1;
const startCol = 1;
const numRows = 2;
const numCols = 3;
const range = sheet.getRange(startRow, startCol, numRows, numCols);
const values = range.getValues();


function test() {
  for (const rowArray of values) {
    for (const cellValue of rowArray) {
      Logger.log(cellValue)
    }
  }
}
