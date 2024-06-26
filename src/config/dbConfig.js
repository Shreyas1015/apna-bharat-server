require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: true,
    ca: `-----BEGIN CERTIFICATE-----
MIIEQTCCAqmgAwIBAgIUYrz2qv66+yDPs6v9yf0/607rp6swDQYJKoZIhvcNAQEM
BQAwOjE4MDYGA1UEAwwvNDU0ZjQ5NzEtOTlhOS00MGZkLTljOTgtOTdhNzczN2Rk
ZGEwIFByb2plY3QgQ0EwHhcNMjQwNjIwMTk0NjQwWhcNMzQwNjE4MTk0NjQwWjA6
MTgwNgYDVQQDDC80NTRmNDk3MS05OWE5LTQwZmQtOWM5OC05N2E3NzM3ZGRkYTAg
UHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCCAYoCggGBANGck0OM
Zzr1iD3F2bAlZuT8Gfb6QJnTNJut+4YThFKU0QuwYuNKZLfrsRt8LTfzSm8Lg0pE
TP2nDVjyJr1dzJwKxBkFA9dRYFD9/mwlI0PWIPnc1oG+HmS76N+pDWjex2Dva2uu
dHns3Ey6kIvM3sItE6DRNMeSN7GUZPtqCbs+WmcyY6jQIsT6pOcJe33kYTwFUcT8
4Y4kfOJjJOBTd70T+Rx4uct2FWmJrhURIMdXcFqIQm8ibK5BlxDwkR1m506r77Ba
s22DgXKqXkDlmoXoamAWODL/6FqZqK9HtJNUJ5zQ2u1S1J82+CLqIJGEwpAz4qCA
UAQAygQddMTuyLHfk9o3EPvcgf+AkO+mIvj1mtQAB2aNqBpNVwvWKzUaZ8kjYVBB
I1PHEkBNLS9aGT2JJWlB307mNgXGya5lL3wNUhttXDsP/aVh4e27x8TLRDtHcYFO
dDZzEF4pR3SRqLSWB0N/STcsD30V2z6rYsuWg1hcWBVGhWmhUKJdSNQ99QIDAQAB
oz8wPTAdBgNVHQ4EFgQUFA3H5bKZ0qNtc7eWZmU/mmKBU8cwDwYDVR0TBAgwBgEB
/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQADggGBAFGnp9aftW/QTgQK
xQ7p1E6GwEDRGIJmgwMq80fdUtxdzQQj/fSJkNFM5c6SVrHroKhL+Qjw1BeOyNWS
2oJ9b5lrqJA3oNvhZlx6bbkfnTyFqnATgYeov7aJJ2yBWVD9yeBqouZPzoVIFOw3
VDzASjMuOLj0vSNz6KLnUGTikacyV0Sj7UryfIw/1jVFBpKk2Hdhe4d5W45JyW6v
wezun+6uIttrj3t0BTgEdp19X3axdsDQBqmZdYd54t5I7V9aMJ7x73INSLfrADi8
Ps0IL185SElXDHWFMJuIcsw9FzX01E/SNhhwzJZCvzvi5lXb2AYIru8mq1ytLMgu
YRNQDEqnz2JNIaQI62IJWXVJbSc5WjGpTp0av8PV+sDsanmqtDXLnNCGAHbgdNzv
ee04pRf7xBEFCKOm1s/+NSQ+lXg3CRBBgHKu2YN90mgYStzJefIMRfG9/WfeLOtP
Zym6xfT2yjSO8w5AX/VTn9tQMStCvSB8NqDkpsKpAwrdX2wDYg==
-----END CERTIFICATE-----`,
  },
});

console.log(
  `Connecting to database ${process.env.DB_NAME} at ${process.env.DB_HOST}:${process.env.DB_PORT} as user ${process.env.DB_USER}`
);

pool.connect((err) => {
  if (err) {
    console.error(`Error connecting to Database: ${err}`);
  } else {
    console.log(`Connected to ${process.env.DB_NAME} Database`);
  }
});

module.exports = pool;
