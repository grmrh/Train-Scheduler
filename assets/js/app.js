 // Initialize Firebase
 var config = {
  apiKey: "AIzaSyASRuqWmMZXjY-vsWis0rAz3Li_zG2erac",
  authDomain: "mypro1-a5ac8.firebaseapp.com",
  databaseURL: "https://mypro1-a5ac8.firebaseio.com",
  projectId: "mypro1-a5ac8",
  storageBucket: "mypro1-a5ac8.appspot.com",
  messagingSenderId: "990386012661"
};
firebase.initializeApp(config);
var dataRef = firebase.database();

// capture the submit button click
$("#add-train").on("click", function(e) {
  e.preventDefault();

  var trainName = $("#trainName").val().trim();
  var destination = $("#destination").val().trim();
  var firstTrainTime = moment($("#firstTrainTime").val().trim(), "HH:mm").format("X");
  //var firstTrainTime = moment($("#firstTrainTime").val().trim(), "HH:mm");
  var frequency = $("#frequency").val().trim();
  
  var newTrainSchedule = {
    trainName: trainName,
    destination: destination,
    firstTrainTime: firstTrainTime,
    frequency: frequency,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  };

  console.log(trainName);
  console.log(destination);
  console.log(firstTrainTime);
  console.log(frequency);

  dataRef.ref().push(newTrainSchedule);
});

// Initial loader and firebase watcher. Note the difference fron .on("value")
dataRef.ref().on("child_added", function(childSnap) {

  var trainName = childSnap.val().trainName;
  var destination = childSnap.val().destination;
  var firstTrainTime = childSnap.val().firstTrainTime;
  var frequency = childSnap.val().frequency;

  var firstTrainTimeInFormat = moment.unix(firstTrainTime).format("HH:mm");
  console.log("firstTrainTime: " + firstTrainTime);
  console.log("firstTrainTimeInFormat : " + firstTrainTimeInFormat);

  console.log(moment());
  var timeDifference = moment().diff(moment(firstTrainTimeInFormat), "minutes");
  //var timeDifference = 53;
  var tRemainder = timeDifference % frequency;
  var tMinutesTillNextTrain = frequency - tRemainder;
  var nextTrainArrival = moment().add(tMinutesTillNextTrain, "minutes");

  $("#scheduler tbody").append("<tr><td>" + trainName + "</td>" +
                                    "<td>" + destination + "</td>" +
                                    "<td>" + frequency + "</td>" +
                                    "<td>" + nextTrainArrival + "</td>" +
                                    "<td>" + tMinutesTillNextTrain + "</td></tr>");

}, function(errorObject) {
  console.log("Errors handled: " + errorObject.code);
});

dataRef.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snap) {

  $("#trainName").text(snap.val().trainName);
  $("#destination").text(snap.val().destination);
  $("#firstTrainTime").text(moment.unix(snap.val().firstTrainTime).format("HH:mm"));
  $("#frequency").text(snap.val().frequency);
})
