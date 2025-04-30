const express = require('express');
const { exec } = require('child_process');
const { time } = require('console');

const timeStamp = new Date().toISOString();

const app = express();
app.use(express.json());

// async function to deploy image when webhook payload is recived
function deployImage() {
  return new Promise((resolve, reject) => {
    const ls = `kubectl rollout restart -n default deployment asp-calculator`;
    const cmd = `kubectl apply -f aspcalc.yaml`;
    console.log(`[DEPLOY] Running: ${ls}`);
    exec(ls, (error, stdout, stderr) => {
      if (error) {
        console.error(`[ERROR] ${stderr} ${timeStamp}`);
        return reject(stderr);
      }
      console.log(`[SUCCESS] ${stdout} ${timeStamp}`);
      resolve(stdout);
    });
  });
}

// When we recive a post function run this
app.post('/dockerhub-webhook', async (req, res) => {
  console.log(`[WEBHOOK] Payload received. ${timeStamp}`);
  await deployImage();
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[STARTED] Listening on port ${PORT} ${timeStamp}`);
});
