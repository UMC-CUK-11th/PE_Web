import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

const collection = JSON.parse(await readFile(new URL('../postman/week08.postman_collection.json', import.meta.url), 'utf8'));
const vars = new Map(collection.variable.map(({key, value}) => [key, value]));
vars.set('baseUrl', process.env.WEEK08_BASE_URL || vars.get('baseUrl'));
const output = new URL('../build/week08-evidence/', import.meta.url);
await mkdir(output, {recursive: true});
const resolve = (value) => value.replace(/{{([^}]+)}}/g, (_, key) => {
    assert.ok(vars.has(key), 'Missing collection variable ' + key);
    return vars.get(key);
});
const evidence = [];

for (const {name, request, event} of collection.item) {
    let response;
    let data;
    const pm = {
        collectionVariables: {set: (key, value) => vars.set(key, value)},
        response: {json: () => structuredClone(data), to: {have: {status: expected => assert.equal(response.status, expected, name)}}},
        expect: actual => ({to: {eql: expected => assert.equal(JSON.stringify(actual), JSON.stringify(expected), name)}}),
        test: (label, verify) => verify()
    };
    const run = phase => {
        for (const {script} of event.filter(e => e.listen === phase)) runInNewContext(script.exec.join('\n'), {pm}, {timeout: 1000});
    };
    run('prerequest');
    const url = resolve(request.url.raw);
    const auth = request.auth.type === 'bearer' ? request.auth.bearer[0].value : null;
    const body = request.body ? resolve(request.body.raw) : undefined;
    const headers = {};
    if (body) headers['Content-Type'] = 'application/json';
    if (auth) headers.Authorization = 'Bearer ' + resolve(auth);
    response = await fetch(url, {method: request.method, headers, body, signal: AbortSignal.timeout(10000)});
    data = await response.json();
    run('test');
    if (/\/favorites(?:\/|$)|\/movie-records$/.test(new URL(url).pathname)) {
        assert.equal(new URL(url).searchParams.has('memberId'), false);
        if (body) assert.equal(Object.hasOwn(JSON.parse(body), 'memberId'), false);
    }
    const safeRequest = body ? JSON.parse(body) : null;
    if (safeRequest && Object.hasOwn(safeRequest, 'password')) safeRequest.password = '[redacted]';
    const safeResponse = structuredClone(data);
    if (safeResponse.result?.accessToken) safeResponse.result.accessToken = '[redacted]';
    evidence.push({name, url, method:request.method, authorization:auth ? 'Bearer ' + auth : '없음', request:safeRequest,
        status:response.status, statusText:response.statusText, response:safeResponse});
    console.log(name, response.status, data.code ?? '');
}
await writeFile(new URL('http-results.json', output), JSON.stringify(evidence, null, 2));
console.log(evidence.length + ' requests passed');
