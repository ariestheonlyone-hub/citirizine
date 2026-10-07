const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');
const PORT=process.env.PORT||3000;

const root = __dirname;
const server = http.createServer((req,res)=>{
  let file = decodeURIComponent(req.url.split('?')[0]);
  if(file === '/' || file === '') file='/index.html';
  const full=path.join(root,file);
  if(!full.startsWith(root) || !fs.existsSync(full) || fs.statSync(full).isDirectory()) { res.writeHead(404); return res.end('Not found'); }
  const ext=path.extname(full).toLowerCase();
  const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.txt':'text/plain; charset=utf-8'};
  res.writeHead(200, {'Content-Type':types[ext]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin'});
  fs.createReadStream(full).pipe(res);
});
const wss = new WebSocket.Server({server});
const players = new Map();
function id(){ return Math.random().toString(36).slice(2)+Date.now().toString(36); }
function broadcast(){
  const snapshot=[...players.values()].map(p=>({id:p.id,name:p.name,gender:p.gender,x:p.x,y:p.y,z:p.z,ry:p.ry}));
  for(const ws of wss.clients){ if(ws.readyState===WebSocket.OPEN) ws.send(JSON.stringify({type:'snapshot',players:snapshot})); }
}
wss.on('connection',ws=>{
  let me=null;
  ws.on('message',raw=>{
    let m; try{m=JSON.parse(raw)}catch{return;}
    if(m.type==='join'){
      me={id:id(),name:String(m.name||'Student').slice(0,20),gender:m.gender==='female'?'female':'male',x:0,y:.15,z:5.2,ry:0,ws};
      players.set(me.id,me); ws.send(JSON.stringify({type:'welcome',id:me.id})); broadcast();
    } else if(me && m.type==='move'){
      me.x=Number(m.x)||0; me.y=Number(m.y)||.15; me.z=Number(m.z)||0; me.ry=Number(m.ry)||0; broadcast();
    } else if(me && m.type==='chat'){
      const msg={type:'chat',name:me.name,message:String(m.message||'').slice(0,120)};
      for(const client of wss.clients){if(client.readyState===WebSocket.OPEN) client.send(JSON.stringify(msg));}
    }
  });
  ws.on('close',()=>{ if(me){players.delete(me.id);broadcast();} });
});
server.listen(PORT,()=>console.log(`CITIRIZINE multiplayer server running on http://localhost:${PORT}`));
