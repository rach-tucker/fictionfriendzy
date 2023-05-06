import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import axios from 'axios';

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/verify-recaptcha', async (req, res) => {
  const { token } = req.body;

  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.NEXT_PUBLIC_RECAPTCHA_SECRET_KEY}&response=${token}`
    );

    if (response.data.success) {
      res.status(200).json({ message: 'reCAPTCHA verification successful' });
    } else {
      res.status(400).json({ message: 'reCAPTCHA verification failed' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
