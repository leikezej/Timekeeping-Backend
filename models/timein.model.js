const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  age: Number,
  timein: [{ type: Schema.Types.ObjectId, ref: 'Timein' }]
});

const timeinSchema = Schema({
  id: { type: Schema.Types.ObjectId, ref: 'User' },
  title: String,
  present: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  isVerified: [{ type: Boolean, default: false }]
});

const Timein = mongoose.model('Timein', timeinSchema);
const User = mongoose.model('User', userSchema);