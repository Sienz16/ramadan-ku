export interface RamadanPrayer {
  id: number;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
}

export const ramadanPrayers: RamadanPrayer[] = [
  {
    id: 1,
    title: "Niat Puasa Ramadan Sebulan",
    arabic: "نَوَيْتُ صَوْمَ شَهْرِ رَمَضَانَ كُلِّهِ لِلَّهِ تَعَالَى",
    transliteration: "Nawaitu sauma shahri Ramadan kullihi lillahi ta'ala",
    translation: "Sahaja aku berpuasa sebulan Ramadan seluruhnya kerana Allah Taala.",
  },
  {
    id: 2,
    title: "Niat Puasa Harian",
    arabic: "نَوَيْتُ صَوْمَ غَدٍ عَنْ أَدَاءِ فَرْضِ رَمَضَانَ هَذِهِ السَّنَةِ لِلَّهِ تَعَالَى",
    transliteration: "Nawaitu sauma ghadin 'an adai fardi Ramadan hazihis sanati lillahi ta'ala",
    translation: "Sahaja aku berpuasa esok hari menunaikan fardu Ramadan tahun ini kerana Allah Taala.",
  },
  {
    id: 3,
    title: "Niat Solat Tarawih",
    arabic: "أُصَلِّي سُنَّةَ التَّرَاوِيحِ رَكْعَتَيْنِ لِلَّهِ تَعَالَى",
    transliteration: "Usolli sunnatat tarawihi rak'ataini lillahi ta'ala",
    translation: "Sahaja aku solat sunat tarawih dua rakaat kerana Allah Taala.",
  },
  {
    id: 4,
    title: "Doa Berbuka Puasa",
    arabic: "اللَّهُمَّ لَكَ صُمْتُ وَبِكَ آمَنْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ",
    transliteration: "Allahumma laka sumtu wa bika aamantu wa 'ala rizqika aftartu",
    translation: "Ya Allah, kerana-Mu aku berpuasa, kepada-Mu aku beriman, dan dengan rezeki-Mu aku berbuka.",
  },
];
