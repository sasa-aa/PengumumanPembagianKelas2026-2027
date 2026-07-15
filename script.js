// ==========================================
// Pengumuman Pembagian Kelas
// SMK Bhakti Nusantara Salatiga
// ==========================================

let siswaData = [];

// Membaca file CSV
async function loadCSV() {

    const loading = document.getElementById("loading");
    loading.style.display = "block";

    try {

        const response = await fetch("data.csv");

        if (!response.ok) {
            throw new Error("File data.csv tidak ditemukan.");
        }

        const text = await response.text();

        const rows = text
            .trim()
            .split(/\r?\n/)
            .slice(1);

        siswaData = rows
            .filter(row => row.trim() !== "")
            .map(row => {

                // Menghapus tanda kutip jika ada
                row = row.replace(/^"|"$/g, "");

                const cols = row.split(";");

                return {

                    kelas: (cols[0] || "").trim(),

                    nis: (cols[1] || "").trim(),

                    nama: (cols[2] || "")
                        .replace(/^"|"$/g, "")
                        .trim()

                };

            });

        console.log("Jumlah siswa :", siswaData.length);

    } catch (err) {

        console.error(err);

        document.getElementById("results").innerHTML = `

            <div class="not-found">

                <h2>⚠️ Gagal Memuat Data</h2>

                <p>${err.message}</p>

            </div>

        `;

    }

    loading.style.display = "none";

}



// Fungsi pencarian

function cariSiswa() {

    const keyword = document
        .getElementById("searchInput")
        .value
        .trim()
        .toLowerCase();

    const results = document.getElementById("results");

    if (keyword === "") {

        results.innerHTML = `

        <div class="welcome-card">

            <div class="icon">🎓</div>

            <h2>Selamat Datang</h2>

            <p>

            Silakan masukkan nama siswa

            untuk melihat hasil pembagian kelas.

            </p>

        </div>

        `;

        return;

    }


    // Pisahkan kata yang diketik

    const kata = keyword.split(/\s+/);


    // Cari nama yang mengandung semua kata

    let hasil = siswaData.filter(s => {

        const nama = s.nama.toLowerCase();

        return kata.every(k => nama.includes(k));

    });


    if (hasil.length === 0) {

        results.innerHTML = `

        <div class="not-found">

            <h2>❌ Data Tidak Ditemukan</h2>

            <p>

            Nama siswa tidak ditemukan.

            </p>

            <p>

            Coba ketik nama depan atau nama belakang.

            </p>

        </div>

        `;

        return;

    }


    // Prioritaskan yang paling sesuai

    hasil.sort((a, b) => {

        const na = a.nama.toLowerCase();

        const nb = b.nama.toLowerCase();

        const sa = na.startsWith(keyword);

        const sb = nb.startsWith(keyword);

        if (sa && !sb) return -1;

        if (!sa && sb) return 1;

        return na.length - nb.length;

    });


    const siswa = hasil[0];


    results.innerHTML = `

    <div class="result-card">

        <div class="icon">

            🎓

        </div>

        <h2>${siswa.nama}</h2>

        <div class="result-item">

            <div class="label">

                🆔 Nomor Induk Siswa

            </div>

            <div class="value">

                ${siswa.nis}

            </div>

        </div>

        <div class="result-item">

            <div class="label">

                🏫 Kelas

            </div>

            <div class="value">

                ${siswa.kelas}

            </div>

        </div>

    </div>

    `;

}



// Event

document.addEventListener("DOMContentLoaded", async () => {

    await loadCSV();


    // Tombol Cari

    document

        .getElementById("searchBtn")

        .addEventListener("click", cariSiswa);


    // Tombol Enter

    document

        .getElementById("searchInput")

        .addEventListener("keydown", function (e) {

            if (e.key === "Enter") {

                cariSiswa();

            }

        });

});
