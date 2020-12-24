const mongoose = require("mongoose");
const config = require("config");
const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "1104926",
  key: "c9ed8dfc2397c3182e8a",
  secret: "4de0eee429c4846d038f",
  cluster: "us3",
  useTLS: true
});

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.get("mongoURI"), {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });

    console.log("Mongo DB Connected...!");

    const changeStream = mongoose.connection.collection('groups').watch();

    changeStream.on('change', (change) => {
      if (change.operationType === 'update'){
        pusher.trigger('msg', 'newMsg', {
          'change' : change
        });
      } else {
        console.log('Error triggering pusher...!');
      }
    })

  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = connectDB;
