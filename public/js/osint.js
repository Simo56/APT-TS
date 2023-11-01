$(document).ready(function () {
  // Function to show the notification
  function showNotification() {
    var notification = document.getElementById('notification');
    notification.classList.remove('hidden');

    // Automatically hide the notification after a few seconds (adjust as needed)
    setTimeout(function () {
      notification.classList.add('hidden');
    }, 4000); // Hide after 4 seconds
  }

  const startButton = $('.osint-start-button');
  const stdoutSection = $('#stdout');
  const stderrSection = $('#stderr');
  const osintForm = $('form[name="osint-form"]');
  // Select the stdout div
  var stdDiv = $('.result-container');

  // Function to scroll to the bottom of the stdout div
  function scrollToBottom() {
    stdDiv.scrollTop(stdDiv[0].scrollHeight);
  }

  osintForm.submit(function (e) {
    e.preventDefault();

    // Disable the start button
    startButton.prop('disabled', true);

    // Start the OSINT gathering process
    $.ajax({
      type: 'POST',
      url: '/start-osint',
      data: osintForm.serialize(),
      success: function () {
        startButton.prop('disabled', false);
      },
      error: function (error) {
        console.log(error)
        startButton.prop('disabled', false);
      },
    });

    // Open an EventSource to get real-time output
    const source = new EventSource('/start-osint-stream'); // Use the new endpoint for streaming

    source.onmessage = function (event) {
      const output = event.data;

      if (output.startsWith('stdout:')) {
        stdoutSection.append(
          '<pre>' + output.replace('stdout:', '') + '\n' + '<pre>'
        );
        scrollToBottom(); // Scroll to the bottom
      } else if (output.startsWith('stderr:')) {
        stderrSection.append(
          '<pre>' + output.replace('stderr:', '') + '\n' + '</pre>'
        );
        scrollToBottom(); // Scroll to the bottom
      } else if (output.startsWith('exit:')){
        showNotification();
        startButton.prop('disabled', false);
        source.close();
      }
    };

    // Handle errors from the EventSource
    source.onerror = function (error) {
      startButton.prop('disabled', false);
      source.close();
    };
  });
});
