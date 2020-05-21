const XLSX = require('xlsx');
const workbook = XLSX.readFile('data.csv');
var Graph = require("graph-data-structure");

const sheetNames = workbook.SheetNames;
const worksheet = workbook.Sheets[sheetNames[0]];
const headers = {};
const data = [];
const keys = Object.keys(worksheet);
keys
// 過濾以 ! 開頭的 key
.filter(k => k[0] !== '!')
// 遍歷所有單元格
.forEach(k => {
// 如 A11 中的 A
let col = k.substring(0, 1);
// 如 A11 中的 11
let row = parseInt(k.substring(1));
// 當前單元格的值
let value = worksheet[k].v;
// 儲存欄位名
if (row === 1) {
headers[col] = value;
return;
}
// 解析成 JSON
if (!data[row]) {
data[row] = {};
}
data[row][headers[col]] = value;
});
//console.log(data);
const name_set = new Set();
data.forEach(element => {
    name_set.add(element['下游業者名稱'])
    name_set.add(element['上游業者名稱'])
});
const unique_array = [...name_set];
const datalen = unique_array.length

var graph = new Array(datalen); 
  
// Loop to create 2D array using 1D array 
for (var i = 0; i < graph.length; i++) { 
    graph[i] = new Array(datalen); 
}
for (var i = 0; i < datalen; i++) { 
    for (var j = 0; j < datalen; j++) { 
        graph[i][j] = 0; 
    } 
} 

let g = new Graph();
data.forEach(edge=>{
    graph[unique_array.indexOf(edge['上游業者名稱'])][unique_array.indexOf(edge['下游業者名稱'])]=1
    g.addEdge(edge['上游業者名稱'], edge['下游業者名稱'],1);
})

//console.log(degree('阿瑪德國際有限公司',graph,unique_array));
console.log(g.nodes());
console.log(g.outdegree('阿瑪德國際有限公司'));
//unique_array.forEach(element=>console.log(g.shortestPath('阿瑪德國際有限公司',element)));

function degree(node,graph,data_array){
    const indexOfNode = data_array.indexOf(node);
    var outter = 0;
    var inner = 0;
    for(var i=0; i <graph[indexOfNode].length;i++){
        outter = outter + graph[indexOfNode][i];
    }
    graph.forEach(element=>inner = inner+element[indexOfNode]);
    const result = {
        'inner' : inner/(graph.length-1),
        'outter' : outter/(graph.length-1)
    }
    return result;
}

