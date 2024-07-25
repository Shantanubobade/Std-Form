/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */


const connToken = "90932172|-31949215163237910|90963916";
const dbName = "Student_PROJECT1";
const relName = "Student_PRO1";
const jpdbBaseURL = "http://api.login2explore.com:5577";
const jpdbIRL = "/api/irl";
const jpdbIML = "/api/iml";

$(document).ready(function () {
    $("#id").focus();

    $("#id").on("blur", function () {
        const id = $("#id").val();
        if (id.trim() === "") {
            resetForm();
            return;
        }
        const jsonObj = {
            id: id
        };
        const reqString = createGETRequest(connToken, dbName, relName, JSON.stringify(jsonObj));
        jQuery.ajaxSetup({ async: false });
        const resultObj = executeCommandAtGivenBaseUrl(reqString, jpdbBaseURL, jpdbIRL);
        jQuery.ajaxSetup({ async: true });

        if (resultObj.status === 400) {
            $("#saveBtn").prop("disabled", false);
            $("#resetBtn").prop("disabled", false);
            $("#rollNo").prop("disabled", false);
            $("#rollNo").focus();
        } else if (resultObj.status === 200) {
            $("#id").prop("disabled", true);
            fillData(resultObj);
            $("#updateBtn").prop("disabled", false);
            $("#resetBtn").prop("disabled", false);
            $("#rollNo").focus();
        }
    });

    $("#saveBtn").click(function () {
        saveData();
    });

    $("#updateBtn").click(function () {
        updateData();
    });

    $("#resetBtn").click(function () {
        resetForm();
    });
});

function saveData() {
    if (!validateForm()) {
        return;
    }
    const jsonStrObj = getFormDataAsJson();
    const reqString = createPUTRequest(connToken, jsonStrObj, dbName, relName);
    jQuery.ajaxSetup({ async: false });
    const resultObj = executeCommandAtGivenBaseUrl(reqString, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({ async: true });
    resetForm();
    $("#id").focus();
}

function updateData() {
    if (!validateForm()) {
        return;
    }
    const jsonStrObj = getFormDataAsJson();
    const reqString = createUPDATERecordRequest(connToken, jsonStrObj, dbName, relName, $("#id").val());
    jQuery.ajaxSetup({ async: false });
    const resultObj = executeCommandAtGivenBaseUrl(reqString, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({ async: true });
    resetForm();
    $("#id").focus();
}

function fillData(resultObj) {
    const record = JSON.parse(resultObj.data).record;
    $("#rollNo").val(record.Roll-No);
    $("#fullName").val(record["Full-name"]);
    $("#class").val(record.Class);
    $("#dob").val(record["Date Of Birth"]);
    $("#enrollmentDate").val(record["Enrollment-Date"]);
    $("#email").val(record.Email);
    $("#gender").val(record.gender);
    disableAllFieldsExceptId(false);
}

function validateForm() {
    const fields = ["id", "rollNo", "fullName", "class", "dob", "enrollmentDate", "email", "gender"];
    for (let i = 0; i < fields.length; i++) {
        if ($("#" + fields[i]).val() === "") {
            alert("Please fill all the fields");
            $("#" + fields[i]).focus();
            return false;
        }
    }
    return true;
}

function resetForm() {
    $("#studentForm")[0].reset();
    $("#id").val("");
    disableAllFieldsExceptId(true);
    $("#id").prop("disabled", false);
    $("#saveBtn").prop("disabled", true);
    $("#updateBtn").prop("disabled", true);
    $("#resetBtn").prop("disabled", false);
    $("#id").focus();
}

function disableAllFieldsExceptId(disabled) {
    $("#rollNo").prop("disabled", disabled);
    $("#fullName").prop("disabled", disabled);
    $("#class").prop("disabled", disabled);
    $("#dob").prop("disabled", disabled);
    $("#enrollmentDate").prop("disabled", disabled);
    $("#email").prop("disabled", disabled);
    $("#gender").prop("disabled", disabled);
}

function getFormDataAsJson() {
    const jsonStrObj = {
        id: $("#id").val(),
        "Roll-No": $("#rollNo").val(),
        "Full-name": $("#fullName").val(),
        "Class": $("#class").val(),
        "Date Of Birth": $("#dob").val(),
        "Enrollment-Date": $("#enrollmentDate").val(),
        "Email": $("#email").val(),
        "gender": $("#gender").val()
    };
    return JSON.stringify(jsonStrObj);
}
