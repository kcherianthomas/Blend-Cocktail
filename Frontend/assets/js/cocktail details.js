// This function is used to get list of all recoomendations
// It takes one parameter user id for calculating recommendation for the user
var sdk = apigClientFactory.newClient();
var cocktailDetail = {};
var cocktailID;
var details = {
    id: '1',
    name: '110 in the shade',
    category: "Beer",
    type: "Alcoholic",
    glassType: "Beer glass",
    ingredientAndMeasurement: ["1 oz white Creme de Cacao", "1 oz Vodka"],
    instructuion: ["Fill a rocks glass with ice", " add white creme de cacao and vodka", "stir"],
    imageSrc: 'http://www.thecocktaildb.com/images/media/drink/rvwrvv1468877323.jpg'
}
var commentList =  []
//var commentList = [{ 'username': 'Cherian', 'comment': 'This cocktail is awesome. loved it.' }, { 'username': 'Tara', 'comment': 'Best cocktail ever' }];
function getCocktailDetails() {
    const queryString = window.location.search;
    console.log(queryString);
    const urlParams = new URLSearchParams(queryString);
    cocktailID = urlParams.get('cocktailID')
    console.log(cocktailID)
    document.getElementById("addcomment").value = "";
    document.querySelector('#addcomment').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            submitcomment();
        }
    });
    console.log("Calling getCocktailDetails")
    
    var params = { 'cocktailid': cocktailID };
    var body = {}
    var additionalParams = {
        headers: {
        }
    }
    
    sdk.cocktaildetailsGet(params, body, additionalParams).then(function (response) {
        console.log(response);
        details = JSON.parse(response.data.body)
        console.log(details);

        document.getElementById("cocktailDetailsImage").src = details.imageSrc
        document.getElementById("cocktailDetailName").innerHTML = details.name
        document.getElementById("cocktailDetailCategory").innerHTML = details.category
        document.getElementById("cocktailDetailType").innerHTML = details.type
        document.getElementById("cocktailDetailGlassType").innerHTML = details.glassType

        // For adding dynamic details of ingredients and measurements
        var ingredientAndMeasurementInnerHtml = "";
        for (let i = 0; i < details.ingredientAndMeasurement.length; ++i) {
            ingredientAndMeasurementInnerHtml += "<div class='ingredient-item'>" + details.ingredientAndMeasurement[i] + "</div>"
        }
        document.getElementById("cocktailDetailIngredientWithMeasurement").innerHTML = ingredientAndMeasurementInnerHtml
        // For adding details of cocktail instruction
        var instructionInnerHtml = "";
        for (let i = 0; i < details.instructuion.length; ++i) {
            instructionInnerHtml += "<li>" + details.instructuion[i].trim() + "</li>"
        }
        document.getElementById("cocktailDetailInstruction").innerHTML = instructionInnerHtml
        getComments();
    }).catch(function (result) {
        alert("error getting cocktail details")
    });



}

function submitcomment() {
    let commentToAdd = document.getElementById("addcomment").value
    const queryString = window.location.search;
    console.log(queryString);
    const urlParams = new URLSearchParams(queryString);
    const cocktailID = urlParams.get('cocktailID')
    if (commentToAdd.trim() != '') {
        var params = { 'cocktailid': cocktailID };
        var additionalParams = {
            headers: {
            }
        }
        body = { 'cocktailid': cocktailID, 'username': localStorage.getItem("cocktailusername"), 'comment': commentToAdd }
        console.log(body);
        sdk.commentPost(params, body, additionalParams).then(function (response) {
            console.log(response);
            getComments();
        });
    } else {
        alert("comment is empty");
    }
}

function getComments() {
    var params = { 'cocktailid': cocktailID };
    var additionalParams = {
        headers: {
        }
    }
    body = {}
    sdk.commentGet(params, body, additionalParams).then(function (response) {
        console.log(response);
        commentList = JSON.parse(response.data.body)
        displaycommentdiv = document.getElementById("displaycomment")
        innerhtmlfordisplaycomment = "";
        for (let i = 0; i < commentList.length; ++i) {
            innerhtmlfordisplaycomment += '<div class="d-flex justify-content-center py-2"><div class="second py-2 px-2"> <span class="font-weight-bold text1">' + commentList[i].comment + '</span><div class="d-flex justify-content-between py-1 pt-2"><div><span><small class="font-weight-bold text-2">' + commentList[i].username + '</small></span></div></div></div></div>'

        }
        displaycommentdiv.innerHTML = innerhtmlfordisplaycomment
    });
}

function logout() {
    location.href = "https://cocktail.auth.us-east-1.amazoncognito.com/logout?client_id=10apj9lf45ih1ar5klh9454qsg&logout_uri=https://dbboxdskgfqfr.cloudfront.net/logout.html"
}


