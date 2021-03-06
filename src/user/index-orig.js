var vvalues = function () {
        if (typeof require === 'function') {
            // importing patches Proxy to be in line with the new direct proxies
            require('harmony-reflect');
        }
        // hold on to all the proxies we create so that we can retrieve the handlers later
        var unproxyMap = new WeakMap();
        var oldProxy = Proxy;
        // primitive values cannot be used a keys inside of a map so we
        // need to wrap them up in a shell object that returns the original
        // value when needed
        function ValueShell(value) {
            this.value = value;
        }
        ValueShell.prototype.valueOf = function () {
            return this.value;
        };
        // @ (Any, {}, {}) -> VProxy
        function VProxy(value, handler, key) {
            var valueShell = new ValueShell(value);
            var val = function (a0) {
                    if (a0 === void 0) {
                        return valueShell;
                    }
                    if (a0 === null) {
                        return valueShell;
                    }
                    if (typeof a0 !== 'object') {
                        var x = a0;
                        return valueShell;
                    }
                    return value;
                }.call(this, value);
            var p = new oldProxy(val, handler);
            unproxyMap.set(p, {
                handler: handler,
                key: key,
                target: val
            });
            return p;
        }
        this.Proxy = VProxy;
        // @ (Any) -> Bool
        function isVProxy(value) {
            return value && typeof value === 'object' && unproxyMap.has(value);
        }
        // @ (Str, Any) -> Any
        function unary(a0, a1) {
            if (isVProxy(a1)) {
                var operator = a0;
                var op = a1;
                var target = unproxyMap.get(op).target;
                return unproxyMap.get(op).handler.unary(target, operator, op);
            }
            if (a0 === '-') {
                var op = a1;
                return -op;
            }
            if (a0 === '+') {
                var op = a1;
                return +op;
            }
            if (a0 === '++') {
                var op = a1;
                return ++op;
            }
            if (a0 === '--') {
                var op = a1;
                return --op;
            }
            if (a0 === '!') {
                var op = a1;
                return !op;
            }
            if (a0 === '~') {
                var op = a1;
                return ~op;
            }
            if (a0 === 'typeof') {
                var op = a1;
                return typeof op;
            }
            if (a0 === 'void') {
                var op = a1;
                return void op;
            }
            throw new TypeError('No match');
        }
        // @ (Str, Any, Any) -> Any
        function binary(a0, a1, a2) {
            if (isVProxy(a1)) {
                var operator = a0;
                var left = a1;
                var right = a2;
                var target = unproxyMap.get(left).target;
                return unproxyMap.get(left).handler.left(target, operator, right);
            }
            if (isVProxy(a2)) {
                var operator = a0;
                var left = a1;
                var right = a2;
                var target = unproxyMap.get(right).target;
                return unproxyMap.get(right).handler.right(target, operator, left);
            }
            if (a0 === '*') {
                var left = a1;
                var right = a2;
                return left * right;
            }
            if (a0 === '/') {
                var left = a1;
                var right = a2;
                return left / right;
            }
            if (a0 === '%') {
                var left = a1;
                var right = a2;
                return left % right;
            }
            if (a0 === '+') {
                var left = a1;
                var right = a2;
                return left + right;
            }
            if (a0 === '-') {
                var left = a1;
                var right = a2;
                return left - right;
            }
            if (a0 === '>>') {
                var left = a1;
                var right = a2;
                return left >> right;
            }
            if (a0 === '<<') {
                var left = a1;
                var right = a2;
                return left << right;
            }
            if (a0 === '>>>') {
                var left = a1;
                var right = a2;
                return left >>> right;
            }
            if (a0 === '<') {
                var left = a1;
                var right = a2;
                return left < right;
            }
            if (a0 === '<=') {
                var left = a1;
                var right = a2;
                return left <= right;
            }
            if (a0 === '>') {
                var left = a1;
                var right = a2;
                return left > right;
            }
            if (a0 === '>=') {
                var left = a1;
                var right = a2;
                return left >= right;
            }
            if (a0 === 'in') {
                var left = a1;
                var right = a2;
                return left in right;
            }
            if (a0 === 'instanceof') {
                var left = a1;
                var right = a2;
                return left instanceof right;
            }
            if (a0 === '==') {
                var left = a1;
                var right = a2;
                return left == right;
            }
            if (a0 === '!=') {
                var left = a1;
                var right = a2;
                return left != right;
            }
            if (a0 === '===') {
                var left = a1;
                var right = a2;
                return left === right;
            }
            if (a0 === '!==') {
                var left = a1;
                var right = a2;
                return left !== right;
            }
            if (a0 === '&') {
                var left = a1;
                var right = a2;
                return left & right;
            }
            if (a0 === '^') {
                var left = a1;
                var right = a2;
                return left ^ right;
            }
            if (a0 === '|') {
                var left = a1;
                var right = a2;
                return left | right;
            }
            if (a0 === '&&') {
                var left = a1;
                var right = a2;
                return left && right;
            }
            if (a0 === '||') {
                var left = a1;
                var right = a2;
                return left || right;
            }
            throw new TypeError('No match');
        }
        // @ (Any) -> {} or null
        this.unproxy = function (value, key) {
            if (isVProxy(value) && unproxyMap.get(value).key === key) {
                return unproxyMap.get(value).handler;
            }
            return null;
        };
        return {
            unary: unary,
            binary: binary
        };
    }();
'use strict';
var mysql$1381 = require('mysql');
function search$1382(req$1384, res$1385) {
    query$1383(req$1384.query.lastname, function (err$1386, rows$1387) {
        console.log('err: %s,  rows:%s : ', JSON.stringify(err$1386), JSON.stringify(rows$1387));
        if (err$1386) {
            return res$1385.send(JSON.stringify(err$1386));
        }
        res$1385.send(JSON.stringify(rows$1387));
    });
}
function query$1383(lastname$1388, callback$1389) {
    var connection$1390 = mysql$1381.createConnection({
        host: 'localhost',
        user: 'webappuser',
        password: 'WSXwer43@',
        database: 'test',
        multipleStatements: true
    });
    var searchSQL$1393 = vvalues.binary('+', vvalues.binary('+', 'select * from student where lastname = \'', lastname$1388), '\';');
    connection$1390.connect();
    connection$1390.query(searchSQL$1393, function (err$1394, rows$1395, fields$1396) {
        if (err$1394) {
            return callback$1389(err$1394, null);
        }
        callback$1389(null, rows$1395);
    });
    connection$1390.end();
}
module.exports = search$1382;