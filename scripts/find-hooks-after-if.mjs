import fs from 'fs';
import path from 'path';
const root = path.resolve('client/src');
const exts = ['.tsx','.ts','.jsx','.js'];
function walk(dir, files=[]) { const items = fs.readdirSync(dir,{withFileTypes:true}); for(const it of items){ const res=path.join(dir,it.name); if(it.isDirectory()) walk(res,files); else if(exts.includes(path.extname(it.name))) files.push(res);} return files; }
function find(file) {
  const lines = fs.readFileSync(file,'utf8').split(/\r?\n/);
  const res = [];
  for(let i=0;i<lines.length;i++){
    if(/^\s*if\s*\(|^\s*else\s+if\s*\(/.test(lines[i])){
      for(let j=i+1;j<=i+4 && j<lines.length;j++){
        if(/use(State|Effect|Ref|Memo|Callback)\s*\(/.test(lines[j]) || /const\s+\[.*\]\s*=\s*useState\s*\(/.test(lines[j])){
          res.push({ifLine: i+1, hookLine: j+1, hookCode: lines[j].trim()});
        }
      }
    }
  }
  return res;
}
const files = walk(root);
const out={};
for(const f of files){ const found = find(f); if(found.length) out[f]=found; }
console.log(JSON.stringify(out,null,2));

