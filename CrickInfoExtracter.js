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
let fs=require("fs");

let args=minimist(process.argv)

//download using axios
//read using jsdom
//make excel file using excel4node
//make pdfs using pdf-lib

let responsepromise=axios.get(args.source);
responsepromise.then(function (response) {
    let html=response.data;
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
    }
    let teams=[];
    for(let i=0;i<matches.length;i++)
    {
        fillTeams(teams,matches[i]);
    }



    for(let i=0;i<teams.length;i++)
    {
        fillMatches(teams[i],matches);
    }

    teamsInfo=JSON.stringify(teams);
    // console.log(teamsInfo);
    fs.writeFileSync("teamsInformation.json",teamsInfo,"utf-8");
}).catch(function(err){
    console.log(err);
})

function fillMatches(team,prevjson)
{
    for(let i=0;i<prevjson.length;i++)
    {
        if(prevjson[i].t1==team.name)
        {
            team.matches.push({
                vs:prevjson[i].t2,
                selfScore:prevjson[i].t1s,
                oppScore:prevjson[i].t2s,
                result:prevjson[i].result
            })
        }
    }

    for(let i=0;i<prevjson.length;i++)
    {
        if(prevjson[i].t2==team.name)
        {
            team.matches.push({
                vs:prevjson[i].t1,
                selfScore:prevjson[i].t2s,
                oppScore:prevjson[i].t1s,
                result:prevjson[i].result
            })
        }
    }
}



function fillTeams(teams,match)
{
    let idx1=-1;
    for(let i=0;i<teams.length;i++)
    {
        if(teams[i].name==match.t1)
        {
            idx1=i;
            break;
        }
    }
    let team={
        name:"",
        matches:[]
    }
    if(idx1==-1)
    {
        team.name=match.t1;
        teams.push(team);
    }


    let idx2=-1;
    for(let i=0;i<teams.length;i++)
    {
        if(teams[i].name==match.t2)
        {
            idx2=i;
            break;
        }
    }
    team={
        name:"",
        matches:[]
    }
    if(idx2==-1)
    {
        team.name=match.t2;
        teams.push(team);
    }
}