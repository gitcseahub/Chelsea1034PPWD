// Nonaktifkan animasi otomatis jika sistem pengguna meminta reduced motion
jQuery.fx.off = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

$(function () {
    // ----- 1. DROPDOWN NAVBAR (Event: mouseenter/mouseleave, Effect: slideDown/slideUp)
    $('.dropdown')
        .on('mouseenter', function () {
            $(this).find('.dropdown-menu').stop(true, true).slideDown(200);
        })
        .on('mouseleave', function () {
            $(this).find('.dropdown-menu').stop(true, true).slideUp(200);
        });

    // ----- 2. TAB MENU INTERAKTIF (Event: click, Effect: fadeIn)
    $('.tab-panel').hide().first().show();
    $('.tab').on('click', function () {
        const target = $(this).data('target');
        $('.tab').removeClass('active');
        $(this).addClass('active');
        $('.tab-panel').hide();
        $(target).fadeIn(300);
    });

    // ----- 3. KARTU MENU ANIMATE (Effect: animate)
    $('.menu-card')
        .css('position', 'relative')
        .on('mouseenter', function () {
            $(this).stop().animate({ top: '-6px' }, 150);
        })
        .on('mouseleave', function () {
            $(this).stop().animate({ top: '0px' }, 150);
        });

    // ----- 4. FORM PESANAN (Event: focus/blur + Toast Notification)
    $('#formPesan .field')
        .on('focus', function () {
            $(this).addClass('is-focus').removeClass('is-error');
            $(this).siblings('.hint').stop(true, true).slideDown(150);
        })
        .on('blur', function () {
            $(this).removeClass('is-focus');
            $(this).siblings('.hint').stop(true, true).slideUp(150);
            if ($(this).hasClass('wajib')) {
                $(this).toggleClass('is-error', $(this).val().trim() === '');
            }
        });

    function tampilkanToast(pesan, tipe) {
        $('#toast')
            .stop(true, true)
            .removeClass('success error')
            .addClass(tipe)
            .text(pesan)
            .fadeIn(250)
            .delay(2500)
            .fadeOut(400);
    }

    $('#formPesan').on('submit', function (e) {
        e.preventDefault();
        const nama = $('#nama').val().trim();
        const produk = $('#pilihTanaman').val();
        
        if (nama === '' || produk === '') {
            $('.wajib').each(function () {
                $(this).toggleClass('is-error', $(this).val().trim() === '');
            });
            tampilkanToast('Lengkapi nama dan pilihan produk terlebih dahulu!', 'error');
            return;
        }
        tampilkanToast('Pesanan ' + produk + ' atas nama ' + nama + ' berhasil dikirim!', 'success');
        this.reset();
        $('#formPesan input, #formPesan select').removeClass('is-error is-valid');
    });

    // ----- 5. BACK TO TOP BUTTON (Event: scroll, Effect: fadeIn/fadeOut & animate)
    const $btnTop = $('#backToTop');
    $(window).on('scroll', function () {
        if ($(this).scrollTop() > 300) {
        $btnTop.fadeIn(200);
        } else {
        $btnTop.fadeOut(200);
        }
    });

    $btnTop.on('click', function () {
        $('html, body').animate({ scrollTop: 0 }, 500);
    });

    // ----- 6. FORM VALIDATION PLUGIN & CUSTOM METHOD (Validasi 6 Input Form)
    $.validator.addMethod('nomorHp', function (value, element) {
        return this.optional(element) || /^[0-9]{10,12}$/.test(value);
    }, 'Nomor HP harus 10-12 digit angka');

    const validator = $('#formPesan').validate({
        rules: {
            nama: { required: true, minlength: 3 },
            email: { required: true, email: true },
            hp: { required: true, nomorHp: true },
            pilihTanaman: { required: true },
            alamat: { required: true, minlength: 10 }
        },
        messages: {
            nama: { required: 'Nama wajib diisi', minlength: 'Nama minimal 3 karakter' },
            email: { required: 'Email wajib diisi', email: 'Format email tidak valid' },
            hp: { required: 'Nomor WhatsApp wajib diisi' },
            pilihTanaman: { required: 'Silakan pilih produk tanaman' },
            alamat: { required: 'Alamat pengiriman wajib diisi', minlength: 'Alamat minimal 10 karakter' }
        },
        errorElement: 'div',
        errorClass: 'pesan-error',
        highlight: function (el) {
            $(el).addClass('is-error').removeClass('is-valid');
        },
        unhighlight: function (el) {
            $(el).removeClass('is-error').addClass('is-valid');
        }
    });

    // Smooth scroll untuk link internal navbar
    $('a[href^="#"]').on('click', function (e) {
        const href = $(this).attr('href');
        if (href.length < 2) return;
        const $tujuan = $(href);
        if ($tujuan.length === 0) return;
        e.preventDefault();
        $('html, body').animate({ scrollTop: $tujuan.offset().top - 60 }, 500);
    });
});