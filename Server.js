var express = require('express');
var nodemailer = require('nodemailer');
var app = express();
/*
	Here we are configuring our SMTP Server details.
	STMP is mail server which is responsible for sending and recieving email.
*/
var smtpTransport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'youngin1.lee@gmail.com',
    pass: 'ilsan3535'
  }
});
var rand, mailOptions, host, link;
/*------------------SMTP Over-----------------------------*/

/*------------------Routing Started ------------------------*/

app.get('/', function(req, res) {
  res.sendfile('index.html');
  console.log('test');
});
app.get('/send', function(req, res) {
  rand = Math.floor(Math.random() * 100 + 54);
  host = req.get('host');
  link =
    'http://' +
    req.get('host') +
    '/verify?id=' +
    rand +
    '&mail=' +
    req.query.to;
  mailOptions = {
    to: req.query.to,
    subject: '인증을 완료해주세요',
    html:
      '아래 링크를 클릭하여, <br>인증을 완료해주세요 <br><a href=' +
      link +
      '>인증 완료</a>'
  };
  console.log(mailOptions);
  smtpTransport.sendMail(mailOptions, function(error, response) {
    if (error) {
      console.log(error);
      res.end('error');
    } else {
      console.log('Message sent: ' + response.message);
      res.end('sent');
    }
  });
});

app.get('/verify', function(req, res) {
  console.log(req.protocol + ':/' + req.get('host'));
  if (req.protocol + '://' + req.get('host') == 'http://' + host) {
    console.log('Domain is matched. Information is from Authentic email');
    if (req.query.id == rand) {
      console.log(req.query.mail + ' : email is verified');
      // res.end('<h1>Email ' + mailOptions.to + ' is been Successfully verified');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(
        '<h1>축하합니다! 인증이 완료되었습니다. ' +
          '<a href="https://cafe.naver.com/rentalia?iframe_url=/LevelUpApplyList.nhn%3Fsearch.clubid=29617672">등업 게시판</a>' +
          '에 가셔서 등업게시판에 글을 올려주시면 등업이 완료됩니다.'
      );

      mailOptions = {
        to: 'youngin1.lee@gmail.com',
        subject: req.query.mail + ' : Email account verified',
        html: req.query.mail + ' : Email account verified'
      };
      console.log(mailOptions);
      smtpTransport.sendMail(mailOptions, function(error, response) {
        if (error) {
          console.log(error);
          res.end('error');
        } else {
          console.log('Message sent: ' + response.message);
          res.end('sent');
        }
      });
    } else {
      console.log('email is not verified');
      res.end('<h1>Bad Request</h1>');
    }
  } else {
    res.end('<h1>Request is from unknown source');
  }
});

/*--------------------Routing Over----------------------------*/

app.listen(3000, '0.0.0.0', function() {
  console.log('Express Started on Port 3000');
});
