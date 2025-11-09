let user = { username: "kasir", password: "1234" };
let barangList = JSON.parse(localStorage.getItem("barangList")) || [];
let keranjang = [];

// Cek status login saat halaman dibuka
window.onload = function() {
  let statusLogin = localStorage.getItem("isLogin");
  if (statusLogin === "true") {
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("kasirPage").style.display = "block";
    updateDaftarBarang();
    updateTabelBarang();
  }
};

function login() {
  let u = document.getElementById("username").value;
  let p = document.getElementById("password").value;

  if (u === user.username && p === user.password) {
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("kasirPage").style.display = "block";
    updateDaftarBarang();
    updateTabelBarang();
  } else {
    alert("Username atau password salah!");
  }
}

function logout() {
  document.getElementById("kasirPage").style.display = "none";
  document.getElementById("loginPage").style.display = "block";
}

function tambahBarang() {
  let kode = document.getElementById("kodeBarang").value.trim();
  let nama = document.getElementById("namaBarang").value.trim();
  let stokAwal = parseInt(document.getElementById("stokAwal").value);
  let modal = parseInt(document.getElementById("hargaModal").value);
  let jual = parseInt(document.getElementById("hargaJual").value);

  if (!kode || !nama || isNaN(stokAwal) || isNaN(modal) || isNaN(jual)) {
    alert("Lengkapi semua data barang!");
    return;
  }

  barangList.push({
    kode,
    nama,
    stokAwal,
    hargaModal: modal,
    hargaJual: jual,
    stokAkhir: stokAwal,
    laba: 0
  });

  localStorage.setItem("barangList", JSON.stringify(barangList));
  clearInput();
  updateDaftarBarang();
  updateTabelBarang();
}

function clearInput() {
  document.getElementById("kodeBarang").value = "";
  document.getElementById("namaBarang").value = "";
  document.getElementById("stokAwal").value = "";
  document.getElementById("hargaModal").value = "";
  document.getElementById("hargaJual").value = "";
}

function updateDaftarBarang() {
  let select = document.getElementById("daftarBarang");
  select.innerHTML = "";
  barangList.forEach((b, i) => {
    let option = document.createElement("option");
    option.value = i;
    option.text = `${b.kode} - ${b.nama} (Stok: ${b.stokAkhir})`;
    select.appendChild(option);
  });
}

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

  keranjang.push({
    nama: barang.nama,
    jumlah,
    total
  });

  localStorage.setItem("barangList", JSON.stringify(barangList));
  updateKeranjang();
  updateTabelBarang();
  updateDaftarBarang();
}

function hapusBarang(index) {
  if (confirm("Yakin ingin menghapus barang ini?")) {
    barangList.splice(index, 1);
    localStorage.setItem("barangList", JSON.stringify(barangList));
    updateDaftarBarang();
    updateTabelBarang();
  }
}

function updateKeranjang() {
  let ul = document.getElementById("keranjangList");
  ul.innerHTML = "";
  let total = 0;
  keranjang.forEach(item => {
    let li = document.createElement("li");
    li.textContent = `${item.nama} x${item.jumlah} = Rp${item.total}`;
    ul.appendChild(li);
    total += item.total;
  });
  document.getElementById("totalHarga").innerText = `Total: Rp${total}`;
}

function updateTabelBarang() {
  let tabel = document.getElementById("tabelBarang");
  tabel.innerHTML = `
    <tr>
      <th>Kode</th>
      <th>Nama</th>
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
    row.insertCell(2).innerText = b.stokAwal;
    row.insertCell(3).innerText = "Rp" + b.hargaModal;
    row.insertCell(4).innerText = "Rp" + b.hargaJual;
    row.insertCell(5).innerText = b.stokAkhir;
    row.insertCell(6).innerText = "Rp" + b.laba;

    let aksiCell = row.insertCell(7);
    let btn = document.createElement("button");
    btn.textContent = "Hapus";
    btn.style.background = "red";
    btn.style.color = "white";
    btn.onclick = () => hapusBarang(i);
    aksiCell.appendChild(btn);
  });
}




