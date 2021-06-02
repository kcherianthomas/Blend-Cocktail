var preferences;
var sdk;
// added for photo authentication

var webcam;
$(document).ready(function () {
    //localStorage.setItem("userid", '007');
    document.getElementById('takephotoAndSubmitButton').style.visibility = 'hidden';
    let userid = localStorage.getItem("cocktailemailid");
    var params = { 'userid': userid };
    var body = {}
    var additionalParams = {
        headers: {
        }
    }
    sdk = apigClientFactory.newClient();
    sdk.userpreferencesGet(params, body, additionalParams).then(function (response) {
        console.log(response.data.body);
        var preferredingredients = JSON.parse(response.data.body);
        var allIngredients = ['papaya', 'melon liqueur', 'fresh lime juice', 'grape soda', 'midori melon liqueur', 'lemon', 'fruit', 'advocaat', 'guinness stout', 'red wine', 'peach nectar', 'cointreau', 'ginger beer', 'aperol', 'strawberries', 'root beer', 'apricot', 'pineapple', 'fresh lemon juice', 'yellow chartreuse', 'white creme de menthe', 'bourbon', 'zima', 'olive', 'absolut citron', 'hot chocolate', 'lime juice cordial', 'creme de banane', 'peach bitters', 'white rum', 'sweet vermouth', 'blueberry schnapps', 'carbonated water', 'peach vodka', 'creme de cassis', 'cranberry juice', 'honey', 'sugar syrup', 'rye whiskey', 'corona', 'soda water', 'sambuca', 'sherbet', 'orange bitters', 'orange curacao', 'lemon-lime soda', 'ale', 'corn syrup', 'lemon peel', 'fruit juice', 'bacardi limon', 'vermouth', 'rum', 'peychaud bitters', 'cranberries', 'whipping cream', 'black pepper', 'raspberry vodka', 'coca-cola', 'yoghurt', 'mango', 'scotch', 'cherry grenadine', 'aquavit', 'peach brandy', 'maple syrup', 'orange juice', 'gin', 'lime peel', 'coffee brandy', 'vanilla ice-cream', 'apfelkorn', 'apricot brandy', 'añejo rum', 'cachaca', 'vanilla extract', 'passion fruit syrup', 'ice', 'grenadine', 'egg white', 'tonic water', 'marshmallows', 'apple schnapps', 'firewater', 'sour mix', 'cardamom', 'coffee', 'frangelico', 'cherry brandy', 'dr. pepper', 'raspberry syrup', 'vanilla', 'licorice root', 'jim beam', 'caramel sauce', 'coriander', 'ginger beer', 'pina colada mix', 'lemon juice', 'passion fruit juice', 'coffee liqueur', 'banana', 'tomato juice', 'tia maria', 'sirup of roses', 'allspice', 'schweppes russchian', 'water', 'cherry heering', 'apple brandy', 'blackcurrant cordial', 'grand marnier', 'coconut rum', 'chocolate sauce', 'strawberry liqueur', 'celery salt', 'pisco', 'yukon jack', 'raspberry liqueur', 'erin cream', 'agave syrup', 'dry vermouth', 'worcestershire sauce', 'absolut vodka', 'egg', 'creme de cacao', 'sprite', 'vanilla ice-cream', 'carbonated soft drink', 'marjoram leaves', 'white rum', 'banana liqueur', 'butter', 'tomato juice', 'orange juice', 'almond', 'candy', 'grain alcohol', 'pineapple juice', '151 proof rum', 'blue curacao', 'tea', 'brown sugar', 'cranberry juice', 'pineapple syrup', 'coconut liqueur', 'wormwood', 'lager', 'mountain dew', 'limeade', 'pepsi cola', 'dubonnet rouge', 'triple sec', 'maraschino cherry', 'vodka', 'condensed milk', 'jack daniels', 'anisette', 'sarsaparilla', 'grapefruit juice', 'blackcurrant squash', 'grapefruit juice', 'pepper', 'hot damn', 'coconut syrup', 'lemonade', 'absolut peppar', 'orange peel', 'peach schnapps', 'dark rum', 'st. germain', 'fruit punch', 'soda water', 'applejack', 'everclear', 'cinnamon', 'sugar syrup', 'lavender', 'irish whiskey', 'dark creme de cacao', 'curacao', 'half-and-half', 'tennessee whiskey', 'maraschino liqueur', 'orange spiral', 'cognac', 'whipped cream', 'whipped cream', 'gin', 'kahlua', 'cherries', 'green creme de menthe', 'goldschlager', 'cantaloupe', 'cayenne pepper', 'coconut milk', 'olive brine', 'orgeat syrup', 'whiskey', 'egg white', 'absolut kurant', 'blended whiskey', 'blackberry brandy', 'black sambuca', 'pisang ambon', 'whisky', 'carrot', 'salt', 'cream', 'milk', 'wild turkey', 'angostura bitters', 'fresca', 'lemon', 'vanilla vodka', 'johnnie walker', 'tequila', "bailey's irish cream", 'chocolate milk', 'club soda', 'bitters', 'surge', 'sugar', 'cranberry vodka', 'chocolate', 'kool-aid', 'anis', 'chambord raspberry liqueur', 'lime juice', 'caramel coloring', 'light cream', 'ginger ale', 'lemon juice', 'agave syrup', 'strawberry schnapps', 'food coloring', 'green chartreuse', 'kiwi', 'lime', '7-up', 'glycerine', 'kiwi liqueur', 'lemon vodka', 'cream of coconut', 'mini-snickers bars', 'angelica root', 'egg yolk', 'chocolate liqueur', 'apple cider', 'lime juice', 'lime vodka', 'ricard', 'angostura bitters', 'demerara sugar', 'anise', 'chocolate syrup', 'jello', 'sloe gin', 'mint syrup', 'cherry liqueur', 'peachtree schnapps', 'maraschino liqueur', 'butterscotch schnapps', 'ginger', 'oreo cookie', 'iced tea', 'orange', 'powdered sugar', 'maraschino liqueur', 'sweet and sour', 'cumin seed', 'beer', 'creme de mure', 'prosecco', 'nutmeg', 'tropicana', 'triple sec', 'godiva liqueur', 'apple juice', 'heavy cream', 'lemon juice', 'cornstarch', 'galliano', 'benedictine', 'orange juice', 'cherry', 'egg yolk', 'irish cream', 'espresso', 'cider', 'pink lemonade', 'campari', 'apricot brandy', 'crown royal', 'cocoa powder', 'dark rum', 'pineapple juice', 'cloves', 'drambuie', 'bitter lemon', 'kummel', 'port', 'peppermint extract', 'sherry', 'apple', 'rumple minze', 'light rum', 'guava juice', 'wine', 'daiquiri mix', 'chocolate ice-cream', 'jägermeister', 'baileys irish cream', 'kirschwasser', 'asafoetida', 'mint', 'grapes', 'champagne', 'spiced rum', 'brandy', 'fennel seeds', 'maui', 'southern comfort', 'berries', 'grape juice', 'absinthe', 'malibu rum', 'pineapple juice', 'ouzo', 'amaretto', 'lillet blanc', 'peppermint schnapps', 'gold tequila', 'almond flavoring', 'tabasco sauce']
        var choice;
        choice = [];
        for (let i = 0; i < allIngredients.length; ++i) {
            choice.push({ value: allIngredients[i], label: allIngredients[i] });
        }

        console.log(choice);
        preferences = new Choices('#element', {
            removeItemButton: true,
            maxItemCount: 5,
            choices: [],
            searchResultLimit: 5,
            renderChoiceLimit: 5
        });
        preferences.destroy();
        preferences = new Choices('#element', {
            removeItemButton: true,
            maxItemCount: 5,
            choices: choice,
            searchResultLimit: 5,
            renderChoiceLimit: 5
        });
        console.log(preferredingredients);
        if (preferredingredients[0] == "") {
            preferences.setValue([]);
        } else {
            preferences.setValue(preferredingredients);
        }
    }).catch(function (result) {
        openmodal('Error', 'Something went wrong. Please try again later');
    });
    checkFaceRecognitionRequired() 
});

function submitPreferences() {
    console.log(preferences.getValue(true))
    var preferencesToSend = preferences.getValue(true);
    var params = {};
    let preferenceString = "";
    for (let i = 0; i < preferenceString.length; ++i) {
        preferenceString += preferencesToSend[i];
    }
    var body = { 'userid': localStorage.getItem("cocktailemailid"), 'preferences': JSON.stringify(preferencesToSend) }
    var additionalParams = {
        headers: {
        }
    }
    sdk = apigClientFactory.newClient();
    sdk.userpreferencesPost(params, body, additionalParams).then(function (response) {
        res = JSON.parse(response.data.body)
        if (res == "User preference updated successfully") {
            openmodal('Success', "User preference updated successfully")
        }
    }).catch(function (result) {
        openmodal('Error', 'Something went wrong. Please try again later');
    });
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


function checkifchecked() {
    if (document.getElementById('havefacialauthentication').checked == true) {

        startcamera()
        document.getElementById('takephotoAndSubmitButton').style.visibility = 'visible';

    } else {
        stopcamera()
        document.getElementById('takephotoAndSubmitButton').style.visibility = 'hidden';
        var params = { 'userid': localStorage.getItem("cocktailemailid") };
        var body = {}
        //var body = { 'userid': 'kcherianthomas2011@gmail.com', 'userimage': base64imagetosend }
        var additionalParams = {
            headers: {
            }
        }
        console.log("calling uncheckrecognitionGet")
        sdk = apigClientFactory.newClient();
        sdk.uncheckrecognitionGet(params, body, additionalParams).then(function (response) {
            console.log(response);
            res = JSON.parse(response.data.body)
            if (res == "Delete successful!") {
                openmodal('Success', "Image Authentication removed successfully")
            }
        }).catch(function (result) {
            openmodal('Error', 'Something went wrong. Please try again later');
        });
    }

}

function startcamera() {
    const webcamElement = document.getElementById('webcam');
    const canvasElement = document.getElementById('canvas');
    const snapSoundElement = document.getElementById('snapSound');
    webcam = new Webcam(webcamElement, 'user', canvasElement, snapSoundElement);
    webcam.start()
        .then(result => {
            console.log("webcam started");
        })
        .catch(err => {
            console.log(err);
        });

}
function takephotoAndSubmit() {
    let picture = webcam.snap();
    base64imagetosend = picture.split(",")[1];
    console.log(base64imagetosend);
    webcam.stop()
    //document.querySelector('#download-photo').href = picture;
    sdk = apigClientFactory.newClient();
    var params = {};
    var body = { 'userid': localStorage.getItem("cocktailemailid"), 'userimage': base64imagetosend }
    //var body = { 'userid': 'kcherianthomas2011@gmail.com', 'userimage': base64imagetosend }
    var additionalParams = {
        headers: {
        }
    }
    sdk.userpicPost(params, body, additionalParams).then(function (response) {
        console.log(response);
        res = JSON.parse(response.data.body)
        if (res == "Upload successful") {
            openmodal('Success', "Image Authentication added successfully")
        }
    }).catch(function (result) {
        openmodal('Error', 'Something went wrong. Please try again later');
    });

}

function stopcamera() {
    webcam.stop()
}

function checkFaceRecognitionRequired() {
    sdk = apigClientFactory.newClient();
    var params = { 'userid': localStorage.getItem("cocktailemailid") }
    var body = {}
    var additionalParams = {
        headers: {
        }
    }
    sdk.userpicGet(params, body, additionalParams).then(function (response) {
        console.log(response.data.body);
        res = JSON.parse(response.data.body)
        if (res == "Required") {
            document.getElementById('havefacialauthentication').checked = true
        }

    }).catch(function (result) {
        openmodal('Error', 'Something went wrong. Please try again later');
    });
}