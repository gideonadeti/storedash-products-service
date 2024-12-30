dotenv.config();
import app from './app';

import dotenv from 'dotenv';

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
