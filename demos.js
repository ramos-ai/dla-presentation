/**
 * DataLabelling App — ui-docs
 * Demos interativos: detecção (bbox) e segmentação (polígono).
 * Cores do frontend: primary #0B3C5D, secondary #1F7A8C, gray-100 #E8ECEF.
 */
(function () {
  'use strict';

  // ----- Detecção: desenhar retângulo com arrastar -----
  var detCanvas = document.getElementById('demo-detection');
  if (detCanvas) {
    var ctx = detCanvas.getContext('2d');
    var rect = { x: 0, y: 0, w: 0, h: 0 };
    var drawing = false;
    var startX, startY;
    var legend = document.getElementById('detection-legend');

    function clearDet() {
      ctx.fillStyle = '#E8ECEF';
      ctx.fillRect(0, 0, detCanvas.width, detCanvas.height);
      ctx.strokeStyle = '#9CA3AF';
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(2, 2, detCanvas.width - 4, detCanvas.height - 4);
      ctx.setLineDash([]);
    }

    function drawRect() {
      if (rect.w === 0 && rect.h === 0) return;
      ctx.strokeStyle = '#1F7A8C';
      ctx.lineWidth = 2;
      ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
      ctx.fillStyle = 'rgba(31, 122, 140, 0.15)';
      ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
    }

    clearDet();

    detCanvas.addEventListener('mousedown', function (e) {
      var r = detCanvas.getBoundingClientRect();
      var scaleX = detCanvas.width / r.width;
      var scaleY = detCanvas.height / r.height;
      startX = (e.clientX - r.left) * scaleX;
      startY = (e.clientY - r.top) * scaleY;
      drawing = true;
      rect = { x: startX, y: startY, w: 0, h: 0 };
      if (legend) legend.textContent = 'Arraste para desenhar a caixa.';
    });

    detCanvas.addEventListener('mousemove', function (e) {
      if (!drawing) return;
      var r = detCanvas.getBoundingClientRect();
      var scaleX = detCanvas.width / r.width;
      var scaleY = detCanvas.height / r.height;
      var x = (e.clientX - r.left) * scaleX;
      var y = (e.clientY - r.top) * scaleY;
      rect.x = Math.min(startX, x);
      rect.y = Math.min(startY, y);
      rect.w = Math.abs(x - startX);
      rect.h = Math.abs(y - startY);
      clearDet();
      drawRect();
    });

    detCanvas.addEventListener('mouseup', function () {
      if (drawing) {
        drawing = false;
        if (legend) legend.textContent = 'Bounding box desenhada. Arraste de novo para redesenhar.';
      }
    });

    detCanvas.addEventListener('mouseleave', function () {
      if (drawing) drawing = false;
    });
  }

  // ----- Segmentação: desenhar polígono com cliques -----
  var segCanvas = document.getElementById('demo-segmentation');
  if (segCanvas) {
    var sCtx = segCanvas.getContext('2d');
    var points = [];
    var closed = false;
    var btnClose = document.getElementById('btn-close-poly');
    var btnClear = document.getElementById('btn-clear-poly');

    function clearSeg() {
      sCtx.fillStyle = '#E8ECEF';
      sCtx.fillRect(0, 0, segCanvas.width, segCanvas.height);
      sCtx.strokeStyle = '#9CA3AF';
      sCtx.setLineDash([4, 4]);
      sCtx.strokeRect(2, 2, segCanvas.width - 4, segCanvas.height - 4);
      sCtx.setLineDash([]);
    }

    function drawSeg() {
      if (points.length < 2) return;
      sCtx.strokeStyle = '#0B3C5D';
      sCtx.lineWidth = 2;
      sCtx.fillStyle = 'rgba(11, 60, 93, 0.2)';
      sCtx.beginPath();
      sCtx.moveTo(points[0].x, points[0].y);
      for (var i = 1; i < points.length; i++) {
        sCtx.lineTo(points[i].x, points[i].y);
      }
      if (closed) sCtx.closePath();
      sCtx.fill();
      sCtx.stroke();
      points.forEach(function (p, i) {
        sCtx.fillStyle = i === 0 ? '#0B3C5D' : '#0F5077';
        sCtx.beginPath();
        sCtx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        sCtx.fill();
      });
    }

    clearSeg();

    segCanvas.addEventListener('click', function (e) {
      if (closed) return;
      var r = segCanvas.getBoundingClientRect();
      var scaleX = segCanvas.width / r.width;
      var scaleY = segCanvas.height / r.height;
      var x = (e.clientX - r.left) * scaleX;
      var y = (e.clientY - r.top) * scaleY;
      if (points.length >= 3 && Math.hypot(x - points[0].x, y - points[0].y) < 12) {
        closed = true;
      } else {
        points.push({ x: x, y: y });
      }
      clearSeg();
      drawSeg();
    });

    if (btnClose) {
      btnClose.addEventListener('click', function () {
        if (points.length >= 3 && !closed) {
          closed = true;
          clearSeg();
          drawSeg();
        }
      });
    }

    if (btnClear) {
      btnClear.addEventListener('click', function () {
        points = [];
        closed = false;
        clearSeg();
      });
    }
  }
})();
