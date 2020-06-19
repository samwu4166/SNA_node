const MaxDistance = 1000; // define maxDistance for calculate shortest path algorithm
const DEBUG = false;
if (DEBUG==true){
    // test graph for testing function: innter degree, outter degree, checkness
    var test_edges = [
        {'from':0,'to':1}, //AB
        {'from':0,'to':2}, //AC
        {'from':1,'to':2}, //BC
        {'from':2,'to':3}, //CD
        {'from':3,'to':4}, //DE
        {'from':5,'to':4}, //FE
        {'from':6,'to':4} //GE
    ]
    var direct_test_graph = new Array(7); // direct_graph
    var fully_connect_test_graph = new Array(7); // fully_connect_graph
    for (var i = 0; i < fully_connect_test_graph.length; i++) { 
        fully_connect_test_graph[i] = new Array(7);
        direct_test_graph[i] = new Array(7);
    }
    for (var i = 0; i < fully_connect_test_graph.length; i++) { 
        for (var j = 0; j < fully_connect_test_graph.length; j++) { 
            fully_connect_test_graph[i][j] = MaxDistance;
            direct_test_graph[i][j] = MaxDistance;
            if (i==j){
                fully_connect_test_graph[i][j] = 0;
                direct_test_graph[i][j] = 0;
            } 
        } 
    }
    test_edges.forEach(edge=>{
        /*
        add edges into array from test data
        */
        fully_connect_test_graph[edge['from']][edge['to']]=1;
        fully_connect_test_graph[edge['to']][edge['from']]=1;
        direct_test_graph[edge['from']][edge['to']]=1;
    })
    console.log('Start conpute : \n');
    //test function
    console.log(degree(direct_test_graph));
    const all_pairs_distance = floyd_warshall(fully_connect_test_graph,7,MaxDistance); // result_distance means all-pairs shortest path
    console.log(checkCloseness(all_pairs_distance));

}
//OK
function floyd_warshall(graph,vertex_num,MaxDistance){
    /*
    Calculate for all-pairs shortest path
    */
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
//OK
function resize(arr,defaultValue = 0){
    /*
    Custom function for resize array
    */
    for(var i=0;i<arr.length;i++){
        arr[i] = defaultValue;
    }
    return arr;
}
//OK
function degree(direct_graph){
    /*
    Calculate for inner degree, outter degree
    graph must be direct_graph
    Data:
        A->B
        A->C
        B->C
    Array:
          A B C
        A 0 1 1
        B 0 0 1
        C 0 0 0
    */
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
function checkCloseness(all_pairs_distance){
    /*
    Calculate for checkness
    Map must be all-pairs shortest graph
    */
    var result = {};
    for(var i=0;i<all_pairs_distance.length;i++){
        let sum_of_link = 0;
        for(var j=0;j<all_pairs_distance.length;j++){
            sum_of_link+=all_pairs_distance[i][j];
        }
        result[i] = Number((1/sum_of_link).toFixed(3)) ;
    }
    return result;
}

if (DEBUG == false){
    const XLSX = require('xlsx'); // import xlsx package
    const workbook = XLSX.readFile('data.csv'); // read file
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
    const name_set = new Set();// prepare unique client list for graph
    data.forEach(element => {
        name_set.add(element['下游業者名稱'])
        name_set.add(element['上游業者名稱'])
    });
    const unique_array = [...name_set];
    const datalen = unique_array.length
    
    var direct_graph = new Array(datalen); 
    var fully_connect_graph = new Array(datalen); 
    // Loop to create 2D array using 1D array 
    for (var i = 0; i < direct_graph.length; i++) { 
        direct_graph[i] = new Array(datalen);
        fully_connect_graph[i] = new Array(datalen); 
    }
    // initialize
    for (var i = 0; i < datalen; i++) { 
        for (var j = 0; j < datalen; j++) { 
            direct_graph[i][j] = MaxDistance;
            fully_connect_graph[i][j] = MaxDistance;
            if (i==j){
                direct_graph[i][j] = 0;
                fully_connect_graph[i][j] = 0;
            } 
        } 
    } 
    //add edges into graph array
    data.forEach(edge=>{
        direct_graph[unique_array.indexOf(edge['上游業者名稱'])][unique_array.indexOf(edge['下游業者名稱'])]=1
        fully_connect_graph[unique_array.indexOf(edge['上游業者名稱'])][unique_array.indexOf(edge['下游業者名稱'])]=1
        fully_connect_graph[unique_array.indexOf(edge['下游業者名稱'])][unique_array.indexOf(edge['上游業者名稱'])]=1
    })
    console.log(degree(direct_graph));
    console.log(checkCloseness(floyd_warshall(fully_connect_graph,datalen,MaxDistance)));
}
