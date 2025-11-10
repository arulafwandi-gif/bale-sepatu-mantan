// === Bale Sepatu Mantan ===
// Developer: Arul 💼

let user = { username: "kasir", password: "1234" };
let barangList = JSON.parse(localStorage.getItem("barangList")) || [];
let transaksiList = JSON.parse(localStorage.getItem("transaksiList")) || [];
let keranjang = [];

// === CEK LOGIN SAAT HALAMAN DIBUKA ===
window.onload = function () {
  const path = window.location.pathname;

  // kalau user belum login
  if (!localStorage.getItem("isLogin") && !path.includes("index.html")) {
    window.location.href = "index.html";
    return;
  }

  // kalau user sudah login, tapi masih di halaman login
  if (localStorage.getItem("isLogin") && path.includes("index.html")) {
    window.location.href = "kasir.html";
    return;
  }

  // kalau sudah login dan di halaman kasir
  if (path.includes("kasir.html")) {
    updateDaftarBarang();
    updateTabelBarang();
  }

  // kalau di halaman laporan
  if (path.includes("laporan.html")) {
    tampilkanLaporan();
  }
};

// === LOGIN ===
function login() {
  let u = document.getElementById("username").value.trim();
  let p = document.getElementById("password").value.trim();

  if (u === user.username && p === user.password) {
    localStorage.setItem("isLogin", "true");
    window.location.href = "kasir.html";
  } else {
    alert("Username atau password salah!");
  }
}

// === LOGOUT ===
function logout() {
  localStorage.removeItem("isLogin");
  window.location.href = "index.html";
}

// === TAMBAH BARANG ===
function tambahBarang() {
  let kode = document.getElementById("kodeBarang").value.trim();
  let nama = document.getElementById("namaBarang").value.trim();
  let size = document.getElementById("sizeBarang").value.trim();
  let stokAwal = parseInt(document.getElementById("stokAwal").value);
  let modal = parseInt(document.getElementById("hargaModal").value);
  let jual = parseInt(document.getElementById("hargaJual").value);

  if (!kode || !nama || !size || isNaN(stokAwal) || isNaN(modal) || isNaN(jual)) {
    alert("Lengkapi semua data barang!");
    return;
  }

  barangList.push({
    kode,
    nama,
    size,
    stokAwal,
    hargaModal: modal,
    hargaJual: jual,
    stokAkhir: stokAwal,
    laba: 0
  });

  localStorage.setItem("barangList", JSON.stringify(barangList));
  updateDaftarBarang();
  updateTabelBarang();
  clearInput();
}

// === CLEAR INPUT ===
function clearInput() {
  document.getElementById("kodeBarang").value = "";
  document.getElementById("namaBarang").value = "";
  document.getElementById("sizeBarang").value = "";
  document.getElementById("stokAwal").value = "";
  document.getElementById("hargaModal").value = "";
  document.getElementById("hargaJual").value = "";
}

// === UPDATE DROPDOWN BARANG ===
function updateDaftarBarang() {
  let select = document.getElementById("daftarBarang");
  if (!select) return;
  select.innerHTML = "";
  barangList.forEach((b, i) => {
    let option = document.createElement("option");
    option.value = i;
    option.text = `${b.kode} - ${b.nama} (Size ${b.size}, Stok: ${b.stokAkhir})`;
    select.appendChild(option);
  });
}

// === TRANSAKSI ===
function transaksi() {
  let index = document.getElementById("daftarBarang").value;
  let jumlah = parseInt(document.getElementById("jumlahBeli").value);

  if (index === "" || isNaN(jumlah) || jumlah <= 0) {
    alert("Pilih barang dan jumlah valid!");
    return;
  }

  let barang = barangList[index];
  if (jumlah > barang.stokAkhir) {
    alert("Stok tidak cukup!");
    return;
  }

  let total = barang.hargaJual * jumlah;
  let laba = (barang.hargaJual - barang.hargaModal) * jumlah;

  barang.stokAkhir -= jumlah;
  barang.laba += laba;

  transaksiList.push({
    tanggal: new Date().toLocaleString(),
    nama: barang.nama,
    size: barang.size,
    jumlah,
    hargaJual: barang.hargaJual,
    total,
    laba
  });

  localStorage.setItem("barangList", JSON.stringify(barangList));
  localStorage.setItem("transaksiList", JSON.stringify(transaksiList));
  updateKeranjang();
  updateDaftarBarang();
  updateTabelBarang();
  document.getElementById("jumlahBeli").value = "";
}

// === HAPUS BARANG ===
function hapusBarang(index) {
  if (confirm("Yakin ingin menghapus barang ini?")) {
    barangList.splice(index, 1);
    localStorage.setItem("barangList", JSON.stringify(barangList));
    updateDaftarBarang();
    updateTabelBarang();
  }
}

// === UPDATE TABEL BARANG ===
function updateTabelBarang() {
  let tabel = document.getElementById("tabelBarang");
  if (!tabel) return;

  tabel.innerHTML = `
    <tr>
      <th>Kode</th>
      <th>Nama</th>
      <th>Size</th>
      <th>Stok Awal</th>
      <th>Harga Modal</th>
      <th>Harga Jual</th>
      <th>Stok Akhir</th>
      <th>Laba</th>
      <th>Aksi</th>
    </tr>
  `;

  barangList.forEach((b, i) => {
    let row = tabel.insertRow();
    row.insertCell(0).innerText = b.kode;
    row.insertCell(1).innerText = b.nama;
    row.insertCell(2).innerText = b.size;
    row.insertCell(3).innerText = b.stokAwal;
    row.insertCell(4).innerText = "Rp" + b.hargaModal;
    row.insertCell(5).innerText = "Rp" + b.hargaJual;
    row.insertCell(6).innerText = b.stokAkhir;
    row.insertCell(7).innerText = "Rp" + b.laba;

    let aksiCell = row.insertCell(8);
    let btn = document.createElement("button");
    btn.textContent = "Hapus";
    btn.onclick = () => hapusBarang(i);
    aksiCell.appendChild(btn);
  });
}

// === KERANJANG ===
function updateKeranjang() {
  let ul = document.getElementById("keranjangList");
  if (!ul) return;
  ul.innerHTML = "";
  let total = 0;

  transaksiList.slice(-5).forEach(t => {
    let li = document.createElement("li");
    li.textContent = `${t.nama} (Size ${t.size}) x${t.jumlah} = Rp${t.total}`;
    ul.appendChild(li);
    total += t.total;
  });
  document.getElementById("totalHarga").innerText = `Total: Rp${total}`;
}

// === LAPORAN PENJUALAN ===
function tampilkanLaporan() {
  let tabel = document.getElementById("tabelLaporan");
  if (!tabel) return;

  let jenis = document.getElementById("jenisLaporan").value;
  tabel.innerHTML = `
    <tr>
      <th>Tanggal</th>
      <th>Nama Barang</th>
      <th>Size</th>
      <th>Jumlah</th>
      <th>Harga Jual</th>
      <th>Total</th>
      <th>Laba</th>
    </tr>
  `;

  let sekarang = new Date();

  transaksiList.forEach(t => {
    let tanggal = new Date(t.tanggal);
    let tampil = false;

    if (jenis === "harian" && tanggal.toDateString() === sekarang.toDateString()) tampil = true;
    if (jenis === "mingguan" && (sekarang - tanggal) / (1000 * 60 * 60 * 24) <= 7) tampil = true;
    if (jenis === "bulanan" && tanggal.getMonth() === sekarang.getMonth()) tampil = true;

    if (tampil) {
      let row = tabel.insertRow();
      row.insertCell(0).innerText = t.tanggal;
      row.insertCell(1).innerText = t.nama;
      row.insertCell(2).innerText = t.size;
      row.insertCell(3).innerText = t.jumlah;
      row.insertCell(4).innerText = "Rp" + t.hargaJual;
      row.insertCell(5).innerText = "Rp" + t.total;
      row.insertCell(6).innerText = "Rp" + t.laba;
    }
  });
}


