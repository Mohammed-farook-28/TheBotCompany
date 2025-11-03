# Google Apps Script Setup for Contact Form

## Instructions to Set Up Google Sheets Integration

1. **Open Google Sheets**
   - Go to your sheet: https://docs.google.com/spreadsheets/d/1jpoc-W1fsIPSpH6uenmi4hoQoXocRZoTAmg6TpJOgwI/edit

2. **Create "Leads" Sheet** (if not already created)
   - Create a sheet named "Leads" (exact name, case-sensitive)
   - Row 1 should have these headers:
     - Timestamp
     - Name
     - Email
     - Phone
     - Budget
     - Timeline
     - Description
   - Note: The script will automatically create this sheet with headers if it doesn't exist

3. **Open Google Apps Script**
   - Click on "Extensions" → "Apps Script"
   - Or go directly to: https://script.google.com

4. **Paste This Script**:
```javascript
function doPost(e) {
  try {
    const spreadsheetId = '1jpoc-W1fsIPSpH6uenmi4hoQoXocRZoTAmg6TpJOgwI';
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    
    // Get the "Leads" sheet, create it if it doesn't exist
    let sheet = spreadsheet.getSheetByName('Leads');
    if (!sheet) {
      sheet = spreadsheet.insertSheet('Leads');
      // Add headers if it's a new sheet
      sheet.appendRow(['Timestamp', 'Name', 'Email', 'Phone', 'Budget', 'Timeline', 'Description']);
      // Style the header row
      const headerRange = sheet.getRange(1, 1, 1, 7);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#00baff');
      headerRange.setFontColor('#000000');
    }
    
    const data = JSON.parse(e.postData.contents);
    
    // Append data to the "Leads" sheet
    sheet.appendRow([
      data.timestamp || new Date(),
      data.name || '',
      data.email || '',
      data.phone || '',
      data.budget || '',
      data.timeline || '',
      data.description || ''
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Data saved successfully to Leads sheet'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput('This endpoint only accepts POST requests');
}
```

5. **Deploy as Web App**
   - Click "Deploy" → "New deployment"
   - Click the gear icon ⚙️ next to "Select type" → Choose "Web app"
   - Set:
     - Description: "Contact Form Handler"
     - Execute as: "Me"
     - Who has access: "Anyone"
   - Click "Deploy"
   - Copy the Web App URL

6. **Update ContactForm.tsx**
   - Replace `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` with your Web App URL
   - The URL should look like: `https://script.google.com/macros/s/AKfyc.../exec`

7. **Test the Integration**
   - Submit the contact form
   - Check your Google Sheet for the new row
   - Verify redirect to Cal.com

## Notes
- The script will automatically append new form submissions to the "Leads" sheet
- If the "Leads" sheet doesn't exist, it will be created automatically with headers
- Make sure your "Leads" sheet has the correct headers in row 1 (or let the script create them)
- The script handles errors gracefully and will still redirect users even if Google Sheets fails
- The sheet name "Leads" is case-sensitive, so make sure it matches exactly

