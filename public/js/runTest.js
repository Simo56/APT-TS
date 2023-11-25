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

  // Select the stdout div
  var stdScanDiv = $('.result-container-scan');

  // Function to scroll to the bottom of the stdout div
  function scrollToBottomScan() {
    stdScanDiv.scrollTop(stdScanDiv[0].scrollHeight);
  }

  // Start the scan process as the first task
  $.ajax({
    type: 'POST',
    url: '/start-scan',
    data: inputData,
    success: function () {},
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
      $('#scanIcon').toggle();
      startExploitation();
      sourceScan.close();
    }
  };

  // Handle errors from the EventSource
  sourceScan.onerror = function (error) {
    sourceScan.close();
  };

  var vulnerabilities;
  // Function to continue with the exploitation
  function startExploitation() {
    $.ajax({
      type: 'POST',
      url: '/start-exploitation',
      data: inputData,
      success: function (response) {
        console.log('success function start exploitation AJAX');
        // Assuming vulnerabilities is an array in the response
        vulnerabilities = response.CVEArray.vulnerabilities;

        // Update the dropdown or any other part of your UI with the received data
        updateUIWithVulnerabilities(vulnerabilities);

        showNotificationExploit();
        $('#expIcon').toggle();
      },
      error: function (error) {
        console.log(error);
      },
    });
  }

  // Handle "Run Command" button click
  $('#runCommandBtn').on('click', function () {
    // Get the selected value from the dropdown
    var selectedValue = $('#vulnerabilities').val();
    var commandString;
    for (const key in vulnerabilities) {
      if (vulnerabilities.hasOwnProperty(key) && key == selectedValue) {
        commandString = vulnerabilities[key];
      }
    }
    // Display the selected value in a text box or another HTML element
    displaySelectedValue(commandString);
  });

  // Function to display the selected value
  function displaySelectedValue(value) {
    // Update this part based on how you want to display the selected value
    $('#selectedValueDisplay').text('Run This Command: ' + value);
  }

  function updateUIWithVulnerabilities(vulnerabilities) {
    // Assuming you have a function to update the UI with vulnerabilities
    // For example, update the dropdown options
    var select = $('#vulnerabilities');
    select.empty(); // Clear existing options

    console.log(vulnerabilities);
    console.log('TIPO DATO VULNERABILITIES:' + typeof vulnerabilities);
    for (const key in vulnerabilities) {
      if (vulnerabilities.hasOwnProperty(key)) {
        const value = vulnerabilities[key];
        console.log(`${key}: ${value}`);
        var option = $('<option>', {
          value: key,
          text: key,
        });
        select.append(option);
      }
    }
  }
});
