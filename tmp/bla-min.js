var n = Math.sqrt, p = Math.pow, q = Math.min, r = Math.max, s = Math.PI, t = 0;
function u(a, b) {
  var c = {}, d;
  for(d in a) {
    c[d] = a[d]
  }
  for(d in b) {
    c[d] = b[d]
  }
  return c
}
function x(a) {
  var b = a.i || function() {
  };
  b.prototype = u(a.k ? a.k.prototype : {}, a);
  return b
}
var y = x({i:function(a) {
  this.A = {};
  this.V = a;
  this.L = false
}, fa:function(a, b) {
  this.L = true;
  (this.A[a] = this.A[a] || []).push(b);
  return this
}, D:function(a) {
  if(this.L) {
    var b = this.A[a];
    if(b) {
      var c = b.length;
      if(c) {
        for(var d = this.V, e = 0;e < c;e++) {
          b[e].apply(d, arguments)
        }
        return this
      }
    }
  }
}}), z = x({type:2, remove:function() {
  this.O = true
}}), D = x({z:function(a) {
  a = u({K:1, g:1, x:0, y:0, a:0, q:1}, a);
  this.id = t++;
  this.r = new y(this);
  this.g = a.g;
  this.K = a.K;
  this.q = a.q;
  this.b = a.b || this.J();
  this.w = this.v = this.u = 0;
  this.x = a.x;
  this.y = a.y;
  this.a = a.a;
  this.c = this.x;
  this.d = this.y;
  this.e = this.a
}, f:function(a) {
  this.Q.f(this, a);
  a.r.D("contact", this);
  this.r.D("contact", a)
}, remove:function() {
  this.O = true
}, J:function() {
  return this.q
}, C:function(a, b, c) {
  this.c = this.x - a;
  this.d = this.y - b;
  this.e = this.a - c
}, ea:function() {
  var a = this.Q.P;
  return[this.c + (this.x - this.c) * a, this.d + (this.y - this.d) * a, this.e + (this.a - this.e) * a]
}, p:function(a, b, c) {
  switch(a.type) {
    case 0:
      this.H(a, b, c);
      break;
    case 1:
      this.m(a, b, c);
      break;
    case 3:
      this.I(a, b, c)
  }
}, H:function() {
}, I:function() {
}, m:function() {
}, B:function() {
  if(this.n) {
    var a = this.x * 2 - this.c, b = this.y * 2 - this.d, c = this.a * 2 - this.e;
    this.c = this.x;
    this.d = this.y;
    this.e = this.a;
    this.x = a;
    this.y = b;
    this.a = c
  }
}, t:function(a) {
  if(this.n) {
    this.x += this.u * a * a, this.y += this.v * a * a, this.a += this.w * a * a, this.w = this.v = this.u = 0
  }
}, j:function(a, b, c) {
  this.n && (this.u += a, this.v += b, this.w += c)
}});
vphy = {types:{F:0, ca:1, $:2, Y:3}, S:x({i:function() {
  this.P = 0;
  this.l = [];
  this.s = [];
  this.M = [this.l, this.s];
  this.r = new y(this)
}, add:function() {
  for(var a = 0;a < arguments.length;a++) {
    var b = arguments[a];
    b.Q = this;
    b.type == 2 ? this.s.push(b) : this.l.push(b)
  }
  return this
}, f:function(a, b) {
  this.r.D("contact", a, b)
}, B:function() {
  for(var a = this.l, b = a.length, c = 0;c < b;c++) {
    a[c].B()
  }
}, t:function(a) {
  for(var b = this.l, c = b.length, d = 0;d < c;d++) {
    b[d].t(a)
  }
}, p:function(a, b) {
  for(var c = this.l, d = c.length, e = 0;e < d - 1;e++) {
    for(var g = c[e], f = e + 1;f < d;f++) {
      g.p(c[f], a, b)
    }
  }
}, da:function() {
  var a = [];
  this.M.push(a);
  return a
}, T:function(a) {
  for(var b = 0;b < a.length;b++) {
    a[b].O && (a.splice(b, 1), b--)
  }
}, G:function() {
  for(var a = this.M, b = a.length, c = 0;c < b;c++) {
    this.T(a[c])
  }
}, W:function(a) {
  this.o += a;
  this.j();
  this.t(a);
  this.p(a, false);
  this.G();
  this.B();
  this.p(a, true);
  this.G()
}, step:function(a, b) {
  if(b - this.o > 0.25) {
    this.o = b - 0.25
  }
  for(;this.o < b;) {
    this.W(a)
  }
  var c = this.o - b;
  this.P = c > 0 ? (a - c) / a : 1
}, start:function(a) {
  this.o = a
}, j:function() {
  for(var a = this.l, b = this.s, c = b.length, d = 0;d < c;d++) {
    b[d].N(a)
  }
}}), aa:x({k:z, i:function(a) {
  this.direction = a
}, N:function(a) {
  for(var b = a.length, c = 0;c < b;c++) {
    this.j(a[c])
  }
}, j:function(a) {
  a.j(this.direction.x, this.direction.y, this.direction.a)
}}), ba:x({k:z, i:function(a, b) {
  this.U = a;
  this.X = b
}, N:function() {
  for(var a = this.U, b = a.length, c = this.X, d = 0;d < b - 1;d++) {
    for(var e = a[d], g = d + 1;g < b;g++) {
      var f = a[g], h = e.x - f.x, j = e.y - f.y, i = e.a - f.a, k = Math.sqrt(h * h + j * j + i * i);
      h /= k;
      j /= k;
      i /= k;
      var m = f.b * c / (k * k), k = e.b * c / (k * k);
      e.j(-h * m, -j * m, -i * m);
      f.j(h * k, j * k, i * k)
    }
  }
}}), F:x({type:0, n:false, k:D, i:function(a) {
  a = u({size:{width:1, height:1, depth:1}}, a);
  this.size = a.size;
  this.z(a)
}, m:function(a, b, c) {
  var b = a.h, d = this.x - this.size.width / 2, e = this.x + this.size.width / 2, g = this.y + this.size.height / 2, f = this.y - this.size.height / 2, h = this.a + this.size.depth / 2, j = this.a - this.size.depth / 2, i = this.g * a.g, k = i * (a.c - a.x), m = i * (a.d - a.y);
  i *= a.e - a.a;
  if(a.x + b > e) {
    d = a.x + b - e;
    a.x -= d;
    if(c) {
      a.c = a.x - k
    }
    this.f(a)
  }else {
    if(a.x - b < d) {
      d -= a.x - b;
      a.x += d;
      if(c) {
        a.c = a.x - k
      }
      this.f(a)
    }
  }
  if(a.y + b > g) {
    d = a.y + b - g;
    a.y -= d;
    if(c) {
      a.d = a.y - m
    }
    this.f(a)
  }else {
    if(a.y - b < f) {
      d = f - (a.y - b);
      a.y += d;
      if(c) {
        a.d = a.y - m
      }
      this.f(a)
    }
  }
  if(a.a - b < j) {
    d = j - (a.a - b);
    a.a += d;
    if(c) {
      a.e = a.a - i
    }
    this.f(a)
  }else {
    if(a.a + b > h) {
      d = a.a + b - h;
      a.a -= d;
      if(c) {
        a.e = a.a - i
      }
      this.f(a)
    }
  }
}}), Z:x({type:3, n:false, k:D, i:function(a) {
  a = u({size:{width:1, height:1, depth:1}}, a);
  this.size = a.size;
  this.z(a)
}, m:function(a, b, c) {
  var b = a.h, d = this.y + this.size.height / 2, e = this.y - this.size.height / 2, g = this.a + this.size.depth / 2, f = this.a - this.size.depth / 2, h = r(this.x - this.size.width / 2, q(this.x + this.size.width / 2, a.x)), d = r(e, q(d, a.y)), f = r(f, q(g, a.a)), h = a.x - h, g = a.y - d, f = a.a - f, j = n(h * h + g * g + f * f), d = h / j, e = g / j, i = f / j;
  j < b && (h = a.x - a.c, g = a.y - a.d, f = a.a - a.e, b -= j, a.x += d * b, a.y += e * b, a.a += i * b, c && (c = this.g * a.g, b = d * h + e * g + i * f, d *= b, e *= b, b *= i, h -= c * d + d, g -= c * e + e, f -= c * b + b, a.C(h, g, f)), this.f(a))
}}), R:x({type:1, n:true, k:D, i:function(a) {
  a = u({h:1}, a);
  this.h = a.h;
  this.z(a)
}, J:function() {
  return 4 / 3 * s * p(this.h, 3) * this.q
}, H:function(a, b, c) {
  a.m(this, b, c)
}, I:function(a, b, c) {
  a.m(this, b, c)
}, m:function(a, b, c) {
  var d = this.x - a.x, e = this.y - a.y, b = this.a - a.a, g = n(d * d + e * e + b * b), f = d / g, h = e / g, j = b / g, i = this.h + a.h;
  if(g < i) {
    var b = this.x - this.c, e = this.y - this.d, d = this.a - this.e, k = a.x - a.c, m = a.y - a.d, v = a.a - a.e, l = this.b + a.b, o = (i - g) * (a.b / l), l = (i - g) * (this.b / l);
    this.x += f * o;
    this.y += h * o;
    this.a += j * o;
    a.x -= f * l;
    a.y -= h * l;
    a.a -= j * l;
    if(c) {
      c = this.g * a.g;
      i = f * b + h * e + j * d;
      l = f * k + h * m + j * v;
      g = i * f;
      o = i * h;
      i *= j;
      f *= l;
      h *= l;
      j *= l;
      var A = g - f, B = o - h, C = i - j, l = this.b + a.b, w = (this.b - a.b) / l, l = 2 * this.b / l;
      b += c * (f + A * w - g);
      e += c * (h + B * w - o);
      d += c * (j + C * w - i);
      k += c * A * l;
      m += c * B * l;
      v += c * C * l;
      this.C(b, e, d);
      a.C(k, m, v)
    }
    this.f(a)
  }
}})};
var E = new vphy.S;
E.start(Date.now() / 1E3);
E.add(new vphy.F({size:{width:300, height:300, depth:300}, g:1}));
for(var F = [], G = 0;G < 100;G++) {
  var H = new vphy.R({g:1, h:2, x:50 * (Math.random() * 2 - 1), y:50 * (Math.random() * 2 - 1), a:50 * (Math.random() * 2 - 1)});
  F.push(H);
  E.add(H)
}
for(var I = Date.now() / 1E3, J = Date.now() / 1E3, G = 0;G < 1200;G++, J += 1 / 60) {
  E.step(1 / 60, J)
}
var K = Date.now() / 1E3 - I;
console.log(1200, "steps in", K, "second. so", 1200 / K, "iteration per seconds");