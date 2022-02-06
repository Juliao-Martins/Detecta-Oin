const video = document.querySelector('video'),
canvas = document.querySelector('canvas'),
ctx = canvas.getContext('2d'),
demo = document.querySelector('#demo');

let model;

const catchWebCam = () => {
    navigator.mediaDevices.getUserMedia({
        video: {width: 640, height: 480},
        audio: false,
    }).then(stream => {
        video.srcObject = stream;
    });
}

catchWebCam();

const detectFace = async () => {
    const predictions = await model.estimateFaces(video, false);

    ctx.drawImage(video, 0, 0);

    if (predictions.length > 0) {
        demo.innerHTML = "👾: Ema nain " + predictions.length + "!";
    } else {
        demo.innerHTML = "👾: ?";
    }

    predictions.forEach(el => {
        const start = el.topLeft;
        const end = el.bottomRight;
        const size = [end[0] - start[0], end[1] - start[1]];

        ctx.fillStyle = "#ffffff36";
        ctx.fillRect(start[0], start[1], size[0], size[1]);

        el.landmarks.forEach(landmark => {
            ctx.fillStyle = "#ff0000";
            ctx.fillRect(landmark[0], landmark[1], 5, 5);
        })
    });
}

video.addEventListener('loadeddata', async () => {
    model = await blazeface.load();
    setInterval(detectFace, 100);
});