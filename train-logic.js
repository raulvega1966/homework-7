/* global $,firebase,moment */

// Initialize Firebase
var config = {
    apiKey: "AIzaSyCg9azqO9oLPbZ4VwT8NSoP3u_9onTQENU",
    authDomain: "homework7-9d29f.firebaseapp.com",
    databaseURL: "https://homework7-9d29f.firebaseio.com",
    storageBucket: "homework7-9d29f.appspot.com",
    messagingSenderId: "469290631499"
};
firebase.initializeApp(config);

var database = firebase.database();


// 2. Button for adding Train Information (name, destination, first train time and frequency)
$("#add-train-btn").on("click", function() {

    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var firstTrainTime = moment($("#first-train-time-input").val().trim(), "HH:mm").format("X");
    var frequency = $("#freq-input").val().trim();
    var currentTime = moment();

    //console logs of input information - for me to check information is correct
    //console.log("first train time in X format: " + firstTrainTime);
    //console.log("first train time AM / PM: " + moment.unix(firstTrainTime).format("h:mm a"));
    //console.log("current Time Variable in X format: " + currentTime);
    //console.log("CURRENT TIME AM / PM: " + moment(currentTime).format("h:mm a"));
    //console.log("frequency in minutes: " + frequency);
    //console.log(moment(frequency).format("X"));


    //Time Difference between now and departure of first train
    var timedifferential = currentTime - firstTrainTime;
    //console.log("timedifferential : " + timedifferential);
    //console.log("frequency in minutes: " + frequency);

    // Time apart between each train- 
    var frequencyX = moment(frequency).format("X");
    //console.log("frequencyX: " + frequencyX);
    var remainingTime = timedifferential % frequencyX;
    //console.log("REMAINING TIME in X: " + remainingTime);
    //console.log("REMAINING TIME in X: " + moment(remainingTime, "X").format("mm"));

    // Minute Until Train Arrives
    var minutesuntiltrainarrives = frequencyX - remainingTime;
    //console.log("TIME TILL TRAIN in X: " + minutesuntiltrainarrives);
    //console.log("MINUTES TILL TRAIN: " + moment(minutesuntiltrainarrives, "X").format("mm"));

    // Next Train
    var nextTrain = moment().add(minutesuntiltrainarrives, "minutes");
    //console.log("ARRIVAL TIME in hours: " + moment(nextTrain).format("HH:mm"));

    // Arrival time
    nextArrival = moment(nextTrain).format("HH:mm a");
    //console.log("next arrival in hours: " + nextArrival);


    //var timedifferential = (currentTime - firstTrainTime);
    //var timedifferential = moment().diff(firstTrainTime, "mm");
    //console.log(moment(firstTrainTime).diff(moment(), "mm"));
    //console.log("time differential X time: " + timedifferential);
    // console.log("time differential minutes: " + moment(timedifferential).format("mm"));
    // var nextArrival = (timedifferential + frequency);
    // console.log("next arrival in X time: " + nextArrival);
    // console.log("NEXT ARRIVAL AM / PM: " + moment(nextArrival).format("h:mm a"));

    // Creates local "temporary" object for holding train data
    var newTrain = {
        name: trainName,
        dest: destination,
        firstTT: firstTrainTime,
        freq: frequency,
        nextArr: nextArrival,
        minAway: minutesuntiltrainarrives,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    };

    // Uploads train data to the database
    database.ref().push(newTrain);

    // Logs everything to console
    console.log("new train name: " + newTrain.name);
    console.log("new train dest: " + newTrain.dest);
    console.log("first train time: " + newTrain.firstTT);
    console.log("frequency: " + newTrain.freq);
    console.log("next arrival time: " + newTrain.nextArr);
    console.log("minutes away: " + newTrain.minAway);

    // Alert
    // alert("Train successfully added");

    //  Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-time-input").val("");
    $("#freq-input").val("");

    // Prevents moving to new page
    return false;
});

// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot) {

    console.log(childSnapshot.val());

    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var destination = childSnapshot.val().dest;
    var firstTrainTime = childSnapshot.val().firstTT;
    var frequency = childSnapshot.val().freq;
    var nextArrival = childSnapshot.val().nextArr;
    var minutesAway = childSnapshot.val().minAway;

    // Train Info
    //console.log("new train name: " + trainName);
    //console.log("new train destination: " + destination);
    //console.log("first train time: " + firstTrainTime);
    //console.log("frequency: " + frequency);
    //console.log("next arrival: " + nextArrival);
    //console.log("minutes away: " + minutesAway);

    // Prettify the Train Information
    var minutesAwayPretty = moment(minutesAway).format("mm");

    // Add each Trains's data into the table
    //$("#employee-table > tbody").append("<tr><td>" + empName + "</td><td>" + empRole + "</td><td>" + empStartPretty + "</td><td>" + empMonths + "</td><td>" + empRate + "</td><td>" + empBilled + "</td></tr>");
    $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + frequency +
        "</td><td>" + nextArrival + "</td><td>" + minutesAwayPretty + "</td></tr>");
});




