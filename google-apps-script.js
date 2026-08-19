var SPREADSHEET_ID = "1wnu9S1kyA_hCWUTLXKEMOSLjUc4A-2JqFEkMeLNSxlA";
var SHEET_NAME = "Inscrições";
var DESTINATION_EMAIL = "traynorout@gmail.com";

function doGet() {
  return jsonResponse({
    ok: true,
    message: "Apps Script ativo. Use o formulario para enviar uma inscricao."
  });
}

function doPost(e) {
  try {
    var data = e.parameter;
    var sheet = getOrCreateSheet();

    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Data/Hora",
        "Nome completo",
        "RA",
        "E-mail",
        "Curso",
        "Semestre"
      ]);
    }

    sheet.appendRow([
      new Date(),
      data.name || "",
      data.ra || "",
      data.email || "",
      data.curso || "",
      data.semestre || ""
    ]);

    MailApp.sendEmail({
      to: DESTINATION_EMAIL,
      subject: "Nova inscrição - Cidadania e Justiça",
      body: buildEmailBody(data),
      replyTo: data.email || undefined
    });

    return jsonResponse({ ok: true });
  } catch (error) {
    return jsonResponse({ ok: false, message: error.message });
  }
}

function getOrCreateSheet() {
  var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  return sheet;
}

function buildEmailBody(data) {
  return [
    "Nova inscrição recebida:",
    "",
    "Nome: " + (data.name || ""),
    "RA: " + (data.ra || ""),
    "E-mail: " + (data.email || ""),
    "Curso: " + (data.curso || ""),
    "Semestre: " + (data.semestre || "")
  ].join("\n");
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
