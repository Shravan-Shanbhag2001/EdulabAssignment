import http from 'http';

const server = http.createServer((req,res) => {
/*     res.setHeader("Content-Type","text/html");
    res.statusCode(200); */
    res.writeHead(500,{'Content-Type':'application/json'});
/*     res.write('<h1/>Shravan Shanbhag created this!!'); */
    res.end(JSON.stringify({message:'Server Error'}));
})

server.listen(8000,()=>{
    console.log("Server running of port 8000");
})