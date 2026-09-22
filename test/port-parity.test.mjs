import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync,existsSync,readdirSync,statSync} from 'node:fs';
import {dirname,resolve,relative,sep,join} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const manifest=JSON.parse(readFileSync(join(root,'port-manifest.json'),'utf8'));
test('shared payload bytes match the pinned upstream manifest',()=>{
 assert.equal(manifest.schemaVersion,1);assert.match(manifest.upstream.sourceSha,/^[a-f0-9]{40}$/);
 assert.equal(manifest.upstream.repository,'lidge-jun/codexclaw');
 const seen=new Set();
 for(const entry of manifest.sharedFiles){assert.ok(!seen.has(entry.path));seen.add(entry.path);const p=resolve(root,entry.path);assert.ok(p.startsWith(root+sep));assert.equal(createHash('sha256').update(readFileSync(p)).digest('hex'),entry.sha256,entry.path);}
 for(const name of ['scripts/export-paged-report.mjs','scripts/research-adapter.mjs','scripts/report-locale.mjs','scripts/exhibit-contract.mjs']) assert.ok(seen.has(name),name);
});
test('standalone markdown references resolve without sibling repositories',()=>{
 const walk=d=>readdirSync(d).flatMap(n=>{const p=join(d,n);return statSync(p).isDirectory()?walk(p):[p];});
 const files=[join(root,'SKILL.md'),...walk(join(root,'reference')).filter(p=>p.endsWith('.md'))];
 for(const file of files)for(const [,url] of readFileSync(file,'utf8').matchAll(/\]\(([^)\s]+)\)/g)){
  if(/^[a-z]+:/i.test(url)||url.startsWith('#'))continue;
  const target=resolve(dirname(file),url.split('#')[0]);assert.ok(target.startsWith(root+sep),`${relative(root,file)} escapes: ${url}`);assert.ok(existsSync(target),`${relative(root,file)} missing: ${url}`);
 }
});
test('host adaptations are explicit and retained in the distribution',()=>{
 for(const entry of manifest.adaptedFiles){assert.ok(entry.reason.trim());assert.ok(existsSync(join(root,entry.path)),entry.path);}
 for(const p of manifest.preservedFiles)assert.ok(existsSync(join(root,p)),p);
 assert.ok(existsSync(join(root,'LICENSE')));
});
