// popup.js

document.addEventListener('DOMContentLoaded', function() {
    var global_caption_url = '';
    var global_url = 'http://127.0.0.1:5000/process_video';
    // var global_url = 'https://excited-needlessly-gopher.ngrok-free.app/';
    var globalCaptionUrls = [];

    function getVideoInformation() {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            var currentTabUrl = tabs[0].url;
            var apiUrl = global_url + '?youtube_url=' + encodeURIComponent(currentTabUrl);

            fetch(apiUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {

                    console.log('data is ', data.task1);
                    console.log('data is ', data.task2);
                    const template = `
                    <html>
                    <head>
                        <title>My Video Page</title>
                    </head>
                        <body>
                            <div id="vtt">
                                <a href="${data.task2}" download="${data.task2}">Download VTT</a>
                            </div>

                            <video id="myVideo" width="720" height="405" controls>
                                <source src="${data.task1}" type="video/mp4">
                                    <track src="${data.task2}" kind="subtitles" srclang="en" label="English" default>
                            </video>
                        </body>
                    </html>
                    `;

                    // 创建一个包含模板的数据 URL
                    const dataUrl = 'data:text/html;charset=UTF-8,' + encodeURIComponent(template);
                    // 打开新的选项卡，并在其中加载数据 URL
                    chrome.tabs.create({ url: dataUrl });
                })
                .catch(error => {
                    console.error('get_video_info fail, try later:', error);
                    document.getElementById('result').textContent = 'get_video_info fail';
                });
        });
    }

    // 调用 getVideoInformation，确保在 DOM 加载完成后执行
    getVideoInformation();



});
