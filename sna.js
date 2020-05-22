const MaxDistance = 1000;
const DEBUG = true;
if (DEBUG==true){
    // test graph from ppt
    var test_edges = [
        {'from':0,'to':1}, //AB
        {'from':0,'to':2}, //AC
        {'from':1,'to':2}, //BC
        {'from':2,'to':3}, //CD
        {'from':3,'to':4}, //DE
        {'from':5,'to':4}, //FE
        {'from':6,'to':4} //GE
    ]
    var direct_test_graph = new Array(7);
    var test_graph = new Array(7);
    for (var i = 0; i < test_graph.length; i++) { 
        test_graph[i] = new Array(7);
        direct_test_graph[i] = new Array(7);
    }
    for (var i = 0; i < test_graph.length; i++) { 
        for (var j = 0; j < test_graph.length; j++) { 
            test_graph[i][j] = MaxDistance;
            direct_test_graph[i][j] = MaxDistance;
            if (i==j){
                test_graph[i][j] = 0;
                direct_test_graph[i][j] = 0;
            } 
        } 
    }
    test_edges.forEach(edge=>{
        test_graph[edge['from']][edge['to']]=1;
        test_graph[edge['to']][edge['from']]=1;
        direct_test_graph[edge['from']][edge['to']]=1;
    })
    console.log('Start conpute : \n');
    //test
    console.log(degree(direct_test_graph));
    const result_distance = floyd_warshall(test_graph,7,MaxDistance);
    console.log(checkCloseness(result_distance));

}
//OK
function floyd_warshall(graph,vertex_num,MaxDistance){
    var Distance = new Array(vertex_num); 
    var Predecessor = new Array(vertex_num); 
    // initialize distance and predecessor 
    for (var i = 0; i < vertex_num; i++) { 
        Distance[i] = new Array(vertex_num);
        Predecessor[i] = new Array(vertex_num); 
    }

    for (var i = 0; i < vertex_num; i++) {
        Distance[i] = resize(Distance[i]);
        Predecessor[i] = resize(Predecessor[i], -1);
        for (var j = 0; j < vertex_num; j++) {
            Distance[i][j] = graph[i][j];
            if (Distance[i][j] != 0 && Distance[i][j] != MaxDistance) {
                Predecessor[i][j] = i;
            }
        }
    }
    // start Floyd_warshall_algo
    for (var k = 0; k < vertex_num; k++) {
        for (var i = 0; i < vertex_num; i++) {
            for (var j = 0; j < vertex_num; j++) {
                if ((Distance[i][j] > Distance[i][k]+Distance[k][j]) 
                     && (Distance[i][k] != MaxDistance)) {
                    Distance[i][j] = Distance[i][k]+Distance[k][j];
                    Predecessor[i][j] = Predecessor[k][j];
                }
            }
        }
    }
    return Distance;
}
// print shortest path
// function path(i, j)
//     if i = j then
//         write(i)
//     else if next[i, j] = NIL then
//         write("no path exists")
//     else
//         path(i, next[i, j])
//         write(j)
//OK
function resize(arr,defaultValue = 0){
    for(var i=0;i<arr.length;i++){
        arr[i] = defaultValue;
    }
    return arr;
}
//OK
function degree(direct_graph){
    var result = {};
    for(var i=0; i <direct_graph.length;i++){result[i]={};}
    for(var i=0; i <direct_graph.length;i++){
        var outter = 0;
        for(var j=0;j <direct_graph[i].length;j++){
            if(direct_graph[i][j]!==1000){
                outter = outter + direct_graph[i][j];;
            }
        }
        result[i]['outter'] = Number((outter/(direct_graph.length-1)).toFixed(2)) ;
    }
    for(var i=0; i <direct_graph.length;i++){
        var inner = 0;
        direct_graph.forEach(element=>{
            if (element[i]!==1000){
                inner = inner+element[i];
            }
        });
        result[i]['innter'] = Number((inner/(direct_graph.length-1)).toFixed(2)) ;
    }

    return result;
}
//OK
function checkCloseness(distanceMap){
    var result = {};
    for(var i=0;i<distanceMap.length;i++){
        let sum_of_link = 0;
        for(var j=0;j<distanceMap.length;j++){
            sum_of_link+=distanceMap[i][j];
        }
        result[i] = Number((1/sum_of_link).toFixed(3)) ;
    }
    return result;
}

if (DEBUG == false){
    const XLSX = require('xlsx');
    const workbook = XLSX.readFile('data.csv');
    const MaxDistance = 1000;
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
    var fgraph = new Array(datalen); 
    // Loop to create 2D array using 1D array 
    for (var i = 0; i < graph.length; i++) { 
        graph[i] = new Array(datalen);
        fgraph[i] = new Array(datalen); 
    }
    // initialize
    for (var i = 0; i < datalen; i++) { 
        for (var j = 0; j < datalen; j++) { 
            graph[i][j] = MaxDistance;
            fgraph[i][j] = MaxDistance;
            if (i==j){
                graph[i][j] = 0;
                fgraph[i][j] = 0;
            } 
        } 
    } 
    
    data.forEach(edge=>{
        graph[unique_array.indexOf(edge['上游業者名稱'])][unique_array.indexOf(edge['下游業者名稱'])]=1
        fgraph[unique_array.indexOf(edge['上游業者名稱'])][unique_array.indexOf(edge['下游業者名稱'])]=1
        fgraph[unique_array.indexOf(edge['下游業者名稱'])][unique_array.indexOf(edge['上游業者名稱'])]=1
    })
}