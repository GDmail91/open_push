module.exports = {
  "user_schema": {
    "access_token": { "type": "String", "require": true, "unique": true },
    "refresh_token": { "type": "String", "require": true, "unique": true },
    "level": { "type": "String", "require": true, "default": "3rd_party" },
    "exp_date": { "type": "String", "require": true },
    "alias": { "type": "String", "require": true, "unique": true }
  },
  "message_schema": {
    "topic": { "type": "String", "require": true },
    "message": {"type": "String", "require": true },
    "sender": { "type": "String", "require": true },
    "postDate": { "type": "Date", "default": Date.now }
  }
}