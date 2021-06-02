// This function is used to get list of all recoomendations
// It takes one parameter user id for calculating recommendation for the user
var sdk;
var searchResult = [];

$(document).ready(function () {
    sdk = apigClientFactory.newClient();
    document.getElementById("searchquery").value = "";
    document.querySelector('#searchquery').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            search();
        }
    });
    
});
function search() {
    searchResult = [];
    console.log("clicked search")
    let searchquery = document.getElementById("searchquery").value;
    if (searchquery != "") {
        var params = { 'q': searchquery };
        var body = {}
        var additionalParams = {
            headers: {
            }
        }
        sdk.searchGet(params, body, additionalParams).then(function (response) {
            console.log(response.data.body)
            console.log("CallingsearchGet")
            searchResult = JSON.parse(response.data.body)
            console.log(searchResult)
            var divForSearch = "";
            for (let i = 0; i < searchResult.length; ++i) {
                divForSearch += "<div class='col-sm-3'><a href='cocktail details.html?cocktailID=" + searchResult[i].id + "' /><figure><img src=" + searchResult[i].imageSrc + " width='95%' /><figcaption><br>" + searchResult[i].name + "</figcaption></figure></a></div>"
            }
            document.getElementById("search").innerHTML = divForSearch
        }).catch(function (result) {
            openmodal('Error', 'Something went wrong. Please try again later');
        });
    } else {
        openmodal('Error', 'Search text cannot be empty')
    }
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