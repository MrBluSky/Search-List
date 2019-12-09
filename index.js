const fs = require('fs');
const { spawn } = require('child_process');
const { searchList } = require('./config');

searchList.forEach((item)=>{
  const {content, directory} = item;
  runSearch(content, directory);
});

function runSearch(content, directory){
  const grep = spawn('grep',['-r', content, directory]);
  grep.stdout.on('data', (data) => {
    writeLog(`${content}查询结果: ${data.toString()}`);
  });

  grep.stderr.on('data', (data) => {
    console.error(`查找错误: ${data}`);
  });

  grep.on('close', (code) => {
    if (code !== 0) {
      writeLog(`${content}: 暂无查询结果！\n`);
      console.log(`查找退出，退出码: ${code}`);
    }
  });
}

function writeLog(searchLog){
  fs.open('log.js', 'a', (err, fd) => {
    if (err) throw err;
    fs.appendFile(fd, searchLog, 'utf8', (err) => {
      fs.close(fd, (err) => {
        if (err) throw err;
      });
      if (err) throw err;
    });
  });
}