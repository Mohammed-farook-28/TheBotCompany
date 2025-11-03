# Fixed Google Apps Script for Contact Form

## IMPORTANT: Copy this ENTIRE script to your Google Apps Script

```javascript
function doPost(e) {
  try {
    Logger.log('=== doPost called ===');
    Logger.log('e object exists: ' + (e ? 'yes' : 'no'));
    
    // Check if e is undefined (happens when testing manually)
    if (!e) {
      Logger.log('ERROR: e parameter is undefined');
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'No request data received. This function must be called via HTTP POST.'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    Logger.log('e.postData exists: ' + (e.postData ? 'yes' : 'no'));
    Logger.log('e.parameter exists: ' + (e.parameter ? 'yes' : 'no'));
    
    // Check if we have any data
    if (!e.postData && !e.parameter) {
      Logger.log('ERROR: No data received');
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'No data received'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    const spreadsheetId = '1jpoc-W1fsIPSpH6uenmi4hoQoXocRZoTAmg6TpJOgwI';
    Logger.log('Opening spreadsheet: ' + spreadsheetId);
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    
    // Get the "Leads" sheet, create it if it doesn't exist
    let sheet = spreadsheet.getSheetByName('Leads');
    if (!sheet) {
      Logger.log('Creating new Leads sheet');
      sheet = spreadsheet.insertSheet('Leads');
      // Add headers if it's a new sheet
      sheet.appendRow(['Timestamp', 'Name', 'Email', 'Phone', 'Budget', 'Timeline', 'Description']);
      // Style the header row
      const headerRange = sheet.getRange(1, 1, 1, 7);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#00baff');
      headerRange.setFontColor('#000000');
    }
    
    Logger.log('Sheet found/created');
    
    // Handle both JSON and URL-encoded data
    let data;
    
    // Priority 1: Check e.parameter (URL-encoded form data)
    if (e.parameter) {
      Logger.log('Processing e.parameter (URL-encoded)');
      data = {
        timestamp: e.parameter.timestamp || new Date().toISOString(),
        name: e.parameter.name || '',
        email: e.parameter.email || '',
        phone: e.parameter.phone || '',
        budget: e.parameter.budget || 'Not specified',
        timeline: e.parameter.timeline || 'Not specified',
        description: e.parameter.description || ''
      };
      Logger.log('Data from parameter: ' + JSON.stringify(data));
    }
    // Priority 2: Check e.postData.contents (JSON or URL-encoded string)
    else if (e.postData && e.postData.contents) {
      Logger.log('Processing postData.contents: ' + e.postData.contents.substring(0, 100));
      
      // Try to parse as JSON first
      try {
        data = JSON.parse(e.postData.contents);
        Logger.log('Parsed as JSON successfully');
      } catch (jsonError) {
        Logger.log('JSON parse failed, trying URL-encoded string parsing');
        // If JSON parsing fails, parse as URL-encoded string
        const params = {};
        const pairs = e.postData.contents.split('&');
        for (let i = 0; i < pairs.length; i++) {
          const pair = pairs[i].split('=');
          const key = decodeURIComponent(pair[0]);
          const value = decodeURIComponent(pair[1] || '');
          params[key] = value;
        }
        data = {
          timestamp: params.timestamp || new Date().toISOString(),
          name: params.name || '',
          email: params.email || '',
          phone: params.phone || '',
          budget: params.budget || 'Not specified',
          timeline: params.timeline || 'Not specified',
          description: params.description || ''
        };
        Logger.log('Parsed as URL-encoded string');
      }
    } else {
      throw new Error('No valid data format received');
    }
    
    Logger.log('Final data object: ' + JSON.stringify(data));
    
    // Append data to the "Leads" sheet
    Logger.log('Appending row to sheet');
    sheet.appendRow([
      data.timestamp || new Date(),
      data.name || '',
      data.email || '',
      data.phone || '',
      data.budget || 'Not specified',
      data.timeline || 'Not specified',
      data.description || ''
    ]);
    
    Logger.log('Row appended successfully');
    
    // Return success (NOTE: setHeaders doesn't exist in ContentService, removed it)
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Data saved successfully to Leads sheet'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log('=== ERROR CAUGHT ===');
    Logger.log('Error type: ' + error.name);
    Logger.log('Error message: ' + error.message);
    Logger.log('Error stack: ' + (error.stack || 'No stack trace'));
    Logger.log('Full error: ' + error.toString());
    
    // Return error (NOTE: setHeaders doesn't exist, removed it)
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString(),
      message: error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    success: false,
    message: 'This endpoint only accepts POST requests'
  })).setMimeType(ContentService.MimeType.JSON);
}

// Test function to verify spreadsheet access
function testSpreadsheet() {
  try {
    const spreadsheetId = '1jpoc-W1fsIPSpH6uenmi4hoQoXocRZoTAmg6TpJOgwI';
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    Logger.log('Spreadsheet opened successfully');
    
    let sheet = spreadsheet.getSheetByName('Leads');
    if (!sheet) {
      Logger.log('Leads sheet does not exist, creating...');
      sheet = spreadsheet.insertSheet('Leads');
      sheet.appendRow(['Timestamp', 'Name', 'Email', 'Phone', 'Budget', 'Timeline', 'Description']);
      Logger.log('Leads sheet created');
    } else {
      Logger.log('Leads sheet exists');
    }
    
    Logger.log('Test successful!');
    return 'Success';
  } catch (error) {
    Logger.log('Test failed: ' + error.toString());
    return 'Error: ' + error.toString();
  }
}
```

## Key Changes:

1. **Removed `setHeaders()`** - This method doesn't exist in ContentService
2. **Added check for undefined `e`** - Handles manual testing gracefully
3. **Priority check `e.parameter` first** - URL-encoded data typically comes through `e.parameter`
4. **Better URL-encoded string parsing** - Handles the case when `postData.contents` is a URL-encoded string
5. **Added test function** - Use `testSpreadsheet()` to verify permissions

## Testing Steps:

1. **First, test spreadsheet access:**
   - In Google Apps Script, select the `testSpreadsheet` function
   - Click Run
   - Authorize permissions if prompted
   - Check the execution log to see if it succeeds

2. **Then test doPost:**
   - You CANNOT test `doPost` manually (it needs HTTP POST request)
   - Deploy as Web App and test via form submission
   - Check execution logs after form submission

