//functions that will be reused in our project

import { TIMEOUT_SECONDS } from './config.js';
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST', //what we want to do : POST
          headers: {
            'Content-Type': 'application/json', //data we're sending will be in the JSON format
          },
          body: JSON.stringify(uploadData), //the data we want to send
        })
      : fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SECONDS)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

// export const getJSON = async function (url) {
//   try {
//     const res = await Promise.race([fetch(url), timeout(TIMEOUT_SECONDS)]);
//     const data = await res.json();
//     if (!res.ok) throw new Error(`${data.message} (${res.status})`);
//     return data;
//   } catch (err) {
//     //we want the error to be handled inside the model.js try-catch block, thus we re-throw the error
//     throw err;
//   }
// };

// export const sendJSON = async function (url, uploadData) {
//   try {
//     //setting up a POST request
//     const fetchPro = fetch(url, {
//       method: 'POST', //what we want to do : POST
//       headers: {
//         'Content-Type': 'application/json', //data we're sending will be in the JSON format
//       },
//       body: JSON.stringify(uploadData), //the data we want to send
//     });
//     const res = await Promise.race([fetchPro, timeout(TIMEOUT_SECONDS)]);
//     const data = await res.json();
//     if (!res.ok) throw new Error(`${data.message} (${res.status})`);
//     return data;
//   } catch (err) {
//     //we want the error to be handled inside the model.js try-catch block, thus we re-throw the error
//     throw err;
//   }
// };
