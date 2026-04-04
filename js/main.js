/* ============================================================
   Jacob Digital — main.js
   ============================================================ */

(function () {
  'use strict';

  /* --- Hamburger Menu --------------------------------------- */
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.nav--mobile');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      const isOpen = hamburger.classList.toggle('is-open');
      mobileNav.classList.toggle('is-open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('is-open');
        mobileNav.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* --- Contact Form ---------------------------------------- */
  const form = document.querySelector('.form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const name    = form.querySelector('[name="name"]').value.trim();
      const email   = form.querySelector('[name="email"]').value.trim();
      const message = form.querySelector('[name="message"]').value.trim();
      if (!name || !email || !message) return;
      const subject = encodeURIComponent('Kontaktanfrage von ' + name);
      const body    = encodeURIComponent('Name: ' + name + '\nE-Mail: ' + email + '\n\n' + message);
      window.location.href = 'mailto:peter@jacobdigital.de?subject=' + subject + '&body=' + body;
    });
  }

  /* --- Hero WebGL Shader Background ------------------------- */
  initHeroShader();

  function initHeroShader() {
    const canvas = document.getElementById('hero-shader');
    if (!canvas) return;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return; // silently degrade — CSS fallback still applies

    /* ---- Vertex Shader ------------------------------------ */
    const vsSource = `
      attribute vec4 aVertexPosition;
      void main() {
        gl_Position = aVertexPosition;
      }
    `;

    /* ---- Fragment Shader — Jacob Digital brand colours ----
       Original: purple lines on dark bg
       Adapted:  Electric Blue (#1586FC) lines on near-white bg
    --------------------------------------------------------- */
    const fsSource = `
      precision highp float;
      uniform vec2  iResolution;
      uniform float iTime;

      /* --- Tunables --------------------------------------- */
      const float overallSpeed      = 0.18;
      const float gridSmoothWidth   = 0.015;
      const float axisWidth         = 0.05;
      const float majorLineWidth    = 0.025;
      const float minorLineWidth    = 0.0125;
      const float majorLineFrequency= 5.0;
      const float minorLineFrequency= 1.0;
      const float scale             = 5.0;

      /* Electric Blue #1586FC = rgb(21,134,252) / 255 */
      const vec4  lineColor         = vec4(0.082, 0.525, 0.988, 1.0);

      const float minLineWidth      = 0.008;
      const float maxLineWidth      = 0.14;
      const float lineSpeed         = 1.0  * overallSpeed;
      const float lineAmplitude     = 0.65;
      const float lineFrequency     = 0.2;
      const float warpSpeed         = 0.2  * overallSpeed;
      const float warpFrequency     = 0.5;
      const float warpAmplitude     = 0.85;
      const float offsetFrequency   = 0.5;
      const float offsetSpeed       = 1.33 * overallSpeed;
      const float minOffsetSpread   = 0.6;
      const float maxOffsetSpread   = 1.8;
      const int   linesPerGroup     = 12;

      #define drawCircle(pos, radius, coord) \
        smoothstep(radius + gridSmoothWidth, radius, length(coord - (pos)))
      #define drawSmoothLine(pos, halfWidth, t) \
        smoothstep(halfWidth, 0.0, abs(pos - (t)))
      #define drawCrispLine(pos, halfWidth, t) \
        smoothstep(halfWidth + gridSmoothWidth, halfWidth, abs(pos - (t)))
      #define drawPeriodicLine(freq, width, t) \
        drawCrispLine(freq / 2.0, width, abs(mod(t, freq) - (freq) / 2.0))

      float random(float t) {
        return (cos(t) + cos(t * 1.3 + 1.3) + cos(t * 1.4 + 1.4)) / 3.0;
      }

      float getPlasmaY(float x, float hFade, float offset) {
        return random(x * lineFrequency + iTime * lineSpeed) * hFade * lineAmplitude + offset;
      }

      void main() {
        vec2 fragCoord = gl_FragCoord.xy;
        vec2 uv    = fragCoord / iResolution.xy;
        vec2 space = (fragCoord - iResolution.xy * 0.5) / iResolution.x * 2.0 * scale;

        float hFade = 1.0 - (cos(uv.x * 6.28318) * 0.5 + 0.5);
        float vFade = 1.0 - (cos(uv.y * 6.28318) * 0.5 + 0.5);

        /* Warp */
        space.y += random(space.x * warpFrequency + iTime * warpSpeed)        * warpAmplitude * (0.5 + hFade);
        space.x += random(space.y * warpFrequency + iTime * warpSpeed + 2.0)  * warpAmplitude * hFade;

        /* Near-white background with very subtle blue tint */
        /* Left: rgb(248,250,255) · Right: rgb(242,246,255)          */
        vec4 bgColor1 = vec4(0.973, 0.980, 1.000, 1.0);
        vec4 bgColor2 = vec4(0.950, 0.965, 1.000, 1.0);

        vec4 lines = vec4(0.0);

        for (int l = 0; l < linesPerGroup; l++) {
          float nli            = float(l) / float(linesPerGroup);
          float offsetTime     = iTime * offsetSpeed;
          float offsetPosition = float(l) + space.x * offsetFrequency;
          float rand           = random(offsetPosition + offsetTime) * 0.5 + 0.5;
          float halfWidth      = mix(minLineWidth, maxLineWidth, rand * hFade) / 2.0;
          float offset         = random(offsetPosition + offsetTime * (1.0 + nli))
                                 * mix(minOffsetSpread, maxOffsetSpread, hFade);

          float linePos = getPlasmaY(space.x, hFade, offset);
          float line    = drawSmoothLine(linePos, halfWidth, space.y) / 2.0
                        + drawCrispLine(linePos, halfWidth * 0.15, space.y);

          float cx = mod(float(l) + iTime * lineSpeed, 25.0) - 12.0;
          vec2  cp = vec2(cx, getPlasmaY(cx, hFade, offset));
          float circle = drawCircle(cp, 0.01, space) * 3.0;

          lines += (line + circle) * lineColor * rand;
        }

        /* Compose:
           - Background stays consistently near-white (no vFade)
           - Lines fade at top/bottom edges via vFade
           - hFade already built into line width so lateral edges look natural */
        vec4 color = mix(bgColor1, bgColor2, uv.x);
        color.a    = 1.0;
        color     += lines * vFade * 0.6;

        gl_FragColor = color;
      }
    `;

    /* ---- Compile helpers ---------------------------------- */
    function loadShader(type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.warn('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    function initShaderProgram(vs, fs) {
      const vert = loadShader(gl.VERTEX_SHADER,   vs);
      const frag = loadShader(gl.FRAGMENT_SHADER, fs);
      if (!vert || !frag) return null;
      const prog = gl.createProgram();
      gl.attachShader(prog, vert);
      gl.attachShader(prog, frag);
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        console.warn('Shader link error:', gl.getProgramInfoLog(prog));
        return null;
      }
      return prog;
    }

    /* ---- Setup -------------------------------------------- */
    const program = initShaderProgram(vsSource, fsSource);
    if (!program) return;

    const posBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

    const attribPos  = gl.getAttribLocation(program,  'aVertexPosition');
    const uResolution= gl.getUniformLocation(program, 'iResolution');
    const uTime      = gl.getUniformLocation(program, 'iTime');

    /* ---- Resize ------------------------------------------- */
    function resize() {
      const hero = canvas.parentElement;
      canvas.width  = hero ? hero.clientWidth  : window.innerWidth;
      canvas.height = hero ? hero.clientHeight : window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    window.addEventListener('resize', resize);
    resize();

    /* ---- Render loop -------------------------------------- */
    const startTime = Date.now();
    let rafId;

    function render() {
      const t = (Date.now() - startTime) / 1000;

      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);

      gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
      gl.vertexAttribPointer(attribPos, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(attribPos);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafId = requestAnimationFrame(render);
    }

    render();

    /* Pause when tab is hidden to save battery */
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
      } else {
        rafId = requestAnimationFrame(render);
      }
    });
  }

})();
