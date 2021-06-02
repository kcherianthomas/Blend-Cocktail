// This function is used to get list of all recoomendations
// It takes one parameter user id for calculating recommendation for the user
var sdk = apigClientFactory.newClient();

var recommendationList = [];
/*var temp1 = { id: '1', name: 'Vodka', imageSrc: 'http://www.thecocktaildb.com/images/media/drink/rvwrvv1468877323.jpg' }
var temp2 = { id: '2', name: 'Gin', imageSrc: 'http://www.thecocktaildb.com/images/media/drink/yqvvqs1475667388.jpg' }
var temp3 = { id: '3', name: 'Rum', imageSrc: 'http://www.thecocktaildb.com/images/media/drink/yyrwty1468877498.jpg' }
var temp4 = { id: '4', name: 'Tequila', imageSrc: 'http://www.thecocktaildb.com/images/media/drink/ywxwqs1461867097.jpg' }*/
function getRecommendations() {
    var recommendationList = [];
    /*recommendationList.push(temp1);
    recommendationList.push(temp2);
    recommendationList.push(temp3);
    recommendationList.push(temp4);
    recommendationList.push(temp1);
    recommendationList.push(temp2);
    recommendationList.push(temp3);
    recommendationList.push(temp4);
    recommendationList.push(temp1);
    recommendationList.push(temp2);
    recommendationList.push(temp3);
    recommendationList.push(temp4);*/
    var params = {'userid':localStorage.getItem("cocktailemailid")};
    var body = {}
    var additionalParams = {
        headers: {
        }
    }
    console.log("calling cocktailGet")
    console.log(localStorage.getItem("cocktailemailid"))
    console.log("params" + params)
    sdk.cocktailGet(params, body, additionalParams).then(function (response) {
        console.log(response.data.body)
        recommendationList = JSON.parse(response.data.body)
        console.log(recommendationList)
        console.log("Calling getRecommendations")
        var divForRecommendation = "";
        for (let i = 0; i < recommendationList.length; ++i) {
            divForRecommendation += "<div class='col-sm-3'><a href='cocktail details.html?cocktailID=" + recommendationList[i].id + "' /><figure><img src=" + recommendationList[i].imageSrc + " width='95%' /><figcaption><br>" + recommendationList[i].name + "</figcaption></figure></a></div>"
        }
        document.getElementById("recommendation").innerHTML = divForRecommendation
    }).catch(function (result) {
        alert("error searching data")
    });



}

function logout() {
    location.href = "https://cocktail.auth.us-east-1.amazoncognito.com/logout?client_id=10apj9lf45ih1ar5klh9454qsg&logout_uri=https://dbboxdskgfqfr.cloudfront.net/logout.html"
}