/* АКРОН — общая логика страниц */
(function () {
  var D = window.AKRON_DATA;
  var page = document.body.dataset.page;
  var rub = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 });
  var mln = function (v) { return (v / 1e6).toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' млн ₽'; };
  var IMG = 'assets/img/';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var plural = function (n, a, b, c) { var m = n % 10, h = n % 100; return m === 1 && h !== 11 ? a : m >= 2 && m <= 4 && (h < 12 || h > 14) ? b : c; };

  D.projects.forEach(function (p) {
    p.area = p.plan.reduce(function (s, f) { return s + f.rooms.reduce(function (a, r) { return a + r[1]; }, 0); }, 0);
  });
  var byslug = {};
  D.projects.forEach(function (p) { byslug[p.slug] = p; });
  var priceFrom = function (p) { return p.area * D.kits[1].per; };

  /* ---------- Шапка и подвал ---------- */
  var nav = [
    ['projects', 'projects.html', 'Проекты'],
    ['objects', 'objects.html', 'Построенные дома'],
    ['technology', 'technology.html', 'Технология'],
    ['about', 'about.html', 'О компании'],
    ['contacts', 'contacts.html', 'Контакты']
  ];
  var cur = page === 'project' ? 'projects' : page;
  var hd = $('#hd');
  if (hd) {
    hd.className = 'hd';
    hd.innerHTML =
      '<div class="hd-row">' +
        '<a class="hd-logo" href="index.html" aria-label="Акрон, на главную">Акрон</a>' +
        '<nav class="hd-nav" aria-label="Основное меню">' + nav.map(function (n) {
          return '<a href="' + n[1] + '"' + (n[0] === cur ? ' aria-current="page"' : '') + '>' + n[2] + '</a>';
        }).join('') + '</nav>' +
        '<span class="hd-phone num">+7 495 790-14-09</span>' +
        '<div style="display:flex"><a class="hd-cta" href="contacts.html#form">Обсудить дом</a>' +
        '<button class="hd-burger" type="button" aria-expanded="false" aria-controls="drawer" aria-label="Открыть меню">' +
          '<svg width="22" height="12" viewBox="0 0 22 12" aria-hidden="true"><path d="M0 1h22M0 11h22" stroke="currentColor" stroke-width="1.6"/></svg></button></div>' +
      '</div>' +
      '<div class="drawer pad" id="drawer" hidden>' + nav.map(function (n) {
        return '<a href="' + n[1] + '"' + (n[0] === cur ? ' aria-current="page"' : '') + '>' + n[2] + '</a>';
      }).join('') + '<p>+7 495 790-14-09, пн–сб с 9 до 21</p></div>';
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
      '<div class="g cols">' +
        '<div><h4>Акрон</h4><p style="max-width:20em">Проектируем и строим каменные дома в Московской области с 2009 года.</p></div>' +
        '<div><h4>Компания</h4><a href="about.html">О компании</a><a href="technology.html">Технология</a><a href="objects.html">Построенные дома</a><a href="contacts.html">Контакты</a></div>' +
        '<div><h4>Проекты</h4>' + D.projects.slice(0, 4).map(function (p) { return '<a href="project.html#' + p.slug + '">' + p.name + ', ' + p.area + ' м²</a>'; }).join('') + '<a href="projects.html">Все проекты</a></div>' +
        '<div><h4>Связаться</h4><p class="big num">+7 495 790-14-09</p><p style="margin-top:8px">hello@akron.example</p><p>Москва, Пресненская наб., 10, блок C</p></div>' +
      '</div>' +
      '<div class="ft-word pad" aria-hidden="true"><svg viewBox="0 0 1600 260"><text x="0" y="236" textLength="1600" lengthAdjust="spacingAndGlyphs" font-family="Unbounded, sans-serif" font-weight="800" font-size="300" fill="rgba(237,232,223,.05)">АКРОН</text></svg></div>' +
      '<div class="ft-bot pad"><span>© 2009–2026 Акрон</span><span>Концепт-проект для портфолио. Компания, проекты и цены вымышлены</span></div>';
  }

  /* ---------- Общие фрагменты ---------- */
  function img(name, alt, eager) {
    return '<img src="' + IMG + name + '.jpg" alt="' + esc(alt) + '"' + (eager ? '' : ' loading="lazy"') + '>';
  }
  function pj(p) {
    return '<a class="pj" href="project.html#' + p.slug + '">' +
      '<div class="ph">' + img(p.img, 'Дом по проекту «' + p.name + '»') + (p.tag ? '<span class="tg">' + p.tag + '</span>' : '') + '</div>' +
      '<div class="row"><h3>' + p.name + '</h3><span class="price">от ' + mln(priceFrom(p)) + '</span></div>' +
      '<p>' + p.area + ' м², ' + p.floors + ' ' + plural(p.floors, 'этаж', 'этажа', 'этажей') + ', ' + p.bedrooms + ' ' + plural(p.bedrooms, 'спальня', 'спальни', 'спален') + ', стройка ' + p.months + ' мес.</p>' +
    '</a>';
  }
  function home(o) {
    var p = byslug[o.project];
    return '<a class="home" href="project.html#' + p.slug + '">' +
      '<div class="ph">' + img(o.img, o.name) + '</div>' +
      '<h3>' + o.name + '</h3>' +
      '<p>' + o.place + ', ' + o.year + '. Проект «' + p.name + '», ' + p.area + ' м², ' + o.months + ' мес.</p></a>';
  }

  /* ---------- Распил: фото нарезано вертикальными полосами ---------- */
  function saw(el, name) {
    el.innerHTML = Array.apply(null, Array(7)).map(function (_, k) {
      return '<i style="--k:' + k + '"><img src="' + IMG + name + '.jpg" alt=""' + (k ? ' loading="lazy"' : '') + '></i>';
    }).join('');
  }
  document.querySelectorAll('[data-saw]').forEach(function (el) { saw(el, el.dataset.saw); });

  /* ---------- Каталог полосами ---------- */
  var strips = $('#strips');
  if (strips) {
    strips.innerHTML = D.projects.map(function (p, i) {
      return '<div class="strip' + (i === 0 ? ' on' : '') + '" role="button" tabindex="0" aria-expanded="' + (i === 0) + '" aria-label="Проект «' + p.name + '», ' + p.area + ' м²">' +
        img(p.img, '') +
        '<span class="v">' + p.name + '<small>' + p.area + ' м²</small></span>' +
        '<div class="info"><h3>' + p.name + '</h3><p>' + p.area + ' м², ' + p.floors + ' ' + plural(p.floors, 'этаж', 'этажа', 'этажей') + ', ' + p.bedrooms + ' ' + plural(p.bedrooms, 'спальня', 'спальни', 'спален') + '. Тёплый контур от ' + mln(priceFrom(p)) + ', стройка ' + p.months + ' мес.</p>' +
        '<a class="btn btn--brass" href="project.html#' + p.slug + '" tabindex="-1">Открыть проект</a></div></div>';
    }).join('');
    var open = function (s) {
      strips.querySelectorAll('.strip').forEach(function (x) {
        var on = x === s; x.classList.toggle('on', on); x.setAttribute('aria-expanded', String(on));
        x.querySelector('.btn').tabIndex = on ? 0 : -1;
      });
    };
    strips.addEventListener('click', function (e) { var s = e.target.closest('.strip'); if (s && !e.target.closest('.btn')) open(s); });
    strips.addEventListener('keydown', function (e) { var s = e.target.closest('.strip'); if (s && e.target === s && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); open(s); } });
    if (matchMedia('(hover: hover)').matches) strips.addEventListener('mouseover', function (e) { var s = e.target.closest('.strip'); if (s && !s.classList.contains('on')) open(s); });
    strips.querySelectorAll('.strip')[0].querySelector('.btn').tabIndex = 0;
  }

  /* ---------- Главная ---------- */
  if (page === 'home') {
    $('#homes').innerHTML = D.objects.slice(0, 4).map(home).join('');
    drawKits($('#kits'));
  }

  function drawKits(el) {
    if (!el) return;
    var rows = [
      ['Фундамент, стены, перекрытия, кровля', [1, 1, 1, 1]],
      ['Окна и входная дверь', [0, 1, 1, 1]],
      ['Утеплённый фасад', [0, 1, 1, 1]],
      ['Отопление, вода, канализация, электрика', [0, 0, 1, 1]],
      ['Стяжка и штукатурка стен', [0, 0, 1, 1]],
      ['Чистовая отделка по дизайн-проекту', [0, 0, 0, 1]],
      ['Сантехника, свет, благоустройство у дома', [0, 0, 0, 1]]
    ];
    var yes = '<svg viewBox="0 0 22 22" aria-label="входит"><path d="M4 11.5 L9 16 L18 6" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
    var no = '<span class="no" aria-label="не входит">—</span>';
    el.innerHTML = '<table class="kits"><colgroup><col class="c0"><col><col><col><col></colgroup><thead><tr><th scope="col"><span>Базовая цена: монолитная плита, штукатурный фасад, металлочерепица</span></th>' +
      D.kits.map(function (k, i) { return '<th scope="col"' + (i === 1 ? ' class="pick"' : '') + '><b>' + k.name + '</b><span>' + k.desc + '</span></th>'; }).join('') + '</tr></thead><tbody>' +
      '<tr><th scope="row">Стоимость</th>' + D.kits.map(function (k, i) { return '<td' + (i === 1 ? ' class="pick"' : '') + '><span class="p">' + rub.format(k.per) + ' ₽</span> <small class="mute">за м²</small></td>'; }).join('') + '</tr>' +
      rows.map(function (r) { return '<tr><th scope="row">' + r[0] + '</th>' + r[1].map(function (v, i) { return '<td' + (i === 1 ? ' class="pick"' : '') + '>' + (v ? yes : no) + '</td>'; }).join('') + '</tr>'; }).join('') +
      '</tbody></table>';
  }

  /* ---------- Каталог ---------- */
  if (page === 'projects') {
    var st = { floors: 'all', area: 'all', style: 'all' };
    try { var saved = JSON.parse(localStorage.getItem('akron-filter') || 'null'); if (saved) st = Object.assign(st, saved); } catch (e) {}
    var groups = {
      floors: ['Этажей', [['all', 'Любое'], ['1', 'Один'], ['2', 'Два']]],
      area: ['Площадь', [['all', 'Любая'], ['s', 'до 150 м²'], ['m', '150–220 м²'], ['l', 'больше 220 м²']]],
      style: ['Архитектура', [['all', 'Любая'], ['Современный', 'Современная'], ['Классика', 'Классическая'], ['Минимализм', 'Минимализм']]]
    };
    var fEl = $('#filters');
    var drawFilters = function () {
      fEl.innerHTML = Object.keys(groups).map(function (g) {
        return '<fieldset><legend>' + groups[g][0] + '</legend><div class="chips">' + groups[g][1].map(function (o) {
          return '<button type="button" class="chip" data-g="' + g + '" data-v="' + o[0] + '" aria-pressed="' + (st[g] === o[0]) + '">' + o[1] + '</button>';
        }).join('') + '</div></fieldset>';
      }).join('') + '<p class="count" aria-live="polite" id="cnt"></p>';
    };
    var fit = function (p) {
      if (st.floors !== 'all' && String(p.floors) !== st.floors) return false;
      if (st.style !== 'all' && p.style !== st.style) return false;
      if (st.area === 's' && p.area >= 150) return false;
      if (st.area === 'm' && (p.area < 150 || p.area > 220)) return false;
      if (st.area === 'l' && p.area <= 220) return false;
      return true;
    };
    var drawCards = function () {
      var list = D.projects.filter(fit);
      $('#cnt').textContent = list.length + ' ' + plural(list.length, 'проект', 'проекта', 'проектов');
      $('#cards').innerHTML = list.length ? list.map(function (p) { return pj(p); }).join('') :
        '<div class="empty"><p class="t-3">Под эти условия готового проекта нет</p><p class="mute" style="margin-top:8px">Архитектор адаптирует ближайший проект или сделает индивидуальный.</p><p style="margin-top:20px"><a class="btn" href="contacts.html#form">Обсудить дом</a></p></div>';
    };
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
    var curP = function () { return byslug[(location.hash || '').slice(1)] || D.projects[0]; };
    var render = function () {
      var p = curP();
      document.title = 'Проект «' + p.name + '» — Акрон';
      $('#pjCrumb').textContent = p.name;
      $('#pjName').innerHTML = '<span class="thin">Проект</span> <b>' + p.name + '</b>';
      $('#pjAbout').textContent = p.about;
      saw($('#pjCover'), p.img);
      $('#pjPrice').textContent = 'от ' + mln(priceFrom(p));
      $('#pjSpecs').innerHTML = [
        [p.area + ' м²', 'общая площадь'], [p.size + ' м', 'габариты дома'], [p.floors, plural(p.floors, 'этаж', 'этажа', 'этажей')],
        [p.bedrooms, plural(p.bedrooms, 'спальня', 'спальни', 'спален')], [p.baths, plural(p.baths, 'санузел', 'санузла', 'санузлов')], [p.months + ' мес.', 'срок стройки']
      ].map(function (s) { return '<div><b>' + s[0] + '</b><span>' + s[1] + '</span></div>'; }).join('');
      $('#pjMat').innerHTML = [['Стены', p.wall], ['Фасад', p.facade], ['Кровля', p.roof], ['Архитектура', p.style === 'Классика' ? 'Классическая' : p.style === 'Минимализм' ? 'Минимализм' : 'Современная']]
        .map(function (r) { return '<dt>' + r[0] + '</dt><dd>' + r[1] + '</dd>'; }).join('');
      $('#pjGallery').innerHTML = p.gallery.map(function (g) { return '<div class="ph">' + img(g, 'Интерьер дома «' + p.name + '»') + '</div>'; }).join('');
      $('#pjTabs').innerHTML = p.plan.map(function (fl, i) { return '<button type="button" class="chip" data-i="' + i + '" aria-pressed="' + (i === 0) + '">' + fl.name + '</button>'; }).join('');
      drawPlan(p, 0);
      $('#pjOthers').innerHTML = D.projects.filter(function (x) { return x.slug !== p.slug; }).slice(0, 3).map(function (x) { return pj(x); }).join('');
      calcProject(p);
      var sel = $('select[name="project"]'); if (sel) sel.value = p.slug;
    };
    $('#pjTabs').addEventListener('click', function (e) {
      var b = e.target.closest('.chip'); if (!b) return;
      [].forEach.call(this.children, function (c) { c.setAttribute('aria-pressed', String(c === b)); });
      drawPlan(curP(), +b.dataset.i);
    });
    window.addEventListener('hashchange', function () { render(); window.scrollTo(0, 0); });
    render();
  }

  // Схема планировки: рекурсивно делим габарит этажа на комнаты пропорционально площади
  function drawPlan(p, fi) {
    var fl = p.plan[fi], S = 40, pad = 34;
    var W = fl.w * S, H = fl.h * S;
    var rooms = fl.rooms.map(function (r, i) { return { name: r[0], a: r[1], i: i }; });
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
    var font = 'Onest, sans-serif';
    $('#pjPlan').innerHTML = '<svg viewBox="0 0 ' + (W + pad * 2) + ' ' + (H + pad * 2) + '" role="img" aria-label="Схема планировки, ' + fl.name + '">' +
      '<rect x="' + (pad - 5) + '" y="' + (pad - 5) + '" width="' + (W + 10) + '" height="' + (H + 10) + '" fill="none" stroke="#EDE8DF" stroke-width="10"/>' +
      rects.map(function (q) {
        var big = q.w > 120 && q.h > 80;
        return '<g data-i="' + q.r.i + '"><rect class="room-rect" x="' + q.x + '" y="' + q.y + '" width="' + q.w + '" height="' + q.h + '"/>' +
          '<text x="' + (q.x + 12) + '" y="' + (q.y + 26) + '" font-family="' + font + '" font-size="16" fill="#9A968F">' + (q.r.i + 1) + '</text>' +
          (big ? '<text x="' + (q.x + 12) + '" y="' + (q.y + q.h - 16) + '" font-family="' + font + '" font-size="17" fill="#EDE8DF">' + q.r.name + ', ' + q.r.a + ' м²</text>' : '') + '</g>';
      }).join('') +
      '<text x="' + (pad + W / 2) + '" y="' + (pad - 14) + '" text-anchor="middle" font-family="' + font + '" font-size="15" fill="#9A968F">' + String(fl.w).replace('.', ',') + ' м</text>' +
      '<text x="' + (pad - 14) + '" y="' + (pad + H / 2) + '" text-anchor="middle" font-family="' + font + '" font-size="15" fill="#9A968F" transform="rotate(-90 ' + (pad - 14) + ' ' + (pad + H / 2) + ')">' + String(fl.h).replace('.', ',') + ' м</text>' +
      '</svg>';
    $('#pjRooms').innerHTML = rooms.map(function (r) {
      return '<li data-i="' + r.i + '"><span class="n">' + (r.i + 1) + '</span><span>' + r.name + '</span><span class="a">' + r.a + ' м²</span></li>';
    }).join('') + '<li class="total"><span></span><span>Площадь этажа</span><span class="a">' + rooms.reduce(function (s, r) { return s + r.a; }, 0) + ' м²</span></li>';
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
    var box = $('#calc'), opt = D.options;
    var seg = function (title, name, list, def) {
      return '<fieldset><legend>' + title + '</legend><div class="seg">' + list.map(function (o) {
        return '<label><input type="radio" name="' + name + '" value="' + o.id + '"' + (o.id === def ? ' checked' : '') + '><span>' + o.name + '</span></label>';
      }).join('') + '</div></fieldset>';
    };
    $('#calcOpts').innerHTML = seg('Комплектация', 'kit', D.kits, 'warm') + seg('Фундамент', 'found', opt.found, 'slab') +
      seg('Фасад', 'facade', opt.facade, 'brick') + seg('Кровля', 'roof', opt.roof, 'metal');
    var pick = function (n, list) { var v = box.querySelector('input[name="' + n + '"]:checked').value; return list.filter(function (o) { return o.id === v; })[0]; };
    var line = function (label, add) { return '<dt>' + label + '</dt><dd>' + (add ? '+ ' + rub.format(add * p.area) + ' ₽' : 'входит') + '</dd>'; };
    var upd = function () {
      var k = pick('kit', D.kits), fo = pick('found', opt.found), fa = pick('facade', opt.facade), r = pick('roof', opt.roof);
      var base = k.per * p.area;
      $('#calcTotal').textContent = mln(base + (fo.add + fa.add + r.add) * p.area);
      $('#calcKit').textContent = k.name + ', ' + p.area + ' м²';
      $('#calcBreak').innerHTML = '<dt>' + k.name + ': ' + rub.format(k.per) + ' ₽ за м²</dt><dd>' + rub.format(base) + ' ₽</dd>' +
        line(fo.name, fo.add) + line('Фасад: ' + fa.name.toLowerCase(), fa.add) + line('Кровля: ' + r.name.toLowerCase(), r.add) +
        '<dt>Срок строительства</dt><dd>' + p.months + ' мес.</dd>';
    };
    box.onchange = upd;
    upd();
  }

  /* ---------- Построенные дома ---------- */
  if (page === 'objects') $('#homes').innerHTML = D.objects.map(home).join('');

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

  /* ---------- Копирование контактов ---------- */
  document.querySelectorAll('.copy').forEach(function (b) {
    b.addEventListener('click', function () {
      var target = b.previousElementSibling;
      var done = function () { b.textContent = 'Скопировано'; setTimeout(function () { b.textContent = 'Скопировать'; }, 1600); };
      var sel = function () { var r = document.createRange(); r.selectNodeContents(target); var s = getSelection(); s.removeAllRanges(); s.addRange(r); };
      try { navigator.clipboard.writeText(b.dataset.copy).then(done, sel); } catch (e) { sel(); }
    });
  });

  /* ---------- Формы заявки ---------- */
  document.querySelectorAll('form.form').forEach(function (form) {
    var proj = form.querySelector('select[name="project"]');
    if (proj) {
      proj.innerHTML = '<option value="">Пока не выбрал</option>' + D.projects.map(function (p) { return '<option value="' + p.slug + '">' + p.name + ', ' + p.area + ' м²</option>'; }).join('') + '<option value="custom">Индивидуальный проект</option>';
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
