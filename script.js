/* ============================================================
   WARUNG ICE CREAM - JQUERY SCRIPT
   Praktikum Pemrograman Web Dasar
   (sudah termasuk Latihan 1, 2, dan 3)
   ============================================================ */

$(document).ready(function() {

  /* =====================================================
     1. DATA PRODUK
     ===================================================== */
  const produkData = [
    { id: 1, nama: 'Es Krim Cokelat', harga: 15000, kategori: 'es-krim', icon: '🍫', desc: 'Cokelat premium lembut', badge: 'Best Seller', badgeType: 'hot' },
    { id: 2, nama: 'Es Krim Strawberry', harga: 15000, kategori: 'es-krim', icon: '🍓', desc: 'Stroberi segar asli', badge: 'Favorit', badgeType: '' },
    { id: 3, nama: 'Es Krim Vanilla', harga: 13000, kategori: 'es-krim', icon: '🍦', desc: 'Vanilla klasik creamy', badge: '', badgeType: '' },
    { id: 4, nama: 'Es Krim Mangga', harga: 16000, kategori: 'es-krim', icon: '🥭', desc: 'Mangga manis tropis', badge: 'Baru', badgeType: '' },
    { id: 5, nama: 'Sundae Cokelat', harga: 25000, kategori: 'sundae', icon: '🍨', desc: 'Sundae dengan topping cokelat', badge: 'Best Seller', badgeType: 'hot' },
    { id: 6, nama: 'Sundae Keju', harga: 27000, kategori: 'sundae', icon: '🧀', desc: 'Sundae topping keju melimpah', badge: '', badgeType: '' },
    { id: 7, nama: 'Sundae Buah', harga: 28000, kategori: 'sundae', icon: '🍧', desc: 'Sundae dengan buah segar', badge: 'Favorit', badgeType: '' },
    { id: 8, nama: 'Milkshake Cokelat', harga: 20000, kategori: 'minuman', icon: '🥤', desc: 'Milkshake cokelat dingin', badge: '', badgeType: '' },
    { id: 9, nama: 'Milkshake Strawberry', harga: 20000, kategori: 'minuman', icon: '🥛', desc: 'Milkshake stroberi segar', badge: 'Baru', badgeType: '' },
    { id: 10, nama: 'Es Teh Manis', harga: 8000, kategori: 'minuman', icon: '🧊', desc: 'Es teh manis segar', badge: '', badgeType: '' },
    { id: 11, nama: 'Es Jeruk', harga: 10000, kategori: 'minuman', icon: '🍊', desc: 'Es jeruk peras asli', badge: '', badgeType: '' },
    { id: 12, nama: 'Float Ice Cream', harga: 22000, kategori: 'minuman', icon: '🍹', desc: 'Minuman soda dengan es krim', badge: 'Best Seller', badgeType: 'hot' }
  ];

  /* =====================================================
     2. STATE (Variabel Global)
     ===================================================== */
  let cart = [];              // Array keranjang belanja
  let currentFilter = 'all';  // Filter kategori aktif
  let searchKeyword = '';     // Kata kunci pencarian
  let totalAkhir = 0;         // Total setelah diskon (dipakai saat checkout)

  /* =====================================================
     3. FUNGSI RENDER PRODUK
     ===================================================== */
  function renderProduk() {
    const $grid = $('#produkGrid');
    $grid.empty();

    // Filter data berdasarkan kategori & pencarian
    const filtered = produkData.filter(function(p) {
      const matchKategori = currentFilter === 'all' || p.kategori === currentFilter;
      const matchSearch = p.nama.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                          p.desc.toLowerCase().includes(searchKeyword.toLowerCase());
      return matchKategori && matchSearch;
    });

    // Jika tidak ada hasil
    if (filtered.length === 0) {
      $grid.html(`
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: #bbb;">
          <i class="fas fa-search" style="font-size: 3.5rem; color: #ffe4ec; margin-bottom: 20px; display: block;"></i>
          <h3 style="color: #999; font-weight: 600; margin-bottom: 8px;">Produk tidak ditemukan</h3>
          <p style="font-size: 0.9rem;">Coba kata kunci atau kategori lain</p>
        </div>
      `);
      return;
    }

    // Render setiap produk
    filtered.forEach(function(p) {
      const badgeHtml = p.badge
        ? `<div class="produk-badge ${p.badgeType}">${p.badge}</div>`
        : '';

      const card = `
        <div class="produk-card" data-id="${p.id}" data-kategori="${p.kategori}">
          ${badgeHtml}
          <div class="produk-img">${p.icon}</div>
          <div class="produk-info">
            <h3>${p.nama}</h3>
            <p class="desc">${p.desc}</p>
            <div class="produk-footer">
              <div class="produk-price">
                Rp ${p.harga.toLocaleString('id-ID')}
                <small>per porsi</small>
              </div>
              <button class="btn-add-cart" data-id="${p.id}" title="Tambah ke keranjang">
                <i class="fas fa-plus"></i>
              </button>
            </div>
          </div>
        </div>
      `;
      $grid.append(card);
    });
  }

  /* =====================================================
     4. EVENT: FILTER KATEGORI (Navbar)
     ===================================================== */
  $('.nav-link').click(function() {
    $('.nav-link').removeClass('active');
    $(this).addClass('active');
    currentFilter = $(this).data('filter');

    // Sync dengan tombol filter
    $('.filter-btn').removeClass('active');
    $(`.filter-btn[data-cat="${currentFilter}"]`).addClass('active');

    renderProduk();
  });

  /* =====================================================
     5. EVENT: FILTER KATEGORI (Tombol)
     ===================================================== */
  $('.filter-btn').click(function() {
    $('.filter-btn').removeClass('active');
    $(this).addClass('active');
    currentFilter = $(this).data('cat');

    // Sync dengan menu navbar
    $('.nav-link').removeClass('active');
    $(`.nav-link[data-filter="${currentFilter}"]`).addClass('active');

    renderProduk();
  });

  /* =====================================================
     6. EVENT: PENCARIAN REAL-TIME
     ===================================================== */
  $('#searchProduk').on('input', function() {
    searchKeyword = $(this).val();
    renderProduk();
  });

  /* =====================================================
     7. EVENT: TAMBAH KE KERANJANG
     ===================================================== */
  $(document).on('click', '.btn-add-cart', function(e) {
    e.stopPropagation();
    const id = $(this).data('id');
    const produk = produkData.find(p => p.id === id);
    if (!produk) return;

    // Cek apakah produk sudah ada di keranjang
    const existing = cart.find(item => item.id === id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        id: produk.id,
        nama: produk.nama,
        harga: produk.harga,
        icon: produk.icon,
        qty: 1
      });
    }

    updateCartUI();
    showToast(`${produk.icon} ${produk.nama} ditambahkan!`);

    // Animasi tombol
    $(this).css('transform', 'rotate(90deg) scale(1.3)');
    setTimeout(() => $(this).css('transform', ''), 300);

    // Animasi badge
    $('#cartBadge').css('transform', 'scale(1.4)');
    setTimeout(() => $('#cartBadge').css('transform', 'scale(1)'), 200);
  });

  /* =====================================================
     8. FUNGSI UPDATE UI KERANJANG
        (sudah termasuk LATIHAN 1: diskon 10%)
     ===================================================== */
  function updateCartUI() {
    const $cartItems = $('#cartItems');
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    let totalHarga = cart.reduce((sum, item) => sum + (item.harga * item.qty), 0);

    // Update badge keranjang
    $('#cartBadge').text(totalQty);

    // Update total harga
    $('#cartTotal').text('Rp ' + totalHarga.toLocaleString('id-ID'));

    // LATIHAN 1: diskon 10% jika total > Rp 100.000
    if (totalHarga > 100000) {
      const diskon = totalHarga * 0.1;
      totalHarga -= diskon;
      $('#cartTotal').html(`
        <small style="display:block;text-decoration:line-through;color:#999;font-size:0.8rem;">Rp ${(totalHarga + diskon).toLocaleString('id-ID')}</small>
        Rp ${totalHarga.toLocaleString('id-ID')}
      `);
    }

    // Simpan total akhir (setelah diskon) untuk dipakai saat checkout
    totalAkhir = totalHarga;

    // Jika kosong
    if (cart.length === 0) {
      $cartItems.html(`
        <div class="cart-empty">
          <i class="fas fa-shopping-cart"></i>
          <p>Keranjang masih kosong</p>
          <small>Yuk pilih es krim dulu!</small>
        </div>
      `);
      return;
    }

    // Render item keranjang
    let html = '';
    cart.forEach(function(item) {
      html += `
        <div class="cart-item" data-id="${item.id}">
          <div class="cart-item-icon">${item.icon}</div>
          <div class="cart-item-info">
            <h5>${item.nama}</h5>
            <div class="price">Rp ${(item.harga * item.qty).toLocaleString('id-ID')}</div>
            <div class="qty-control">
              <button class="qty-btn" data-action="minus" data-id="${item.id}">−</button>
              <span class="qty-value">${item.qty}</span>
              <button class="qty-btn" data-action="plus" data-id="${item.id}">+</button>
            </div>
          </div>
          <button class="cart-item-remove" data-id="${item.id}" title="Hapus">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;
    });
    $cartItems.html(html);
  }

  /* =====================================================
     9. EVENT: KONTROL QTY (Plus/Minus)
     ===================================================== */
  $(document).on('click', '.qty-btn', function() {
    const action = $(this).data('action');
    const id = $(this).data('id');
    const item = cart.find(i => i.id === id);
    if (!item) return;

    if (action === 'plus') {
      item.qty += 1;
    } else if (action === 'minus') {
      item.qty -= 1;
      if (item.qty <= 0) {
        cart = cart.filter(i => i.id !== id);
      }
    }
    updateCartUI();
  });

  /* =====================================================
     10. EVENT: HAPUS ITEM DARI KERANJANG
     ===================================================== */
  $(document).on('click', '.cart-item-remove', function() {
    const id = $(this).data('id');
    const item = cart.find(i => i.id === id);
    if (item) {
      showToast(`${item.icon} ${item.nama} dihapus dari keranjang`);
    }
    cart = cart.filter(i => i.id !== id);
    updateCartUI();
  });

  /* =====================================================
     11. EVENT: BUKA/TUTUP KERANJANG
     ===================================================== */
  $('#cartBtn').click(function() {
    $('#cartSidebar').addClass('open');
    $('#cartOverlay').fadeIn(300);
  });

  $('#cartClose, #cartOverlay').click(function() {
    $('#cartSidebar').removeClass('open');
    $('#cartOverlay').fadeOut(300);
  });

  /* =====================================================
     12. LATIHAN 2: SIMPAN RIWAYAT KE LOCALSTORAGE
     ===================================================== */
  function simpanRiwayat(total, qty) {
    try {
      const riwayat = JSON.parse(localStorage.getItem('riwayat')) || [];
      riwayat.push({ tanggal: new Date().toISOString(), total, qty });
      localStorage.setItem('riwayat', JSON.stringify(riwayat));
    } catch (e) {
      console.log('localStorage tidak tersedia');
    }
  }

  // Tampilkan jumlah transaksi yang tersimpan di keranjang
  function tampilRiwayat() {
    let riwayat = [];
    try {
      riwayat = JSON.parse(localStorage.getItem('riwayat')) || [];
    } catch (e) {}
    $('#riwayatInfo').text(riwayat.length > 0 ? `🧾 ${riwayat.length} transaksi tersimpan` : '');
  }

  /* =====================================================
     13. LATIHAN 3: CHECKOUT DENGAN MODAL DATA PEMBELI
     ===================================================== */
  // Klik Checkout: buka modal (jika keranjang tidak kosong)
  $('#btnCheckout').click(function() {
    if (cart.length === 0) {
      showToast('❌ Keranjang masih kosong!');
      return;
    }
    $('#modalTotal').text('Rp ' + totalAkhir.toLocaleString('id-ID'));
    $('.field-error').hide();
    $('#modalOverlay').fadeIn(250);
  });

  // Tombol Batal: tutup modal, isian tetap
  $('#btnBatal').click(function() {
    $('#modalOverlay').fadeOut(200);
  });

  // Submit form pembeli: validasi, lalu proses checkout
  $('#formPembeli').submit(function(e) {
    e.preventDefault();

    const nama = $('#inputNama').val().trim();
    const alamat = $('#inputAlamat').val().trim();
    const hp = $('#inputHp').val().trim();
    let valid = true;

    if (nama.length < 3) { $('#errNama').show(); valid = false; }
    else { $('#errNama').hide(); }

    if (alamat.length < 10) { $('#errAlamat').show(); valid = false; }
    else { $('#errAlamat').hide(); }

    if (!/^[0-9]{10,13}$/.test(hp)) { $('#errHp').show(); valid = false; }
    else { $('#errHp').hide(); }

    if (!valid) return;

    const total = totalAkhir;
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);

    // Animasi loading
    const $btn = $('#btnKonfirmasi');
    $btn.html('<i class="fas fa-spinner fa-spin"></i> Memproses...').prop('disabled', true);

    setTimeout(function() {
      $btn.html('<i class="fas fa-check-circle"></i> Konfirmasi Pesanan').prop('disabled', false);

      // Latihan 2: simpan riwayat
      simpanRiwayat(total, totalQty);
      tampilRiwayat();

      // Reset keranjang & form
      cart = [];
      updateCartUI();
      $('#formPembeli').trigger('reset');

      // Tutup modal & sidebar
      $('#modalOverlay').fadeOut(200);
      $('#cartSidebar').removeClass('open');
      $('#cartOverlay').fadeOut(300);

      showToast(`✅ Terima kasih, ${nama}! ${totalQty} item · Rp ${total.toLocaleString('id-ID')}`);
    }, 1500);
  });

  /* =====================================================
     14. FUNGSI TOAST NOTIFICATION
     ===================================================== */
  let toastTimer;
  function showToast(message) {
    clearTimeout(toastTimer);
    $('#toastMsg').text(message);
    $('#toast').addClass('show');
    toastTimer = setTimeout(function() {
      $('#toast').removeClass('show');
    }, 2500);
  }

  /* =====================================================
     15. EVENT: HAMBURGER MENU (Mobile)
     ===================================================== */
  $('#hamburger').click(function() {
    $('#navMenu').toggleClass('show');
    const icon = $(this).find('i');
    if ($('#navMenu').hasClass('show')) {
      icon.removeClass('fa-bars').addClass('fa-times');
    } else {
      icon.removeClass('fa-times').addClass('fa-bars');
    }
  });

  // Tutup menu saat link diklik (mobile)
  $('.nav-link').click(function() {
    if (window.innerWidth <= 768) {
      $('#navMenu').removeClass('show');
      $('#hamburger').find('i').removeClass('fa-times').addClass('fa-bars');
    }
  });

  /* =====================================================
     16. INISIALISASI APLIKASI
     ===================================================== */
  renderProduk();
  updateCartUI();
  tampilRiwayat();

  // Log ke console
  console.log('%c🍦 Warung Ice Cream - Siap!', 'color:#ff6b9d;font-size:16px;font-weight:bold;');
  console.log('%cTotal produk: ' + produkData.length, 'color:#2d1b3d;font-size:12px;');
});