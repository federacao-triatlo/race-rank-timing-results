/*
 * MIT License
 *
 * Copyright(c) 2023 Ricardo do Canto
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files(the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and / or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * Gets the MYLAPS timing data, from the EnduranceTrio TimingExporter microservice, recorded in the given timezone.
 *
 * The timezone is represented by a string that EnduranceTrio TimingExporter microservice stores as an enum. The
 * supported values are "lisbon" and "azores". The timezone "Lisbon/Europe" is represented by "lisbon" and the
 * timezone "Atlantic/Azores" is represented by "azores".
 *
 * @param {String} timezone the given timezone
 * @param {String} importDate the given import date
 */
function writeMylapsTimingData(timezone, importDate) {
  const timingData = getMylapsTimingDataByDate(timezone, importDate);

  if (timingData) {
    if (timingData.checkIn && timingData.checkIn.length > 0) {
      writeRange(CHECK_IN_TIMING_DATA_TARGET_RANGE, timingData.checkIn);
    }

    if (timingData.startLine && timingData.startLine.length > 0) {
      writeRange(START_LINE_TIMING_DATA_TARGET_RANGE, timingData.startLine);
    }

    if (timingData.intermediateWaypoints && timingData.intermediateWaypoints.length > 0) {
      writeRange(WAYPOINTS_TIMING_DATA_TARGET_RANGE, timingData.intermediateWaypoints);
    }

    if (timingData.finishLine && timingData.finishLine.length > 0) {
      writeRange(FINISH_LINE_TIMING_DATA_TARGET_RANGE, timingData.finishLine);
    }

    if (timingData.invalid && timingData.invalid.length > 0) {
      writeRange(INVALID_TIMING_DATA_TARGET_RANGE, timingData.invalid);
    }
  }
}

/**
 * Clears the content of the given range and then writes the given content on the same range.
 *
 * @param {String} rangeName the given range name
 * @param {Array} data the given data to be written
 */
function writeRange(rangeName, data) {
  const RANGE_HEADER_ROWS = 1;

  const range = SpreadsheetApp.getActive().getRangeByName(rangeName);
  const rangeRows = range.getValues().length;
  const rangeCols = range.getValues()[0].length;

  const targetFirstRowIndex = range.getRow() + RANGE_HEADER_ROWS;
  const targetFirstColIndex = range.getColumn();
  const numRows = data.length;
  const numCols = numRows == 0 ? 0 : data[0].length;

  range
    .getSheet()
    .getRange(targetFirstRowIndex, targetFirstColIndex, rangeRows - RANGE_HEADER_ROWS, rangeCols)
    .clearContent();

  range.getSheet().getRange(targetFirstRowIndex, targetFirstColIndex, numRows, numCols).setValues(data);
}
