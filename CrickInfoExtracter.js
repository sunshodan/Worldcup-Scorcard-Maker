//npm init -y
//npm install minimist
//npm install axios
//npm install jsdom
//npm install excel4node
//npm install pdf-lib

// node CrickInfoExtracter.js --source="https://www.espncricinfo.com/series/icc-cricket-world-cup-2019-1144415/match-results"

let minimist=require("minimist");
let axios=require("axios");
let jsdom=require("jsdom");
let excel4node=require("excel4node");
let pdf=require("pdf-lib");
let fs=require("fs");

let args=minimist(process.argv)

//download using axios
//read using jsdom
//make excel file using excel4node
//make pdfs using pdf-lib

let responsepromise=axios.get(args.source);
responsepromise.then(function (response) {
    let html=response.data;
    // console.log(html);
    let dom=new jsdom.JSDOM(html);
    let document=dom.window.document;
    let matchScoreDivs=document.querySelectorAll("div.match-score-block");
    let matches=[];
    for(let i=0;i<matchScoreDivs.length;i++)
    {

        let match={

        };


        let namePs=matchScoreDivs[i].querySelectorAll("p.name");

        match.t1=namePs[0].textContent;
        match.t2=namePs[1].textContent;
        let scores=matchScoreDivs[i].querySelectorAll("span.score");

        match.t1s="";
        match.t2s="";
        if(scores.length==2)
        {
            match.t1s=scores[0].textContent;
            match.t2s=scores[1].textContent;
        }
        else if(scores.length==1)
        {
            match.t1s=scores[0].textContent;
        }

        let spanresult=matchScoreDivs[i].querySelector("div.status-text>span");
        match.result=spanresult.textContent;
        matches.push(match);
        // console.log(t1s);
        // console.log(t2s);
    }
    console.log(matches);
}).catch(function(err){
    console(err);
})