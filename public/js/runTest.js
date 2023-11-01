$(document).ready(function () {
  // Function to show the notification after scanning completed
  function showNotificationScan() {
    var notification = document.getElementById('notificationScan');
    notification.classList.remove('hidden');

    // Automatically hide the notification after a few seconds (adjust as needed)
    setTimeout(function () {
      notification.classList.add('hidden');
    }, 4000); // Hide after 4 seconds
  }

  // Function to show the notification after exploitation completed
  function showNotificationExploit() {
    var notification = document.getElementById('notificationExploit');
    notification.classList.remove('hidden');

    // Automatically hide the notification after a few seconds (adjust as needed)
    setTimeout(function () {
      notification.classList.add('hidden');
    }, 4000); // Hide after 4 seconds
  }

  
  const stdoutscanSection = $('#stdoutscan');
  const stderrscanSection = $('#stderrscan');

  const stdoutexpSection = $('#stdoutexp');
  const stderrexpSection = $('#stderrexp');

  // Select the stdout div
  var stdScanDiv = $('.result-container-scan');
  var stdExpDiv = $('.result-container-exploit');

  // Function to scroll to the bottom of the stdout div
  function scrollToBottomScan() {
    stdScanDiv.scrollTop(stdScanDiv[0].scrollHeight);
  }
  function scrollToBottomExploit() {
    stdExpDiv.scrollTop(stdExpDiv[0].scrollHeight);
  }

  //test output
  console.log(inputData);
  
  // Start the scan process as the first task
  $.ajax({
    type: 'POST',
    url: '/start-scan',
    data: inputData,
    success: function () {
      
    },
    error: function (error) {
      console.log(error);
    },
  });

  // Open an EventSource to get real-time output
  const sourceScan = new EventSource('/start-scan-stream'); // Use the new endpoint for streaming the scan subprocess

  sourceScan.onmessage = function (event) {
    const output = event.data;

    if (output.startsWith('stdout:')) {
    stdoutscanSection.append(
        '<pre>' + output.replace('stdout:', '') + '\n' + '<pre>'
      );
      scrollToBottomScan(); // Scroll to the bottom
    } else if (output.startsWith('stderr:')) {
      stderrscanSection.append(
        '<pre>' + output.replace('stderr:', '') + '\n' + '</pre>'
      );
      scrollToBottomScan(); // Scroll to the bottom
    } else if (output.startsWith('exit:')) {
      showNotificationScan();
      sourceScan.close();
    }
  };

  // Handle errors from the EventSource
  sourceScan.onerror = function (error) {
    sourceScan.close();
  };
});
