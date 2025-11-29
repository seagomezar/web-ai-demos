const url = new URL('./worker.js', import.meta.url);
import { MESSAGE_CODE, MODEL_STATUS } from './consts.js';

function displayModelStatus(status) {
  document.getElementById('modelStatus').className = status;
}

function runLLMInference() {
  const userPrompt = document.getElementById('userPrompt').value;
  worker.postMessage(userPrompt);
}

displayModelStatus(MODEL_STATUS.NOT_STARTED);
const worker = new Worker(url);

worker.onmessage = function (message) {
  console.info('[Main thread] 📬 Message from worker: ', message);

  if (!message.data || !message.data.code) {
    throw new Error(
      `Message from worker is empty or doesn't contain a code field: ${message}`
    );
  }
  const messageCode = message.data.code;
  console.log(messageCode)
  switch (messageCode) {
    case MESSAGE_CODE.PREPARING_MODEL:
      displayModelStatus(MODEL_STATUS.PREPARING);
      document.getElementById('inferenceButton').disabled = true;
      document.getElementById('progressContainer').style.display = 'block';
      break;

    case MESSAGE_CODE.MODEL_PROGRESS:
      displayModelStatus(`${MODEL_STATUS.PREPARING} (${message.data.payload}%)`);
      document.getElementById('progressBar').style.width = `${message.data.payload}%`;
      break;

    case MESSAGE_CODE.MODEL_READY:
      displayModelStatus(MODEL_STATUS.READY);
      document.getElementById('inferenceButton').disabled = false;
      document.getElementById('progressContainer').style.display = 'none';
      break;

    case MESSAGE_CODE.GENERATING_RESPONSE:
      displayModelStatus(MODEL_STATUS.GENERATING);
      document.getElementById('inferenceButton').disabled = true;
      break;

    case MESSAGE_CODE.RESPONSE_READY:
      displayModelStatus(MODEL_STATUS.READY);
      document.getElementById('inferenceButton').disabled = false;
      document.getElementById('llmOutput').innerText = message.data.payload;
      break;

    case MESSAGE_CODE.MODEL_ERROR:
      displayModelStatus(MODEL_STATUS.ERROR);
      document.getElementById('inferenceButton').disabled = true;
      break;

    case MESSAGE_CODE.INFERENCE_ERROR:
      displayModelStatus(MODEL_STATUS.ERROR);
      document.getElementById('inferenceButton').disabled = false;
      break;

    default:
      throw new Error(
        `Message from worker contains an unknown message code: ${messageCode}`
      );
  }
};

window.runLLMInference = runLLMInference;
