import fs from 'fs';
import FormData from 'form-data';
import axios from 'axios';

const filePath = 'C:/Users/schec/OneDrive/Desktop/CS555/hamburger.jpg';
const url = 'http://localhost:5000/api/spoonacular/caption';

async function run() {
  const form = new FormData();
  form.append('image', fs.createReadStream(filePath));
  const res = await axios.post(url, form, { headers: form.getHeaders(), timeout: 60000 });
  console.log('status', res.status);
  console.log('body', JSON.stringify(res.data, null, 2));
}
run().catch(err => {
  if (err.response) console.error('response error', err.response.status, err.response.data);
  else console.error(err);
});

console.log('SPOON KEY:', process.env.SPOONACULAR_KEY);