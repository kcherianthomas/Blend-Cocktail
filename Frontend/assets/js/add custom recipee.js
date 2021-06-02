var noOfIngredients = 1
var imageuploaded = false;
var input;
var infoArea;
var message;
$(document).ready(function () {
    noOfIngredients = 1;
    input = document.getElementById('upload');
    infoArea = document.getElementById('upload-label');
    $('#upload').on('change', function () {
        readURL(input);
    });
    input.addEventListener('change', showFileName);
    document.getElementById('customcoktailname').value = "";
    document.getElementById('customcoktailglasstype').value = "";
    document.getElementById('customcoktailinstruction').value = "";
    for (let j = 1; j <= 15; ++j) {
        document.getElementById('customcoktailingredient' + j).value = "";
        document.getElementById('customcoktailmeasurement' + j).value = "";
    }
    imageuploaded = false;
});
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#imageResult')
                .attr('src', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
        imageuploaded = true;
    }
}

function showFileName(event) {
    var input = event.srcElement;
    var fileName = input.files[0].name;
    infoArea.textContent = 'File name: ' + fileName;
}

function addIngredient() {
    noOfIngredients++;
    var elementid = 'Ingredientdiv' + noOfIngredients;
    console.log(elementid)
    element = document.getElementById(elementid);
    element.style.display = "block";
    if (noOfIngredients == 15) {
        document.getElementById('add-more').disabled = true;
    }
}

function submitcustomcocktail() {
    message = "";
    if (validateinputs()) {
        let customcoktailname = document.getElementById('customcoktailname');
        let customcoktailcategory = document.getElementById('customcoktailcategory');
        let customcoktailtype = document.getElementById('customcoktailtype');
        let customcoktailglasstype = document.getElementById('customcoktailglasstype');
        let customcoktailmeasurement = "";
        let customcoktailingredient = "";
        for (let i = 1; i <= noOfIngredients; ++i) {
            customcoktailingredient = customcoktailingredient + (document.getElementById('customcoktailingredient' + i).value + ",")
            customcoktailmeasurement = customcoktailmeasurement + (document.getElementById('customcoktailmeasurement' + i).value + ",")
        }
        let customcoktailinstruction = document.getElementById('customcoktailinstruction');
        let imageResult = document.getElementById('imageResult');
        var newImage = document.createElement("img");
        newImage.src = imageResult.src;
        var outerHtml = newImage.outerHTML;
        var file = input.files[0];
        var fileName = file.name;
        var fileExt = fileName.split(".").pop();
        last_index_quote = outerHtml.lastIndexOf('"');
        var imagebody;
        if (fileExt == 'jpg' || fileExt == 'jpeg') {
            imagebody = outerHtml.substring(33, last_index_quote);
            filetype = "image/jpeg" + ";base64"
        }
        else {
            imagebody = outerHtml.substring(32, last_index_quote);
            filetype = file.type + ";base64"
        }


        body = {
            "customcoktailname": customcoktailname.value,
            "customcoktailcategory": customcoktailcategory.value,
            "customcoktailtype": customcoktailtype.value,
            "customcoktailglasstype": customcoktailglasstype.value,
            "customcoktailmeasurement": customcoktailmeasurement,
            "customcoktailingredient": customcoktailingredient,
            "customcoktailinstruction": customcoktailinstruction.value,
            "imagebody": imagebody,
            "imagename": fileName,
        }

        console.log(body)

        var params = {};
        var additionalParams = {
            headers: {
            }
        }
        sdk = apigClientFactory.newClient();
        sdk.customcocktailPost(params, body, additionalParams).then(function (response) {
            console.log(response);
            res = JSON.parse(response.data.body)
            if (res == "Custom cocktail created successfully") {
                openmodal('Success', "Custom cocktail created successfully")
            }
        }).catch(function (result) {
            openmodal('Error', 'Something went wrong. Please try again later');
        });

    } else {
        openmodal('Error', message);
    }
}

function validateinputs() {
    let customcoktailname = document.getElementById('customcoktailname');
    if (customcoktailname.value == "") {
        message = 'Cocktail name is mandatory'
        return false;
    }
    let customcoktailglasstype = document.getElementById('customcoktailglasstype');
    if (customcoktailglasstype.value == "") {
        message = 'Glass type is mandatory'
        return false;
    }
    for (let j = 1; j <= noOfIngredients; ++j) {
        let customcoktailingredient = document.getElementById('customcoktailingredient' + j);
        let customcoktailmeasurement = document.getElementById('customcoktailmeasurement' + j);
        if (customcoktailingredient.value == "" || customcoktailmeasurement.value == "") {
            message = 'Imgredient and measurement are mandatory'
            return false;
        }
    }
    let customcoktailinstruction = document.getElementById('customcoktailinstruction');
    if (customcoktailinstruction.value == "") {
        message = 'Instruction is mandatory'
        console.log('customcoktailinstruction')
        return false;
    }
    let imageResult = document.getElementById('imageResult');
    console.log('image result', imageuploaded)
    if (!imageuploaded) {
        message = 'Image is mandatory'
        return false;
    }
    return true;
}

function openmodal(modaltitle, modaltext) {
    $("#modal").modal({ show: true });
    document.getElementById("modaltitle").innerHTML = modaltitle
    document.getElementById("modaltext").innerHTML = modaltext
}

function closemodal() {
    $("#modal").modal({ show: false });
}

function logout() {
    location.href = "https://cocktail.auth.us-east-1.amazoncognito.com/logout?client_id=10apj9lf45ih1ar5klh9454qsg&logout_uri=https://dbboxdskgfqfr.cloudfront.net/logout.html"
}