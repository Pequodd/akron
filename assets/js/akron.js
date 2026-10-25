/* АКРОН — общая логика страниц */
(function () {
  var D = window.AKRON_DATA;
  var page = document.body.dataset.page;
  var rub = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 });
  var mln = function (v) { return (v / 1e6).toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' млн ₽'; };
  var IMG = 'assets/img/';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  D.projects.forEach(function (p) {
    p.area = p.plan.reduce(function (s, f) { return s + f.rooms.reduce(function (a, r) { return a + r[1]; }, 0); }, 0);
  });
  var byslug = {};
  D.projects.forEach(function (p) { byslug[p.slug] = p; });
  var priceFrom = function (p) { return p.area * D.kits[1].per; };

  /* ---------- Шапка и подвал ---------- */
  var nav = [
    ['projects', 'projects.html', 'Проекты домов'],
    ['objects', 'objects.html', 'Построенные дома'],
    ['technology', 'technology.html', 'Технология'],
    ['about', 'about.html', 'О компании'],
    ['contacts', 'contacts.html', 'Контакты']
  ];
  var cur = page === 'project' ? 'projects' : page;
  var logo = '<svg viewBox="0 0 30 30" aria-hidden="true"><path d="M3 27 L15 3 L27 27" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8.5 18 H21.5" stroke="#3B55EE" stroke-width="2.4"/><circle cx="15" cy="3" r="1.8" fill="currentColor"/></svg>';
  var hd = $('#hd');
  if (hd) {
    hd.className = 'hd';
    hd.innerHTML =
      '<div class="hd-row">' +
        '<a class="hd-logo" href="index.html" aria-label="АКРОН, на главную">' + logo + '<span>АКРОН</span></a>' +
        '<nav class="hd-nav" aria-label="Основное меню">' + nav.map(function (n) {
          return '<a href="' + n[1] + '"' + (n[0] === cur ? ' aria-current="page"' : '') + '>' + n[2] + '</a>';
        }).join('') + '</nav>' +
        '<div class="hd-phone"><span class="mark">Пн–Сб, 9–21</span><b>+7 495 790-14-09</b></div>' +
        '<div style="display:flex">' +
          '<a class="hd-cta" href="contacts.html#form">Обсудить дом</a>' +
          '<button class="hd-burger" type="button" aria-expanded="false" aria-controls="drawer" aria-label="Открыть меню">' +
            '<svg width="22" height="14" viewBox="0 0 22 14" aria-hidden="true"><path d="M0 1h22M0 7h22M0 13h22" stroke="currentColor" stroke-width="1.5"/></svg></button>' +
        '</div>' +
      '</div>' +
      '<div class="drawer" id="drawer" hidden>' + nav.map(function (n, i) {
        return '<a href="' + n[1] + '"' + (n[0] === cur ? ' aria-current="page"' : '') + '>' + n[2] + '<span class="mark">0' + (i + 1) + '</span></a>';
      }).join('') + '<span class="mark">+7 495 790-14-09 · Пн–Сб, 9–21</span></div>';
    var burger = $('.hd-burger', hd), drawer = $('#drawer');
    burger.addEventListener('click', function () {
      var open = drawer.hidden;
      drawer.hidden = !open;
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    });
  }

  var ft = $('#ft');
  if (ft) {
    ft.className = 'ft';
    ft.innerHTML =
      '<div class="g ft-cols">' +
        '<div><b>Компания</b><a href="about.html">О компании</a><a href="technology.html">Технология</a><a href="objects.html">Построенные дома</a></div>' +
        '<div><b>Проекты</b>' + D.projects.slice(0, 4).map(function (p) { return '<a href="project.html#' + p.slug + '">' + p.name + ', ' + p.area + ' м²</a>'; }).join('') + '<a href="projects.html">Все проекты</a></div>' +
        '<div><b>Офис и шоурум</b><p>Москва, Пресненская наб., 10, блок C, 14 этаж</p><p class="muted" style="margin-top:8px">Шоурум материалов: Истра, Волоколамское ш., 54 км</p></div>' +
        '<div><b>Связаться</b><p class="num" style="font-size:20px">+7 495 790-14-09</p><p>hello@akron.example</p><a href="contacts.html#form" class="link" style="display:inline-block;margin-top:12px">Обсудить дом</a></div>' +
      '</div>' +
      '<div class="ft-word" aria-hidden="true"><svg viewBox="0 0 1600 300"><text x="0" y="285" textLength="1600" lengthAdjust="spacingAndGlyphs" font-family="Forum, serif" font-size="380" fill="rgba(230,223,209,.06)">АКРОН</text></svg></div>' +
      '<div class="g ft-legal mark"><span>© 2009–2026 АКРОН. Каменные дома под ключ</span><span>Концепт-проект для портфолио. Компания и данные вымышлены</span></div>';
  }

  /* ---------- Общие фрагменты ---------- */
  function ph(img, alt, cap, extra) {
    return '<div class="ph' + (extra ? ' ' + extra : '') + '"><img src="' + IMG + img + '.jpg" alt="' + esc(alt) + '" loading="lazy">' + (cap ? '<span class="cap">' + cap + '</span>' : '') + '</div>';
  }
  function card(p) {
    return '<a class="card" href="project.html#' + p.slug + '">' +
      '<div class="row"><span class="mark">' + p.style + ' · ' + p.floors + ' эт.</span>' + (p.tag ? '<span class="tag tag--blue">' + p.tag + '</span>' : '<span class="mark">' + p.size + ' м</span>') + '</div>' +
      ph(p.img, 'Дом ' + p.name) +
      '<h3>' + p.name + '</h3>' +
      '<div class="spec"><div><b>' + p.area + ' м²</b><span>площадь</span></div><div><b>' + p.bedrooms + '</b><span>спальни</span></div><div><b>' + p.months + ' мес.</b><span>стройка</span></div></div>' +
      '<div class="price"><span class="mark">Тёплый контур от</span><b>' + mln(priceFrom(p)) + '</b></div>' +
    '</a>';
  }

  /* ---------- Главная ---------- */
  if (page === 'home') {
    // На узком экране вытягиваем фото под знаком вниз, чтобы дом был виден
    var tall = function () {
      var h = matchMedia('(max-width: 640px)').matches ? 1700 : 960;
      $('#heroSvg').setAttribute('viewBox', '0 0 1600 ' + h);
      $('#heroImg').setAttribute('height', h);
      $('#heroBand').setAttribute('height', h - 476);
      document.querySelectorAll('#heroSvg line[y2]').forEach(function (l) { if (l.getAttribute('x1') === l.getAttribute('x2')) l.setAttribute('y2', h); });
    };
    tall(); matchMedia('(max-width: 640px)').addEventListener('change', tall);
    var feat = ['ladoga', 'nerl', 'istra'].map(function (s) { return byslug[s]; });
    var sizes = ['tile--xl', 'tile--m', 'tile--s'];
    $('#bento').innerHTML = feat.map(function (p, i) {
      return '<a class="tile ' + sizes[i] + '" href="project.html#' + p.slug + '">' +
        '<div class="t-top"><span class="mark">(' + String(i + 1).padStart(2, '0') + ') ' + p.style + '</span><span class="mark">' + p.size + ' м</span></div>' +
        '<h3>' + p.name + '</h3>' +
        '<div class="t-bot"><span class="tag">' + p.area + ' м²</span><span class="tag">' + p.bedrooms + ' спальни</span><span class="tag tag--blue">от ' + mln(priceFrom(p)) + '</span></div>' +
        ph(p.img, 'Дом ' + p.name) +
      '</a>';
    }).join('');
    $('#objects').innerHTML = D.objects.slice(0, 4).map(objCard).join('');
    $('#kits').innerHTML = D.kits.map(function (k, i) {
      return '<div class="kit' + (i === 1 ? ' kit--pick' : '') + '"><span class="mark">0' + (i + 1) + '</span><h3>' + k.name + '</h3>' +
        '<p class="p">от ' + rub.format(k.per) + ' ₽ <small>/ м²</small></p><p class="muted" style="font-size:14px">' + k.desc + '</p>' +
        '<ul>' + k.inc.map(function (x) { return '<li>' + x + '</li>'; }).join('') + k.no.map(function (x) { return '<li class="no">' + x + '</li>'; }).join('') + '</ul></div>';
    }).join('');
  }

  function objCard(o) {
    var p = byslug[o.project];
    return '<a class="obj" href="project.html#' + p.slug + '">' + ph(o.img, o.name, o.year + ' · ' + o.place) +
      '<h3>' + o.name + '</h3>' +
      '<dl><dt>Проект</dt><dd>' + p.name + ', ' + p.area + ' м²</dd><dt>Срок</dt><dd>' + o.months + ' мес.</dd><dt>Сдан</dt><dd>' + o.year + '</dd></dl></a>';
  }

  /* ---------- Каталог ---------- */
  if (page === 'projects') {
    var st = { floors: 'all', area: 'all', style: 'all' };
    try { var saved = JSON.parse(localStorage.getItem('akron-filter') || 'null'); if (saved) st = Object.assign(st, saved); } catch (e) {}
    var groups = {
      floors: [['all', 'Все'], ['1', '1 этаж'], ['2', '2 этажа']],
      area: [['all', 'Любая'], ['s', 'до 150 м²'], ['m', '150–220 м²'], ['l', 'от 220 м²']],
      style: [['all', 'Все'], ['Современный', 'Современный'], ['Классика', 'Классика'], ['Минимализм', 'Минимализм']]
    };
    var names = { floors: 'Этажность', area: 'Площадь', style: 'Стиль' };
    var fEl = $('#filters');
    function drawFilters() {
      fEl.innerHTML = Object.keys(groups).map(function (g) {
        return '<fieldset><legend class="mark">' + names[g] + '</legend>' + groups[g].map(function (o) {
          return '<button type="button" class="chip" data-g="' + g + '" data-v="' + o[0] + '" aria-pressed="' + (st[g] === o[0]) + '">' + o[1] + '</button>';
        }).join('') + '</fieldset>';
      }).join('') + '<div class="count mark" aria-live="polite"><b id="cnt"></b>&nbsp;проектов</div>';
    }
    function fit(p) {
      if (st.floors !== 'all' && String(p.floors) !== st.floors) return false;
      if (st.style !== 'all' && p.style !== st.style) return false;
      if (st.area === 's' && p.area >= 150) return false;
      if (st.area === 'm' && (p.area < 150 || p.area > 220)) return false;
      if (st.area === 'l' && p.area <= 220) return false;
      return true;
    }
    function drawCards() {
      var list = D.projects.filter(fit);
      $('#cnt').textContent = list.length;
      $('#cards').innerHTML = list.length ? list.map(card).join('') :
        '<div class="empty">Под эти условия готового проекта нет. Архитектор адаптирует ближайший или сделает индивидуальный: <a class="link" href="contacts.html#form">обсудить дом</a>.</div>';
    }
    fEl.addEventListener('click', function (e) {
      var b = e.target.closest('.chip'); if (!b) return;
      st[b.dataset.g] = b.dataset.v;
      try { localStorage.setItem('akron-filter', JSON.stringify(st)); } catch (er) {}
      drawFilters(); drawCards();
      var again = fEl.querySelector('[data-g="' + b.dataset.g + '"][data-v="' + b.dataset.v + '"]'); if (again) again.focus();
    });
    drawFilters(); drawCards();
  }

  /* ---------- Страница проекта ---------- */
  if (page === 'project') {
    var render = function () {
      var slug = (location.hash || '').slice(1);
      var p = byslug[slug] || D.projects[0];
      document.title = p.name + ' — проект дома АКРОН';
      $('#pjCrumb').textContent = p.name;
      $('#pjHero').innerHTML = ph(p.img, 'Дом ' + p.name, null, 'ph--color') + '<div class="pj-name" aria-hidden="true">' + p.name + '</div>';
      $('#pjTitle').textContent = 'Проект «' + p.name + '»';
      $('#pjAbout').textContent = p.about;
      $('#pjSpecs').innerHTML = [
        [p.area + ' м²', 'общая площадь'], [p.size + ' м', 'габариты'], [p.floors, p.floors > 1 ? 'этажа' : 'этаж'],
        [p.bedrooms, 'спальни'], [p.baths, 'санузлы'], [p.months + ' мес.', 'срок стройки']
      ].map(function (s) { return '<div><b>' + s[0] + '</b><span>' + s[1] + '</span></div>'; }).join('');
      $('#pjMat').innerHTML = [['Стены', p.wall], ['Фасад', p.facade], ['Кровля', p.roof], ['Стиль', p.style]]
        .map(function (r) { return '<dt>' + r[0] + '</dt><dd>' + r[1] + '</dd>'; }).join('');
      $('#pjGallery').innerHTML = p.gallery.map(function (g, i) { return ph(g, 'Интерьер дома ' + p.name, i === 0 ? 'Визуализация интерьера' : null); }).join('');
      drawPlan(p, 0);
      $('#pjTabs').innerHTML = p.plan.map(function (f, i) { return '<button type="button" class="chip" data-i="' + i + '" aria-pressed="' + (i === 0) + '">' + f.name + '</button>'; }).join('');
      $('#pjOthers').innerHTML = D.projects.filter(function (x) { return x.slug !== p.slug; }).slice(0, 3).map(card).join('');
      calcProject(p);
    };
    $('#pjTabs').addEventListener('click', function (e) {
      var b = e.target.closest('.chip'); if (!b) return;
      var p = byslug[(location.hash || '').slice(1)] || D.projects[0];
      [].forEach.call(this.children, function (c) { c.setAttribute('aria-pressed', String(c === b)); });
      drawPlan(p, +b.dataset.i);
    });
    window.addEventListener('hashchange', function () { render(); window.scrollTo(0, 0); });
    render();
  }

  // Схематичный план: рекурсивно делим габарит этажа на комнаты пропорционально площади
  function drawPlan(p, fi) {
    var f = p.plan[fi], S = 40, pad = 30;
    var W = f.w * S, H = f.h * S;
    var rooms = f.rooms.map(function (r, i) { return { name: r[0], a: r[1], i: i }; });
    var rects = [];
    (function split(list, x, y, w, h) {
      if (list.length === 1) { rects.push({ r: list[0], x: x, y: y, w: w, h: h }); return; }
      var tot = list.reduce(function (s, r) { return s + r.a; }, 0), acc = 0, k = 0;
      while (k < list.length - 1 && acc + list[k].a <= tot / 2) { acc += list[k].a; k++; }
      if (k === 0) { acc = list[0].a; k = 1; }
      var a = list.slice(0, k), b = list.slice(k), t = acc / tot;
      if (w >= h) { split(a, x, y, w * t, h); split(b, x + w * t, y, w * (1 - t), h); }
      else { split(a, x, y, w, h * t); split(b, x, y + h * t, w, h * (1 - t)); }
    })(rooms, pad, pad, W, H);
    var svg = '<svg viewBox="0 0 ' + (W + pad * 2) + ' ' + (H + pad * 2) + '" role="img" aria-label="Схема планировки, ' + f.name + '">' +
      '<rect x="' + (pad - 6) + '" y="' + (pad - 6) + '" width="' + (W + 12) + '" height="' + (H + 12) + '" fill="none" stroke="#E6DFD1" stroke-width="6"/>' +
      rects.map(function (q) {
        var big = q.w > 110 && q.h > 70;
        return '<g data-i="' + q.r.i + '"><rect class="room-rect" x="' + q.x + '" y="' + q.y + '" width="' + q.w + '" height="' + q.h + '"/>' +
          '<text x="' + (q.x + 10) + '" y="' + (q.y + 22) + '" font-family="IBM Plex Mono, monospace" font-size="13" fill="#8E8F89">' + String(q.r.i + 1).padStart(2, '0') + '</text>' +
          (big ? '<text x="' + (q.x + 10) + '" y="' + (q.y + q.h - 14) + '" font-family="Golos Text, sans-serif" font-size="15" fill="#E6DFD1">' + q.r.name + ' · ' + q.r.a + ' м²</text>' : '') + '</g>';
      }).join('') +
      '<text x="' + (pad + W / 2) + '" y="' + (pad - 14) + '" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="13" fill="#8E8F89">' + f.w.toFixed(1).replace('.', ',') + ' м</text>' +
      '<text x="' + (pad - 14) + '" y="' + (pad + H / 2) + '" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="13" fill="#8E8F89" transform="rotate(-90 ' + (pad - 14) + ' ' + (pad + H / 2) + ')">' + f.h.toFixed(1).replace('.', ',') + ' м</text>' +
      '</svg>';
    $('#pjPlan').innerHTML = svg;
    $('#pjRooms').innerHTML = rooms.map(function (r) {
      return '<li data-i="' + r.i + '"><span class="n">' + String(r.i + 1).padStart(2, '0') + '</span><span>' + r.name + '</span><span class="a">' + r.a + ' м²</span></li>';
    }).join('') + '<li><span class="n"></span><span><b>Итого по этажу</b></span><span class="a"><b>' + rooms.reduce(function (s, r) { return s + r.a; }, 0) + ' м²</b></span></li>';
    var hl = function (i) {
      document.querySelectorAll('#pjPlan .room-rect').forEach(function (r) { r.classList.toggle('on', r.parentNode.dataset.i === i); });
      document.querySelectorAll('#pjRooms li').forEach(function (l) { l.classList.toggle('on', l.dataset.i === i); });
    };
    ['#pjPlan', '#pjRooms'].forEach(function (s) {
      $(s).onmouseover = function (e) { var t = e.target.closest('[data-i]'); hl(t ? t.dataset.i : null); };
      $(s).onmouseleave = function () { hl(null); };
    });
  }

  function calcProject(p) {
    var box = $('#calc');
    var opt = D.options;
    var seg = function (name, list, def) {
      return '<div class="seg">' + list.map(function (o) {
        return '<label><input type="radio" name="' + name + '" value="' + o.id + '"' + (o.id === def ? ' checked' : '') + '><span>' + o.name + '</span></label>';
      }).join('') + '</div>';
    };
    $('#calcOpts').innerHTML =
      '<div class="opt"><span class="mark">Комплектация</span>' + seg('kit', D.kits, 'warm') + '</div>' +
      '<div class="opt"><span class="mark">Фундамент</span>' + seg('found', opt.found, 'slab') + '</div>' +
      '<div class="opt"><span class="mark">Фасад</span>' + seg('facade', opt.facade, 'brick') + '</div>' +
      '<div class="opt"><span class="mark">Кровля</span>' + seg('roof', opt.roof, 'metal') + '</div>';
    var pick = function (n, list) { var v = box.querySelector('input[name="' + n + '"]:checked').value; return list.filter(function (o) { return o.id === v; })[0]; };
    var upd = function () {
      var k = pick('kit', D.kits), f = pick('found', opt.found), fa = pick('facade', opt.facade), r = pick('roof', opt.roof);
      var base = k.per * p.area, add = (f.add + fa.add + r.add) * p.area;
      $('#calcTotal').textContent = mln(base + add);
      $('#calcKit').textContent = k.name;
      $('#calcBreak').innerHTML =
        '<dt>' + k.name + ', ' + rub.format(k.per) + ' ₽ × ' + p.area + ' м²</dt><dd>' + rub.format(base) + ' ₽</dd>' +
        '<dt>' + f.name + '</dt><dd>' + (f.add ? '+ ' + rub.format(f.add * p.area) + ' ₽' : 'включено') + '</dd>' +
        '<dt>Фасад: ' + fa.name.toLowerCase() + '</dt><dd>' + (fa.add ? '+ ' + rub.format(fa.add * p.area) + ' ₽' : 'включено') + '</dd>' +
        '<dt>Кровля: ' + r.name.toLowerCase() + '</dt><dd>' + (r.add ? '+ ' + rub.format(r.add * p.area) + ' ₽' : 'включено') + '</dd>' +
        '<dt>Срок строительства</dt><dd>' + p.months + ' мес.</dd>';
    };
    box.onchange = upd;
    upd();
  }

  /* ---------- Построенные дома ---------- */
  if (page === 'objects') {
    $('#objects').innerHTML = D.objects.map(objCard).join('');
  }

  /* ---------- Технология: разрез стены ---------- */
  if (page === 'technology') {
    var wall = $('.wall');
    var set = function (i) {
      if (i == null) wall.removeAttribute('data-on'); else wall.setAttribute('data-on', i);
      wall.querySelectorAll('[data-l]').forEach(function (el) { el.classList.toggle('on', el.dataset.l === i); });
    };
    wall.addEventListener('mouseover', function (e) { var t = e.target.closest('[data-l]'); if (t) set(t.dataset.l); });
    wall.addEventListener('mouseleave', function () { set(null); });
    wall.addEventListener('focusin', function (e) { var t = e.target.closest('[data-l]'); if (t) set(t.dataset.l); });
    wall.addEventListener('focusout', function () { set(null); });
  }

  /* ---------- Контакты: копирование ---------- */
  document.querySelectorAll('.copy').forEach(function (b) {
    b.addEventListener('click', function () {
      var v = b.dataset.copy, done = function () { b.textContent = 'Скопировано'; setTimeout(function () { b.textContent = 'Скопировать'; }, 1600); };
      try {
        navigator.clipboard.writeText(v).then(done, function () { selectText(b.previousElementSibling); });
      } catch (e) { selectText(b.previousElementSibling); }
    });
  });
  function selectText(el) { var r = document.createRange(); r.selectNodeContents(el); var s = getSelection(); s.removeAllRanges(); s.addRange(r); }

  /* ---------- Формы заявки ---------- */
  document.querySelectorAll('form.form').forEach(function (form) {
    var proj = form.querySelector('select[name="project"]');
    if (proj && proj.options.length < 2) {
      proj.innerHTML = '<option value="">Ещё не выбрал</option>' + D.projects.map(function (p) { return '<option value="' + p.slug + '">' + p.name + ', ' + p.area + ' м²</option>'; }).join('') + '<option value="custom">Индивидуальный проект</option>';
      if (page === 'project') proj.value = (location.hash || '').slice(1) || D.projects[0].slug;
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.querySelector('[name="name"]'), phone = form.querySelector('[name="phone"]'), err = form.querySelector('.err');
      var msg = '';
      if (!name.value.trim()) { msg = 'Напишите имя, чтобы архитектор знал, как к вам обращаться.'; name.focus(); }
      else if (phone.value.replace(/\D/g, '').length < 10) { msg = 'Проверьте телефон: нужно 10 цифр после +7.'; phone.focus(); }
      if (msg) { err.textContent = msg; err.hidden = false; return; }
      err.hidden = true;
      var sent = form.nextElementSibling;
      sent.querySelector('[data-phone]').textContent = phone.value;
      form.hidden = true; sent.hidden = false;
    });
  });
})();
