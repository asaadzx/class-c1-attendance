(function () {
  "use strict";

  var I18N = {
    en: {
      title: "Class C1 Attendance",
      subtitle: "Egypt-Japan KOSEN Institute — First Year",
      present: "Present",
      absent: "Absent",
      total: "Total",
      markAll: "Check all",
      clearAll: "Uncheck all",
      reset: "Reset",
      exportExcel: "Export Excel",
      downloadPng: "Download Image",
      printPdf: "Print / PDF",
      hint: "Unchecked names are counted as absent.",
      badgePresent: "Present",
      badgeAbsent: "Absent",
      attendSection: "Attended",
      absentSection: "Absent",
      noAbsent: "No absent students — everyone attended!",
      langBtn: "عربي",
      posterTitle: "Absent Students",
      posterCount: "Absent count",
      posterFooter: "Class C1 — Egypt-Japan KOSEN Institute",
      sheetTitle: "Egypt-Japan KOSEN Institute — Class C1 Attendance"
    },
    ar: {
      title: "حضور وغياب فصل C1",
      subtitle: "معهد مصر اليابان كوسن — السنة الأولى",
      present: "حاضر",
      absent: "غائب",
      total: "الإجمالي",
      markAll: "تحديد الكل",
      clearAll: "إلغاء الكل",
      reset: "إعادة تعيين",
      exportExcel: "تصدير إكسل",
      downloadPng: "تحميل صورة",
      printPdf: "طباعة / PDF",
      hint: "الأسماء غير المحددة تُحسب غائبة.",
      badgePresent: "حاضر",
      badgeAbsent: "غائب",
      attendSection: "الحاضرون",
      absentSection: "الغائبون",
      noAbsent: "لا يوجد غياب — الجميع حاضر!",
      langBtn: "English",
      posterTitle: "قائمة الغائبين",
      posterCount: "عدد الغائبين",
      posterFooter: "فصل C1 — معهد مصر اليابان كوسن",
      sheetTitle: "معهد مصر اليابان كوسن — حضور وغياب فصل C1"
    }
  };

  var BI = {
    attendSection: "Attended / الحاضرون",
    absentSection: "Absent / الغائبون",
    noAbsent: "No absent students — everyone attended! / لا يوجد غياب — الجميع حاضر!",
    posterTitle: "Absent Students / قائمة الغائبين",
    posterSub: "Class C1 — Egypt-Japan KOSEN Institute / فصل C1 — معهد مصر اليابان كوسن",
    posterCount: "Absent / الغائبون",
    posterFooter: "Egypt-Japan KOSEN Institute — Class C1 / معهد مصر اليابان كوسن — فصل C1",
    sheetTitle: "Egypt-Japan KOSEN Institute — Class C1 Attendance / معهد مصر اليابان كوسن — حضور وغياب فصل C1",
    dateLabel: "Date / التاريخ",
    presentLabel: "Present / حاضر",
    absentLabel: "Absent / غائب"
  };

  var lang = "en";
  var checked = {};
  var DATE_KEY = todayKey();
  var STORE_KEY = "c1-attendance-" + DATE_KEY;
  var FILE_BASE = DATE_KEY + "-c1Class-attendence";

  var rosterEl = document.getElementById("roster");

  function t(k) { return I18N[lang][k]; }

  function todayKey() {
    var d = new Date();
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + m + "-" + day;
  }

  function datePretty() {
    var d = new Date();
    var months_en = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var months_ar = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
    var months = lang === "ar" ? months_ar : months_en;
    return d.getDate() + " " + months[d.getMonth()] + " " + d.getFullYear();
  }

  /* ---------- state ---------- */

  function loadState() {
    var raw = null;
    try { raw = localStorage.getItem(STORE_KEY); } catch (e) { raw = null; }
    if (raw) {
      try {
        var ids = JSON.parse(raw);
        STUDENTS.forEach(function (s) { checked[s.id] = ids.indexOf(s.id) !== -1; });
        return;
      } catch (e) { /* fall through to default */ }
    }
    STUDENTS.forEach(function (s) { checked[s.id] = true; });
  }

  function saveState() {
    var ids = STUDENTS.filter(function (s) { return checked[s.id]; }).map(function (s) { return s.id; });
    try { localStorage.setItem(STORE_KEY, JSON.stringify(ids)); } catch (e) { /* private mode */ }
  }

  function absentList() { return STUDENTS.filter(function (s) { return !checked[s.id]; }); }
  function presentList() { return STUDENTS.filter(function (s) { return checked[s.id]; }); }

  /* ---------- render ---------- */

  function render() {
    rosterEl.innerHTML = "";
    STUDENTS.forEach(function (s) {
      var row = document.createElement("label");
      row.className = "row" + (checked[s.id] ? "" : " absent");
      row.dataset.id = s.id;

      var idx = document.createElement("span");
      idx.className = "idx";
      idx.textContent = s.id;

      var cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = !!checked[s.id];

      var names = document.createElement("span");
      names.className = "names";
      var en = document.createElement("span");
      en.className = "name-en";
      en.textContent = s.en;
      en.dir = "ltr";
      var ar = document.createElement("span");
      ar.className = "name-ar";
      ar.textContent = s.ar;
      ar.dir = "rtl";
      names.appendChild(en);
      names.appendChild(ar);

      var badge = document.createElement("span");
      badge.className = "badge";
      badge.textContent = checked[s.id] ? t("badgePresent") : t("badgeAbsent");

      row.appendChild(idx);
      row.appendChild(cb);
      row.appendChild(names);
      row.appendChild(badge);

      cb.addEventListener("change", function () {
        checked[s.id] = cb.checked;
        row.classList.toggle("absent", !cb.checked);
        badge.textContent = cb.checked ? t("badgePresent") : t("badgeAbsent");
        saveState();
        updateCounts();
      });

      rosterEl.appendChild(row);
    });
    updateCounts();
  }

  function updateCounts() {
    var absent = absentList().length;
    document.getElementById("presentCount").textContent = STUDENTS.length - absent;
    document.getElementById("absentCount").textContent = absent;
    document.getElementById("totalCount").textContent = STUDENTS.length;
  }

  function applyLang() {
    var html = document.documentElement;
    html.lang = lang === "ar" ? "ar" : "en";
    html.dir = lang === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      el.textContent = t(el.dataset.i18n);
    });
    document.getElementById("langBtn").textContent = t("langBtn");
    document.getElementById("dateLabel").textContent = datePretty();
    document.title = (lang === "ar" ? "حضور وغياب فصل C1" : "Class C1 Attendance");
    render();
  }

  /* ---------- Excel export ---------- */

  function exportExcel() {
    var present = presentList();
    var absent = absentList();
    var rows = [];
    function push(arr) { rows.push(arr); }

    push([
      { v: BI.sheetTitle, s: { font: { bold: true, sz: 16 } } },
      { s: {} }, { s: {} }
    ]);
    push([
      { v: BI.dateLabel + ": " + DATE_KEY, s: { font: { bold: true, sz: 12 } } },
      { v: BI.presentLabel + ": " + present.length, s: { font: { bold: true, sz: 12 } } },
      { v: BI.absentLabel + ": " + absent.length, s: { font: { bold: true, sz: 12 } } }
    ]);
    push([]);

    push([
      { v: BI.attendSection + " (" + present.length + ")", s: { font: { bold: true, sz: 14 }, fill: { patternType: "solid", fgColor: { rgb: "FFDCFCE7" } } } },
      { v: "", s: { fill: { patternType: "solid", fgColor: { rgb: "FFDCFCE7" } } } },
      { v: "", s: { fill: { patternType: "solid", fgColor: { rgb: "FFDCFCE7" } } } }
    ]);
    push([{ v: "#" }, { v: "Name (English)" }, { v: "الاسم (عربي)" }].map(function (c) {
      return { v: c.v, s: { font: { bold: true, sz: 11 } } };
    }));
    present.forEach(function (s) {
      push([{ v: s.id, t: "n" }, { v: s.en }, { v: s.ar }]);
    });

    push([]);

    var absentStyleHeader = {
      font: { bold: true, sz: 16, color: { rgb: "FF000000" } },
      fill: { patternType: "solid", fgColor: { rgb: "FFFFE600" } },
      alignment: { horizontal: "center" }
    };
    push([
      { v: BI.absentSection + " (" + absent.length + ")", s: absentStyleHeader },
      { v: "", s: absentStyleHeader },
      { v: "", s: absentStyleHeader }
    ]);
    push([{ v: "#" }, { v: "Name (English)" }, { v: "الاسم (عربي)" }].map(function (c) {
      return { v: c.v, s: { font: { bold: true, sz: 12 }, fill: { patternType: "solid", fgColor: { rgb: "FFFFF2B0" } } } };
    }));

    if (absent.length === 0) {
      var allPresentStyle = { font: { bold: true, sz: 18 }, fill: { patternType: "solid", fgColor: { rgb: "FFFFE600" } } };
      push([
        { v: BI.noAbsent, s: allPresentStyle },
        { v: "", s: allPresentStyle },
        { v: "", s: allPresentStyle }
      ]);
    } else {
      absent.forEach(function (s) {
        var cellStyle = {
          font: { bold: true, sz: 18, color: { rgb: "FF000000" } },
          fill: { patternType: "solid", fgColor: { rgb: "FFFFE600" } }
        };
        push([
          { v: s.id, t: "n", s: cellStyle },
          { v: s.en, s: cellStyle },
          { v: s.ar, s: cellStyle }
        ]);
      });
    }

    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws["!cols"] = [{ wch: 8 }, { wch: 42 }, { wch: 34 }];
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");
    XLSX.writeFile(wb, FILE_BASE + ".xlsx");
  }

  /* ---------- poster data ---------- */

  function posterModel() {
    return {
      title: BI.posterTitle,
      sub: BI.posterSub,
      date: DATE_KEY,
      countLabel: BI.posterCount,
      count: absentList().length,
      footer: BI.posterFooter,
      none: BI.noAbsent,
      items: absentList().map(function (s) {
        return { id: s.id, en: s.en, ar: s.ar };
      })
    };
  }

  /* ---------- PNG export (canvas) ---------- */

  function downloadPng() {
    var m = posterModel();
    var W = 1400;
    var PAD = 60;
    // measure height
    var headerH = 300;
    var gap = 14;
    var singleH = 110, doubleH = 170;
    var bodyH = 0;
    if (m.items.length === 0) {
      bodyH = 140;
    } else {
      m.items.forEach(function () { bodyH += singleH + gap; });
    }
    var H = headerH + bodyH + 160;

    var canvas = document.createElement("canvas");
    var scale = 2;
    canvas.width = W * scale;
    canvas.height = H * scale;
    var ctx = canvas.getContext("2d");
    ctx.scale(scale, scale);

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);

    // header
    ctx.textAlign = "center";
    ctx.fillStyle = "#000000";
    function fitFont(weight, text, maxW, startPx) {
      var px = startPx;
      ctx.font = weight + " " + px + "px 'Segoe UI', Tahoma, 'Noto Kufi Arabic', sans-serif";
      while (ctx.measureText(text).width > maxW && px > 18) {
        px -= 2;
        ctx.font = weight + " " + px + "px 'Segoe UI', Tahoma, 'Noto Kufi Arabic', sans-serif";
      }
    }
    fitFont("900", m.title, W - PAD * 2, 64);
    ctx.fillText(m.title, W / 2, 90);
    fitFont("700", m.sub, W - PAD * 2, 26);
    ctx.fillText(m.sub, W / 2, 140);

    // date badge
    var dText = m.date;
    ctx.font = "900 30px 'Segoe UI', Tahoma, sans-serif";
    var dw = ctx.measureText(dText).width + 60;
    ctx.fillStyle = "#ffe600";
    ctx.fillRect(W / 2 - dw / 2, 165, dw, 52);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 4;
    ctx.strokeRect(W / 2 - dw / 2, 165, dw, 52);
    ctx.fillStyle = "#000000";
    ctx.fillText(dText, W / 2, 201);

    // divider
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(PAD, 245);
    ctx.lineTo(W - PAD, 245);
    ctx.stroke();

    // count line
    ctx.font = "800 32px 'Segoe UI', Tahoma, 'Noto Kufi Arabic', sans-serif";
    ctx.fillText(m.countLabel + ": " + m.count, W / 2, 290);

    var y = headerH;

    if (m.items.length === 0) {
      ctx.fillStyle = "#ffe600";
      ctx.fillRect(PAD, y, W - PAD * 2, 100);
      ctx.strokeRect(PAD, y, W - PAD * 2, 100);
      ctx.fillStyle = "#000000";
      ctx.font = "900 44px 'Segoe UI', Tahoma, 'Noto Kufi Arabic', sans-serif";
      ctx.fillText(m.none, W / 2, y + 62);
      y += 120;
    } else {
      m.items.forEach(function (it) {
        var enW = 0, arW = 0;
        ctx.font = "900 40px 'Segoe UI', Tahoma, 'Noto Kufi Arabic', sans-serif";
        enW = ctx.measureText(it.en).width;
        arW = ctx.measureText(it.ar).width;
        var numW = 70;
        var stack = numW + 40 + enW + 60 + arW > (W - PAD * 2 - 40);
        var h = stack ? singleH + 55 : singleH;

        ctx.fillStyle = "#ffe600";
        ctx.fillRect(PAD, y, W - PAD * 2, h);
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 4;
        ctx.strokeRect(PAD, y, W - PAD * 2, h);

        ctx.fillStyle = "#000000";
        ctx.textAlign = "left";
        ctx.font = "900 40px 'Segoe UI', Tahoma, sans-serif";
        ctx.fillText("#" + it.id, PAD + 24, y + (stack ? 52 : 68));

        if (!stack) {
          ctx.font = "900 40px 'Segoe UI', Tahoma, 'Noto Kufi Arabic', sans-serif";
          ctx.fillText(it.en, PAD + 24 + numW + 20, y + 68);
          ctx.textAlign = "right";
          ctx.fillText(it.ar, W - PAD - 24, y + 68);
        } else {
          ctx.textAlign = "left";
          ctx.font = "900 36px 'Segoe UI', Tahoma, 'Noto Kufi Arabic', sans-serif";
          ctx.fillText(it.en, PAD + 24 + numW + 20, y + 52);
          ctx.textAlign = "right";
          ctx.fillText(it.ar, W - PAD - 24, y + 125);
        }
        y += h + gap;
      });
      y += 20;
    }

    // footer
    ctx.textAlign = "center";
    ctx.fillStyle = "#333333";
    ctx.font = "600 24px 'Segoe UI', Tahoma, 'Noto Kufi Arabic', sans-serif";
    ctx.fillText(m.footer, W / 2, H - 50);

    canvas.toBlob(function (blob) {
      downloadBlob(blob, FILE_BASE + ".png");
    }, "image/png");
  }

  function downloadBlob(blob, name) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
  }

  /* ---------- PDF (print) ---------- */

  function printPdf() {
    var m = posterModel();
    var area = document.getElementById("printArea");
    var itemsHtml;
    if (m.items.length === 0) {
      itemsHtml = '<div class="p-none">' + escapeHtml(m.none) + "</div>";
    } else {
      itemsHtml = "<ol>" + m.items.map(function (it) {
        return '<li class="p-item">' +
          '<span class="p-num">#' + it.id + "</span>" +
          '<span class="p-name-en" dir="ltr">' + escapeHtml(it.en) + "</span>" +
          '<span class="p-name-ar" dir="rtl">' + escapeHtml(it.ar) + "</span>" +
          "</li>";
      }).join("") + "</ol>";
    }

    area.innerHTML =
      '<div class="poster">' +
        '<div class="p-head">' +
          '<h1 class="p-title">' + escapeHtml(m.title) + "</h1>" +
          '<p class="p-sub">' + escapeHtml(m.sub) + "</p>" +
          '<div class="p-date">' + escapeHtml(m.date) + "</div>" +
        "</div>" +
        '<h2 class="p-section">' + escapeHtml(BI.absentSection) + "</h2>" +
        '<p class="p-count">' + escapeHtml(m.countLabel) + ": " + m.count + "</p>" +
        itemsHtml +
        '<div class="p-foot">' + escapeHtml(m.footer) + "</div>" +
      "</div>";

    var oldTitle = document.title;
    document.title = FILE_BASE;
    var restored = false;
    function restore() {
      if (restored) return;
      restored = true;
      document.title = oldTitle;
      window.removeEventListener("afterprint", restore);
    }
    window.addEventListener("afterprint", restore);
    window.print();
    setTimeout(restore, 1500);
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------- wiring ---------- */

  document.getElementById("langBtn").addEventListener("click", function () {
    lang = lang === "en" ? "ar" : "en";
    applyLang();
  });

  document.getElementById("allBtn").addEventListener("click", function () {
    STUDENTS.forEach(function (s) { checked[s.id] = true; });
    saveState();
    render();
  });

  document.getElementById("noneBtn").addEventListener("click", function () {
    STUDENTS.forEach(function (s) { checked[s.id] = false; });
    saveState();
    render();
  });

  document.getElementById("resetBtn").addEventListener("click", function () {
    try { localStorage.removeItem(STORE_KEY); } catch (e) { /* ignore */ }
    STUDENTS.forEach(function (s) { checked[s.id] = true; });
    render();
  });

  document.getElementById("excelBtn").addEventListener("click", exportExcel);
  document.getElementById("pngBtn").addEventListener("click", downloadPng);
  document.getElementById("pdfBtn").addEventListener("click", printPdf);

  document.getElementById("dateLabel").textContent = datePretty();

  loadState();
  applyLang();
})();
