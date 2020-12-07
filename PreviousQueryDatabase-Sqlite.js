var dbFunc = {
  add: function(db) {
        let invarg = message.toLowerCase().split(" ");
        if(arrayMsg.length < 2) {
          client.say(channel, 'Command must begin with an exclamation mark (!). Use the following guidelines:');
          client.say(channel, '/me !addcomm [!command] [text]');
        }
        else if(!arrayMsg[1].startsWith("!")) {
          client.say(channel, 'Command must begin with an exclamation mark (!). Use the following guidelines:');
          client.say(channel, '/me !addcomm [!command] [text]');
        }
        else if(arrayMsg[1].startsWith("!")) {
      // SPLITS NEW COMMAND FROM STRING
          let argsComm = arrayMsg[1].substring(PREFIX.length).toLowerCase();
      // SPLITS THE EXECUTE FROM STRING
          let argsStat = message.split(" ").slice(2).join(" ");
         //client.say(channel, argsStat);
          var addcomm_run = "SELECT EXISTS(SELECT Commands.name FROM Commands WHERE Commands.name='" + argsComm + "')";
          db.all(addcomm_run, (err, value) => {
            if(err) {
              console.log(err.message);
            }
            if((Object.values(value[0])[0]) === 1) {
              console.log('Command already in database.');
              client.say(channel, 'Command already in database.');
            }

      //////////// ERROR HERE: SQLITE_MISUSE: Database handle is closed ////////
      /////////////////////////////////////////////////////////////////////////
            else if((Object.values(value[0])[0]) === 0) {
              db.serialize(function() {
                db.run("BEGIN TRANSACTION;");
                console.log('Transaction begun.');
                db.run("INSERT OR IGNORE INTO Commands (name, execute) VALUES (?,?);", [argsComm, argsStat], function(err) {
                  if (err) {
                    console.log(err.message);
                  }
                });
                console.log('Data inserted.');
                db.run("COMMIT;");
                console.log('Commit complete.');
              });
              client.say(channel, "Command: !" + argsComm + " has been added to the database.");
            }
          });
        }
      },
  update: function(db) {
        if(arrayMsg.length < 2) {
          client.say(channel, 'Command must begin with an exclamation mark (!). Use the following guidelines:');
          client.say(channel, '/me !update [!command] [text]');
        }
        else if(!arrayMsg[1].startsWith("!")) {
          client.say(channel, 'Command must begin with an exclamation mark (!). Use the following guidelines:');
          client.say(channel, '/me !update [!command] [text]');
        }
        else if(arrayMsg[1].startsWith("!")) {
          client.say(channel, "Update feature not implemented yet.");
        }
      },
  query: function(db) {
      // Queries the command variable 'cmdargs'
      // Since 'cmdargs' is a string, spaces are okay
      // - but prefer no spaces in commands
        var db_run = "SELECT EXISTS(SELECT Commands.name FROM Commands WHERE Commands.name='" + stringMsg + "')";
      // Checks to see if it exists in the database
      // 1 = Exists in database
      // 0 = Not in database
        db.all(db_run, (err, value) => {
          if(err) {
            console.log(err.message);
          }
      // When value = 1 => return 'execute' of command
          else if((Object.values(value[0])[0]) === 1) {
            db.all("SELECT Commands.execute FROM Commands WHERE Commands.name='" + stringMsg + "'", function(err, row) {
              if(err) {
                console.log(err.message)
              }
      // Returns 'execute' column from command
              client.say(channel, String(row[0].execute));
            });
          }
      // When value = 0 => query not in database
          else if((Object.values(value[0])[0]) === 0) {
      // Check if in saved commands list => do nothing
            if(savedCommands.includes(stringMsg)) {
              console.log('Command used elsewhere.');
            }
      // If start of string = "!" => i.e. "!!", do nothing
            else if(arrayMsg[0].startsWith("!")) {
              console.log('String of exclamation marks.');
            }
      // If end of string = "!" => i.e. "! OMG !", do nothing
            else if(arrayMsg[0].endsWith("!")) {
              console.log('String of exclamation marks.');
            }
      // If string includes extra special characters
      // i.e. "!@#$ YOU", do nothing
            else if(/[~`!@#$%\^&*\(\)+=\[\]\\';,/{}|\\":<>\?]/g.test(arrayMsg[0])) {
              console.log('Special characters.');
            }
      // If string isn't in saved commands
            else if(!savedCommands.includes(stringMsg)) {
      // If string equals exactly "runannouncements", do nothing
              if(arrayMsg[0] === "runannouncements") {
                console.log('Command used elsewhere.');
              }
      // If string is in announcement list, do nothing
              else if(announcements.includes(arrayMsg[0])) {
                console.log('Command used elsewhere.');
              }
      // If none of the above, reply with "couldn't find in database"
              else {
                client.say(channel, "/me Couldn't find command in database.");
              }
            }
          }
        });
      },
  setTimes: function(db) {
        db.all("SELECT Commands.execute FROM Commands WHERE Commands.name='" + "settimes" + "'", function(err, row) {
          if(err) {
            console.log(err.message)
          }
      // Returns 'execute' column from command => "!settimes"
          client.say(channel, String(row[0].execute));
        });
      },

  call: function(db) {
    if(args[0] === "addcomm") {
      if(args[0] === "addcomm") {     /// temporary to hide other code
        client.say(channel, "'Add Command' feature not yet implemented.");
      }
    ////// HIDDEN CODE ///
      else if(args[0] === "test") {     /// this code will never excute
        dbFunc.add(db);
      }
    }
    // Update command function (currently not working)
    else if(args[0] === "update") {
      if(args[0] === "update") {      /// temporary to hide other code
        client.say(channel, "'Update Command' feature not yet implemented.");
      }
    ////// HIDDEN CODE ///
      else if(args[0] === "test") {     /// this code will never excute
        dbFunc.update(db);
      }

    }
    // Query database
    else {
      let settimes = [
        "settimes", "times", "set times", "set", "lineup", "line up", "line-up", "set-times"
      ]
      if(args[0] < 1) {
        console.log('Not a command.');
      }
    // set times commands
      else if(settimes.includes(args[0])) {
        dbFunc.setTimes(db);
        // dbSetTimes(db);
      }
      else {
        dbFunc.query(db);
      }
    }
  },

  close: function(db) {
    db.close((err) => {
      if(err) {
        console.log(err.message);
        console.log("Couldn't close database.");
      }
      else {
        console.log('Closed database.');
      }
    });
  }
};
var databaseUrl = {
  circuitaz: "./Database/circuitaz.sqlite",
  theblindhobo: "./Database/theblindhobo.sqlite",
  treetimeofficial: "./Database/treetimeofficial.sqlite"
};

if(channel === "#circuitaz") {
  const sqlite3 = require('sqlite3').verbose()
  var db = new sqlite3.Database(databaseUrl.circuitaz, (err) => {
    if (err) {
      console.log(err.message);
    }
    else {
        console.log('Connected to database.');
    }
  });
  dbFunc.call(db);
  dbFunc.close(db);
}
else if(channel === "#theblindhobo_") {
  const sqlite3 = require('sqlite3').verbose()
  var db = new sqlite3.Database(databaseUrl.theblindhobo, (err) => {
    if (err) {
      console.log(err.message);
    }
    else {
      console.log('Connected to database.');
    }
  });
  dbFunc.call(db);
  dbFunc.close(db);
}
else if(channel === "#treetimeofficial") {
  const sqlite3 = require('sqlite3').verbose()
  var db = new sqlite3.Database(databaseUrl.treetimeofficial, (err) => {
    if (err) {
      console.log(err.message);
    }
    else {
      console.log('Connected to database.');
    }
  });
  dbFunc.call(db);
  dbFunc.close(db);
}
