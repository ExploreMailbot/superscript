var mocha = require("mocha");
var should  = require("should");
var help = require("./helpers");

// Testing topics that include and mixin other topics.
describe('SuperScript TopicsSystem', function(){

  before(help.before("topicsystem"));

  describe('TopicSystem', function() {
    it("Should skip empty replies until it finds a match", function(done){
      bot.reply("testing topic system", function(err, reply){
        ["we like it","i hate it"].should.containEql(reply.string);
        done();
      });
    });
  });

  describe('Test Gambit', function() {
    // this is a testing input for the editor
    // We want a string in and false or matches out
    it("Should try string agaist gambit", function(done){
      bot.message("i like to build fires", function(err, msg){
        bot.topicSystem.gambit.findOne({input:'I like to *'}, function(e,g){
          g.doesMatch(msg, function(e,r){
            r.should.exist
            done();          
          });
        });        
      });
    });


    it("update gambit test", function(done){
      bot.topicSystem.gambit.findOrCreate({input:'this is a create test'}, function(er, gam){
        gam.save(function(){
          bot.message("this is a create test", function(err, msg){
            gam.doesMatch(msg, function(e,r) {
              r.should.exist;
              gam.input = 'this is a create *~2';
              gam.save(function(){
                bot.message("this is a create hello world", function(err, msg){
                  gam.doesMatch(msg, function(e,r) {
                    r[1].should.eql('hello world');
                    done();
                  });
                });
              });
            });
          });
        });
      });
    });

  });

  describe('TopicDiscovery', function() {
    it("Should find the right topic", function(done){
      bot.reply("i like to hunt", function(err, reply){
        reply.string.should.containEql("i like to spend time outdoors");

        bot.reply("i like to fish", function(err, reply){
          reply.string.should.containEql("me too");
          done();
        });

      });
    });
  });

  after(help.after);
});