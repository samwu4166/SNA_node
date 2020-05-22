var nj = require('networkjs');
const Graph = nj.datastructures.Graph;
const { betweenness_centrality,
    degree_centrality,
    eigenvector_centrality } = nj.algorithms.centrality
var test_edges = [
    {'from':0,'to':1}, //AB
    {'from':0,'to':2}, //AC
    {'from':1,'to':2}, //BC
    {'from':2,'to':3}, //CD
    {'from':3,'to':4}, //DE
    {'from':5,'to':4}, //FE
    {'from':6,'to':4} //GE
]

// let G = new Graph();
// test_edges.forEach(element=>G.add_edge(element['from'],element['to']));
// console.log(degree_centrality(G));
// console.log(betweenness_centrality(G));
// console.log(eigenvector_centrality(G));

const XLSX = require('xlsx');
const workbook = XLSX.readFile('data.csv');
const MaxDistance = 1000;
const sheetNames = workbook.SheetNames;
const worksheet = workbook.Sheets[sheetNames[0]];
const headers = {};
const data = [];
const keys = Object.keys(worksheet);
console.log('Start preprocessing data : \n');
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
let G2 = new Graph();
data.forEach(edge=>{
    G2.add_edge(unique_array.indexOf(edge['上游業者名稱']),unique_array.indexOf(edge['下游業者名稱']));
})
console.log('Start conpute : \n');
console.log(eigenvector_centrality(G2))