const fs = require('fs');
function getDirectories(path) {
    return fs.readdirSync(path).filter(function (file) {
      return fs.statSync(path+'/'+file).isDirectory();
    });
  }

//let folderList = getDirectories('./reports');
//console.log(folderList);
  //fs.rmSync('./reports', { recursive: true, force: true });
  // print all the directories in the 'cypress/cucumber-html-report' folder
// getDirectories('./reports').forEach(function (folder) {
//     console.log(folder);
// });



const today = new Date();
const dd = today.getDate();
const mm = today.getMonth()+1; //January is 0!
const yyyy = today.getFullYear();

const folderName = './reports/'+yyyy+'-'+mm+'-'+dd+'-'+'cucumber-html-report';
    


const report = require("./reports/multiple-cucumber-html-reporter");
report.generate({
    jsonDir: "cypress/cucumber-json",  // ** Path of .json file **//
    reportPath: folderName,  // ** Path of the report **//
    metadata: {
        browser: {
            name: "chrome",
            version: "81",
        },
        device: "Local test machine",
        platform: {
            name: "mac",
            version: "Catalina",
        },
    },
});


// move the index.html file to the cucumber-html-reports folder
fs.rename(folderName+'/index.html', './reports/cucumber-html-reports'+'/'+yyyy+'-'+mm+'-'+dd+'-'+'cucumber-html-report.html', function (err) {	
    if (err) {
        console.log(err);
    } else {
        fs.readFile('./reports/cucumber-html-reports'+'/'+yyyy+'-'+mm+'-'+dd+'-'+'cucumber-html-report.html', 'utf8', function (err,data) {
            if (err) {
                return console.log(err);
            } else {
                const result = data.replace(/features\//g, yyyy+'-'+mm+'-'+dd+'-'+'features/');
                fs.writeFile('./reports/cucumber-html-reports'+'/'+yyyy+'-'+mm+'-'+dd+'-'+'cucumber-html-report.html', result, 'utf8', function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        updateFileList();
                    }
                });
            }
        });
        
    }
});

// move the folder folderName/features to cucumber-html-reports/yyyy-mm-dd-features
// first delete the folder if './reports/cucumber-html-reports'+'/'+yyyy+'-'+mm+'-'+dd+'-'+'features' exists
fs.rm('./reports/cucumber-html-reports'+'/'+yyyy+'-'+mm+'-'+dd+'-'+'features', { recursive: true, force: true }, function (err) {
    if (err) {
        console.log(err);
    } else {
        fs.rename(folderName+'/features', './reports/cucumber-html-reports/'+yyyy+'-'+mm+'-'+dd+'-'+'features', function (err) {
            if (err) {
                console.log(err);
            } else {
                fs.rm(folderName, { recursive: true, force: true }, function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        });
    }
});


function updateFileList(){
    fs.readFile('./reports/cucumber-html-reports/fileList.js', 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        } else {
            let fileList = data.split('var fileList = [');
            fileList = fileList[1].split('];');
            fileList = fileList[0].split(',');
            const newFile = '"'+yyyy+'-'+mm+'-'+dd+'-'+'cucumber-html-report.html'+'"'

            // if the file is not in the fileList, add it
            while (fileList.length > 30) {
                const fileName = fileList.pop();
                const fileDir = './reports/cucumber-html-reports/' + fileName.replace(/"/g, '');
                fs.unlink(fileDir, function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
                // remove the yyyy-mm-dd-features folder
                const date = fileName.split('-')[0] + '-' + fileName.split('-')[1] + '-' + fileName.split('-')[2];
                fs.rm('./reports/cucumber-html-reports/'+date+'-features', { recursive: true, force: true }, function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
            }

            if (fileList.indexOf(newFile) == -1) {
                // append it at first position
                fileList.unshift(newFile);
                fileList = fileList.join(',');
                fileList = 'var fileList = ['+fileList+'];';
                fs.writeFile('./reports/cucumber-html-reports/fileList.js', fileList, 'utf8', function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        }
    });
}

// replace href="features/" with href="yyyy-mm-dd-features/" in the cucumber-html-reports/yyyy-mm-dd-cucumber-html-report.html

// get all the files in folderName/features
// let files = fs.readdirSync(folderName+'/features');

// // move all files from folderName/features to cucumber-html-reports/features
// files.forEach(function (file) {
//     fs.rename(folderName+'/features/'+file, './reports/cucumber-html-reports/features/'+file, function (err) {
//         if (err) {
//             console.log(err);
//         }
//     });
// });



// delete the folder
// fs.rm(folderName, { recursive: true, force: true }, function (err) {
//     if (err) {
//         console.log(err);
//     }
// });