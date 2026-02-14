export interface Dua {
  id: number;
  arabic: string;
  transliteration: string;
  translation: string;
  reference?: string;
}

export const dailyDuas: Dua[] = [
  {
    id: 1,
    arabic: "اللَّهُمَّ أَعِنِّي عَلَى صِيَامِهِ وَقِيَامِهِ",
    transliteration: "Allahumma a'innii 'alaa siyaamihi wa qiyaamih",
    translation: "O Allah, assist me in fasting it (Ramadan) and standing in prayer during it",
    reference: "Ibn Majah",
  },
  {
    id: 2,
    arabic: "اللَّهُمَّ بَارِكْ لَنَا فِي رَجَبٍ وَشَعْبَانَ وَبَلِّغْنَا رَمَضَانَ",
    transliteration: "Allahumma baarik lana fi Rajab wa Sha'ban wa ballighna Ramadan",
    translation: "O Allah, bless us in Rajab and Sha'ban and enable us to reach Ramadan",
  },
  {
    id: 3,
    arabic: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
    transliteration: "Allahumma innaka 'afuwwun tuhibbul 'afwa fa'fu 'anni",
    translation: "O Allah, You are the One who pardons, and You love to pardon, so pardon me",
    reference: "Tirmidhi",
  },
  {
    id: 4,
    arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ",
    transliteration: "SubhanAllahi wa bihamdihi, SubhanAllahil 'Adheem",
    translation: "Glory be to Allah and praise be to Him, glory be to Allah the Magnificent",
  },
  {
    id: 5,
    arabic: "اللَّهُمَّ اجْعَلْ صِيَامِي فِيهِ صِيَامَ الصَّائِمِينَ",
    transliteration: "Allahumma-j'al siyaami fihi siyaamas-saa'imeen",
    translation: "O Allah, make my fast in it the fast of those who fast sincerely",
  },
  {
    id: 6,
    arabic: "رَبِّ اغْفِرْ وَارْحَمْ وَتَجَاوَزْ عَمَّا تَعْلَمُ",
    transliteration: "Rabbighfir warham wa tajawaz 'amma ta'lam",
    translation: "My Lord, forgive, have mercy, and overlook what You know",
  },
  {
    id: 7,
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْجَنَّةَ وَأَعُوذُ بِكَ مِنَ النَّارِ",
    transliteration: "Allahumma inni as'alukal Jannata wa a'udhu bika minan-Naar",
    translation: "O Allah, I ask You for Paradise and seek refuge from the Fire",
  },
  {
    id: 8,
    arabic: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ",
    transliteration: "La ilaha illAllahu wahdahu la sharika lahu",
    translation: "There is no god but Allah alone, with no partner",
  },
  {
    id: 9,
    arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ",
    transliteration: "Allahumma salli 'ala Muhammadin wa 'ala aali Muhammad",
    translation: "O Allah, send blessings upon Muhammad and upon the family of Muhammad",
  },
  {
    id: 10,
    arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
    transliteration: "HasbunAllahu wa ni'mal Wakeel",
    translation: "Allah is sufficient for us, and He is the best Disposer of affairs",
    reference: "Quran 3:173",
  },
  {
    id: 11,
    arabic: "اللَّهُمَّ أَجِرْنِي مِنَ النَّارِ",
    transliteration: "Allahumma ajirni minan-Naar",
    translation: "O Allah, save me from the Fire",
  },
  {
    id: 12,
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً",
    transliteration: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan",
    translation: "Our Lord, give us good in this world and good in the Hereafter",
    reference: "Quran 2:201",
  },
  {
    id: 13,
    arabic: "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ",
    transliteration: "Astaghfirullahal-'Adheem alladhi la ilaha illa Huwa",
    translation: "I seek forgiveness from Allah the Magnificent, besides whom there is no god",
  },
  {
    id: 14,
    arabic: "اللَّهُمَّ اغْفِرْ لِي ذَنْبِي كُلِّهُ دِقَّهُ وَجِلَّهُ",
    transliteration: "Allahummaghfir li dhanbi kullihi diqqahu wa jillahu",
    translation: "O Allah, forgive me all my sins, the small and the great",
  },
  {
    id: 15,
    arabic: "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ",
    transliteration: "SubhanakAllahumma wa bihamdika ashhadu an la ilaha illa Anta",
    translation: "Glory be to You, O Allah, and praise. I bear witness that there is no god but You",
  },
  {
    id: 16,
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ",
    transliteration: "Allahumma inni a'udhu bika minal-hammi wal-hazan",
    translation: "O Allah, I seek refuge in You from worry and sorrow",
  },
  {
    id: 17,
    arabic: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
    transliteration: "La hawla wa la quwwata illa billah",
    translation: "There is no power and no strength except with Allah",
  },
  {
    id: 18,
    arabic: "اللَّهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ",
    transliteration: "Allahummahdini fiman hadayt",
    translation: "O Allah, guide me among those whom You have guided",
  },
  {
    id: 19,
    arabic: "رَضِيتُ بِاللَّهِ رَبًّا وَبِالْإِسْلَامِ دِينًا",
    transliteration: "Radeetu billahi Rabban wa bil-Islami deena",
    translation: "I am pleased with Allah as Lord, and with Islam as religion",
  },
  {
    id: 20,
    arabic: "اللَّهُمَّ يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ",
    transliteration: "Allahumma ya Muqallibal-quloob thabbit qalbi 'ala deenik",
    translation: "O Allah, O Turner of hearts, make my heart firm upon Your religion",
  },
  {
    id: 21,
    arabic: "مَا شَاءَ اللَّهُ لَا قُوَّةَ إِلَّا بِاللَّهِ",
    transliteration: "Masha'Allahu la quwwata illa billah",
    translation: "What Allah wills, there is no power except with Allah",
  },
  {
    id: 22,
    arabic: "اللَّهُمَّ اغْفِرْ لِوَالِدَيَّ وَارْحَمْهُمَا",
    transliteration: "Allahummaghfir liwalidayya warhamhuma",
    translation: "O Allah, forgive my parents and have mercy upon them",
  },
  {
    id: 23,
    arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ",
    transliteration: "Bismillahil-ladhi la yadurru ma'asmihi shay'un",
    translation: "In the name of Allah, with whose name nothing can harm",
  },
  {
    id: 24,
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا",
    transliteration: "Allahumma inni as'aluka 'ilman naafi'an wa rizqan tayyiban",
    translation: "O Allah, I ask You for beneficial knowledge and good provision",
  },
  {
    id: 25,
    arabic: "تَوَكَّلْتُ عَلَى اللَّهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
    transliteration: "Tawakkaltu 'alAllahi wa la hawla wa la quwwata illa billah",
    translation: "I put my trust in Allah, and there is no power nor strength except with Allah",
  },
  {
    id: 26,
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ",
    transliteration: "Allahumma inni a'udhu bika minal-kufri wal-faqri",
    translation: "O Allah, I seek refuge in You from disbelief and poverty",
  },
  {
    id: 27,
    arabic: "اللَّهُمَّ أَعْطِنَا فِي الدُّنْيَا زُهْدًا وَفِي الْآخِرَةِ تَوْفِيقًا",
    transliteration: "Allahumma a'tina fid-dunya zuhdan wa fil-akhirati tawfeeqan",
    translation: "O Allah, grant us detachment in this world and success in the Hereafter",
  },
  {
    id: 28,
    arabic: "سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلَهَ إِلَّا اللَّهُ",
    transliteration: "SubhanAllah walhamdulillah wa la ilaha illAllah",
    translation: "Glory be to Allah, praise be to Allah, there is no god but Allah",
  },
  {
    id: 29,
    arabic: "اللَّهُمَّ ارْزُقْنَا تَوْفِيقَ الِاقْتِدَاءِ بِالنَّبِيِّ",
    transliteration: "Allahumma urzuqna tawfeeqal-iqtida'i bin-Nabiyy",
    translation: "O Allah, grant us the success of following the Prophet",
  },
  {
    id: 30,
    arabic: "أَللَّهُمَّ يَا فَتَّاحُ افْتَحْ لَنَا فَتْحًا مُبِينًا",
    transliteration: "Allahumma ya Fattahu iftah lana fathan mubeena",
    translation: "O Allah, O Opener, open for us a clear opening",
  },
];

export function getDailyDua(): Dua {
  const today = new Date();
  const dayOfMonth = today.getDate();
  const index = (dayOfMonth - 1) % dailyDuas.length;
  return dailyDuas[index];
}
