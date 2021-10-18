//make excel file using excel4node
//make folders
//make pdfs using pdf-lib

let minimist=require("minimist");
let fs=require("fs");
// let excel4node=require("excel4node");
let path=require("path")
let pdf=require("pdf-lib");
let args=minimist(process.argv);

let matchInfoJson=fs.readFileSync(args.source,"utf-8");
let teamsInfo=JSON.parse(matchInfoJson);

// //Excel

// let wb= new excel4node.Workbook();

// for(let i=0;i<teamsInfo.length;i++)
// {
//     let ws = wb.addWorksheet(teamsInfo[i].name);
//     ws.cell(1, 1).string('VS');
//     ws.cell(1, 2).string('Self Score');
//     ws.cell(1, 3).string('Opp Score');
//     ws.cell(1, 4).string('Result');
//     for(let j=0;j<teamsInfo[i].matches.length;j++)
//     {
//         ws.cell(2+j, 1).string(teamsInfo[i].matches[j].vs);
//         ws.cell(2+j, 2).string(teamsInfo[i].matches[j].selfScore);
//         ws.cell(2+j, 3).string(teamsInfo[i].matches[j].oppScore);
//         ws.cell(2+j, 4).string(teamsInfo[i].matches[j].result);
//     }
// }

// wb.write("TeamsInfo.xlsx");
// // Excel Ends

//making folders

for(let i=0;i<teamsInfo.length;i++)
{
    let folderPath=path.join("data",teamsInfo[i].name);
    // console.log(folderPath);
    fs.mkdirSync(folderPath);
}

// making folders

// making pdf

for(let i=0;i<teamsInfo.length;i++)
{
    let folderPath=path.join("data",teamsInfo[i].name);
    for(let j=0;j<teamsInfo[i].matches.length;j++)
    {
        let matchFileName=path.join(folderPath,teamsInfo[i].matches[j].vs + ".pdf")//making path for our pdfs
        // fs.writeFileSync(matchFileName,"","utf-8");//making pdfs of vs names
        // console.log(matchFileName);
        createScorceCard(teamsInfo[i].matches[j],matchFileName,teamsInfo[i].name);
    }
}

function createScorceCard(teamsObject,filePath,teamName)
{
    let originalBytes=fs.readFileSync("Template.pdf");

    let t1=teamName;
    let t1s=teamsObject.selfScore;
    let t2=teamsObject.vs;
    let t2s=teamsObject.oppScore;
    let results=teamsObject.result;
    // console.log(teamsObject.selfScore);
    // console.log(teamsObject.oppScore);
    // console.log(teamName);
    // console.log();

    let promiseToLoad=pdf.PDFDocument.load(originalBytes);
    promiseToLoad.then(function(pdfDoc){
        let page=pdfDoc.getPage(0);
        page.drawText(t1+" vs "+t2, {
            x:250,
            y:574,
            size:16
        });
        page.drawText(t1, {
            x:249,
            y:538,
            size:16
        });
        page.drawText(t1s, {
            x:249,
            y:499.5,
            size:16
        });
        page.drawText(t2, {
            x:250,
            y:462.5,
            size:16
        });
        page.drawText(t2s, {
            x:250,
            y:425.5,
            size:16
        });
        page.drawText(results, {
            x:250,
            y:386,
            size:16
        });
        let promiseToSave=pdfDoc.save();
        promiseToSave.then(function(changedBytes){ 
            if(fs.existsSync(filePath))
            {
                filePath=filePath.slice(0,filePath.length-4)+"1"+".pdf";
                fs.writeFileSync(filePath,changedBytes);
            }
            // abcdef.pdf
            else
            {
                fs.writeFileSync(filePath,changedBytes);
            }
        })
        // if(fs.existsSync(matchFileName+".pdf")==true)
        //    {
        //        fs.writeFileSync(matchFileName+"1.pdf",changedBytes)

        //    }
        //    else{
        //        fs.writeFileSync(matchFileName+".pdf",changedBytes)
        //    }
        // console.log("OK");
    })
}