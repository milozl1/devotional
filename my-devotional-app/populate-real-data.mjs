import pg from 'pg';
const { Client } = pg;

const DATABASE_URL = process.env.SUPABASE_DB_URL;
if (!DATABASE_URL) {
  throw new Error('Missing SUPABASE_DB_URL. Add it in your local environment.');
}

const client = new Client({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const devotionals = [
  {
    day_number: 10,
    title: 'Religiunea filtrată de limbă, compasiune și puritate morală',
    bible_reference: 'Iacov 1:26-27',
    bible_text: `Dacă cineva crede că este religios, dar nu-și ține în frâu limba, înșelându-și astfel inima, religia lui este inutilă.\nReligia curată și neîntinată înaintea lui Dumnezeu Tatăl este aceasta: să-i vizitezi pe orfani și pe văduve în necazul lor și să te păstrezi pe tine însuți neîntinat de lume.`,
    text_questions: JSON.stringify([
      'Ce criteriu oferă Iacov pentru o religie autentică?',
      'De ce este limba primul indicator spiritual?',
      'De ce sunt orfanii și văduvele menționați explicit?'
    ]),
    meditation_questions: JSON.stringify([
      'Ce expresii ale mele dezvăluie lipsa controlului asupra limbii?',
      'Cine sunt „orfanii și văduvele" din realitatea mea?',
      'Care e diferența dintre religie exterioară și credință trăită în viața zilnică?'
    ]),
    prayer_focus: 'Pentru ce MULȚUMEȘTI:\nCe trebuie să MĂRTURISEȘTI:\nPentru ce trebuie să MIJLOCEȘTI:',
    is_published: true
  },
  {
    day_number: 11,
    title: 'Favoritismul contrazice Evanghelia',
    bible_reference: 'Iacov 2:1-4',
    bible_text: `Frații mei, să nu vă trăiți viața de credință în Domnul nostru Isus Cristos, Domnul gloriei, favorizând pe cineva.\nCăci, dacă intră în adunarea voastră un om cu un inel de aur, într-o haină strălucitoare, și intră și un sărac, îmbrăcat într-o haină murdară,\niar voi îi dați atenție celui ce poartă haina strălucitoare și-i spuneți: „Tu așază-te aici, pe locul acesta bun!", pe când celui sărac îi spuneți: „Tu stai acolo!" sau „Așază-te lângă scăunașul meu!",\noare n-ați făcut voi deosebire în voi înșivă și n-ați devenit voi judecători cu gânduri rele?`,
    text_questions: JSON.stringify([
      'Ce interdicție categorică dă Iacov?',
      'Ce scenariu concret oferă pentru a ilustra favoritismul?',
      'Ce fel de judecată condamnă Iacov?'
    ]),
    meditation_questions: JSON.stringify([
      'Unde reacționez preferențial în funcție de aparențe?',
      'Cine sunt cei pe care îi tratez diferit fără să-mi dau seama?',
      'Ce ar însemna ca „slava lui Cristos" să modeleze cum îi privesc pe oameni?'
    ]),
    prayer_focus: 'Pentru ce MULȚUMEȘTI:\nCe trebuie să MĂRTURISEȘTI:\nPentru ce trebuie să MIJLOCEȘTI:',
    is_published: true
  },
  {
    day_number: 12,
    title: 'Paradoxul alegerii divine',
    bible_reference: 'Iacov 2:5-7',
    bible_text: `Ascultați, frații mei preaiubiți! Nu i-a ales oare Dumnezeu pe săracii acestei lumi ca să fie bogați în credință și moștenitori ai Împărăției pe care le-a promis-o celor ce-L iubesc?\nÎnsă voi l-ați disprețuit pe cel sărac! Oare nu cei bogați vă asupresc și vă târăsc prin tribunale?\nOare nu ei blasfemiază Numele bun care este chemat peste voi?`,
    text_questions: JSON.stringify([
      'Pe cine a ales Dumnezeu în mod paradoxal?',
      'Ce contraste prezintă Iacov între bogați și săraci?',
      'Care e acuza centrală adusă bogaților?'
    ]),
    meditation_questions: JSON.stringify([
      'Ce prejudecată personală trebuie să recunosc?',
      'Cui i-am acordat valoare în baza criteriilor lumii?',
      'Cum pot cinsti pe cei pe care cultura îi ignoră?'
    ]),
    prayer_focus: 'Pentru ce MULȚUMEȘTI:\nCe trebuie să MĂRTURISEȘTI:\nPentru ce trebuie să MIJLOCEȘTI:',
    is_published: true
  },
  {
    day_number: 13,
    title: 'Judecata fără milă pentru cei fără milă',
    bible_reference: 'Iacov 2:8-11',
    bible_text: `Așadar, dacă împliniți Legea împărătească, potrivit Scripturii: „Să-l iubești pe semenul tău ca pe tine însuți", bine faceți.\nDar dacă favorizați pe cineva, comiteți un păcat și sunteți condamnați de Lege ca fiind unii care o încalcă.\nFiindcă oricine păzește întreaga Lege, dar încalcă o singură poruncă, s-a făcut vinovat de încălcarea tuturor poruncilor.\nCăci Cel Ce a spus: „Să nu comiți adulter" a spus și: „Să nu ucizi". Așadar, dacă nu comiți adulter, dar ucizi, ai devenit unul care încalcă Legea.`,
    text_questions: JSON.stringify([
      'Ce numește Iacov „legea împărătească"?',
      'De ce încălcarea unui singur punct rupe întreaga Lege?',
      'Cum definește Iacov păcatul favoritismului?'
    ]),
    meditation_questions: JSON.stringify([
      'În ce situație nu îmi iubesc aproapele ca pe mine însumi?',
      'Unde minimizez un păcat pentru că „nu e atât de grav"?',
      'Cum ar arăta o relație vindecată dacă aș aplica Legea iubirii?'
    ]),
    prayer_focus: 'Pentru ce MULȚUMEȘTI:\nCe trebuie să MĂRTURISEȘTI:\nPentru ce trebuie să MIJLOCEȘTI:',
    is_published: true
  },
  {
    day_number: 14,
    title: 'Mila triumfă asupra judecății',
    bible_reference: 'Iacov 2:12-13',
    bible_text: `În felul acesta să vorbiți și să trăiți, ca unii care urmează să fie judecați prin legea libertății.\nCăci judecata va fi fără milă față de cel ce n-a arătat milă. Mila triumfă asupra judecății.`,
    text_questions: JSON.stringify([
      'Ce înseamnă să trăim sub „legea libertății"?',
      'De ce mila triumfă asupra judecății?',
      'Ce avertisment oferă Iacov celor nemilostivi?'
    ]),
    meditation_questions: JSON.stringify([
      'Unde sunt tentat să judec rapid înainte de a asculta?',
      'Cui trebuie să extind milă acolo unde am oferit judecată?',
      'Ce schimbă în mine adevărul că Dumnezeu mi-a arătat milă?'
    ]),
    prayer_focus: 'Pentru ce MULȚUMEȘTI:\nCe trebuie să MĂRTURISEȘTI:\nPentru ce trebuie să MIJLOCEȘTI:',
    is_published: true
  },
  {
    day_number: 15,
    title: 'Credința moartă: afirmații fără acțiuni',
    bible_reference: 'Iacov 2:14-17',
    bible_text: `Frații mei, la ce folos dacă cineva spune că are credință, dar nu are fapte? Poate o astfel de credință să-l mântuiască?\nDacă un frate sau o soră sunt goi și lipsiți de hrana zilnică,\niar unul dintre voi le spune: „Duceți-vă în pace, încălziți-vă și săturați-vă!", însă nu le dă cele necesare trupului, la ce folos?\nTot astfel și credința, dacă nu are fapte este moartă în ea însăși.`,
    text_questions: JSON.stringify([
      'Ce întrebare retorică folosește Iacov pentru a provoca cititorul?',
      'Ce exemplu concret folosește pentru a arăta credința moartă?',
      'Care este concluzia din v.17?'
    ]),
    meditation_questions: JSON.stringify([
      'Unde spun „cred", dar rămân pasiv?',
      'Cine are nevoie de un gest practic din partea mea?',
      'Ce faptă simplă ar confirma credința mea astăzi?'
    ]),
    prayer_focus: 'Pentru ce MULȚUMEȘTI:\nCe trebuie să MĂRTURISEȘTI:\nPentru ce trebuie să MIJLOCEȘTI:',
    is_published: true
  },
  {
    day_number: 16,
    title: '„Arată-mi credința ta!"',
    bible_reference: 'Iacov 2:18-20',
    bible_text: `Dar va spune cineva: „Tu ai credință, iar eu am fapte. Arată-mi credința ta fără fapte, iar eu îți voi arăta credința mea prin faptele mele.\nTu crezi că Dumnezeu este Unul, și bine faci. Dar și demonii cred… și se înfioară!".\nAh, om de nimic, vrei deci să înțelegi că, fără fapte, credința este nefolositoare?`,
    text_questions: JSON.stringify([
      'Cine este interlocutorul imaginar al lui Iacov?',
      'Care este provocarea-cheie: „arată-mi credința ta…"?',
      'Cum descrie Iacov credința fără fapte?'
    ]),
    meditation_questions: JSON.stringify([
      'Ce cred despre mine, dar nu pot demonstra prin viață?',
      'Unde mă ascund în spatele ideilor teologice, fără acțiune?',
      'Ce mi-ar arăta altcineva despre credința mea dacă m-ar observa o zi?'
    ]),
    prayer_focus: 'Pentru ce MULȚUMEȘTI:\nCe trebuie să MĂRTURISEȘTI:\nPentru ce trebuie să MIJLOCEȘTI:',
    is_published: true
  },
  {
    day_number: 17,
    title: 'Credința justifică, dar ea acționează',
    bible_reference: 'Iacov 2:21-24',
    bible_text: `Avraam, tatăl nostru, n-a fost el îndreptățit prin fapte, atunci când l-a oferit pe altar pe fiul său Isaac?\nÎnțelegi? Credința lucra împreună cu faptele lui, și, prin fapte, credința lui a fost făcută desăvârșită.\nAstfel, a fost împlinită Scriptura care spune: „Avraam a crezut în Dumnezeu, și aceasta i-a fost considerată dreptate. Și el a fost numit „prietenul lui Dumnezeu".\nVedeți, așadar, că un om este îndreptățit prin fapte, și nu numai prin credință.`,
    text_questions: JSON.stringify([
      'Cum este folosit Avraam ca exemplu?',
      'Ce relație face Iacov între credință și fapte?',
      'Cum se arată justificarea în viața unui om?'
    ]),
    meditation_questions: JSON.stringify([
      'Unde îmi cer voie să am „credință", dar nu „ascultare"?',
      'Ce pas radical mi-ar confirma credința?',
      'Ce îmi spune Dumnezeu, dar amân să împlinesc?'
    ]),
    prayer_focus: 'Pentru ce MULȚUMEȘTI:\nCe trebuie să MĂRTURISEȘTI:\nPentru ce trebuie să MIJLOCEȘTI:',
    is_published: true
  },
  {
    day_number: 18,
    title: 'Viața nouă se vede în risc și acțiune',
    bible_reference: 'Iacov 2:25-26',
    bible_text: `Tot așa și prostituata Rahab: n-a fost ea îndreptățită prin fapte, atunci când i-a primit ca oaspeți pe mesageri și i-a trimis apoi pe un alt drum?\nCăci așa cum trupul fără duh este mort, tot astfel și credința fără fapte este moartă.`,
    text_questions: JSON.stringify([
      'De ce este Rahav un exemplu important?',
      'Ce risc își asumă ea prin credință?',
      'Cum explică Iacov moartea credinței fără fapte?'
    ]),
    meditation_questions: JSON.stringify([
      'Ce risc spiritual evit din frică?',
      'Unde aș putea acționa curajos pentru Dumnezeu?',
      'Ce parte a credinței mele a devenit inertă?'
    ]),
    prayer_focus: 'Pentru ce MULȚUMEȘTI:\nCe trebuie să MĂRTURISEȘTI:\nPentru ce trebuie să MIJLOCEȘTI:',
    is_published: true
  },
  {
    day_number: 19,
    title: 'Responsabilitatea celor ce învață',
    bible_reference: 'Iacov 3:1-2',
    bible_text: `Frații mei, să nu fiți mulți învățători, deoarece știți că vom primi o judecată mai aspră.\nCăci toți greșim în multe feluri. Dacă cineva nu greșește în vorbire, este un om desăvârșit, în stare să-și înfrâneze tot trupul.`,
    text_questions: JSON.stringify([
      'De ce îi avertizează Iacov pe credincioși să nu își dorească mulți să fie învățători și ce presupune acest rol în contextul comunității?',
      'Ce înseamnă afirmația că „vom fi judecați mai aspru" și cui se aplică acest standard mai ridicat?',
      'Cum leagă Iacov ideea de „a greși în multe feluri" de vorbire și de capacitatea de a controla întreaga viață?'
    ]),
    meditation_questions: JSON.stringify([
      'Ce responsabilitate spirituală port prin cuvintele mele atunci când îi influențez pe alții, chiar și fără titlul formal de „învățător"?',
      'În ce situații vorbirea mea a construit autoritate fără caracter sau a subminat adevărul pe care îl afirm?',
      'Ce ajustări ar trebui să fac în modul în care vorbesc, știind că vorbirea mea este un indicator al maturității mele spirituale?'
    ]),
    prayer_focus: 'Pentru ce MULȚUMEȘTI:\nCe trebuie să MĂRTURISEȘTI:\nPentru ce trebuie să MIJLOCEȘTI:',
    is_published: true
  },
  {
    day_number: 20,
    title: 'Cele trei imagini ale limbii',
    bible_reference: 'Iacov 3:3-6',
    bible_text: `Dacă punem zăbale în gura cailor, ca să-i facem să ne asculte, le conducem tot trupul.\nIată, chiar și corăbiile, deși sunt atât de mari și sunt duse de vânturi puternice, totuși ele sunt conduse de o cârmă foarte mică, oriunde dorește inima cârmaciului.\nTot astfel și limba: ea este o parte mică din trup, dar se laudă cu lucruri mari. Iată, un foc mic ce pădure mare aprinde!\nȘi limba este un foc. Limba, o lume a nedreptății, este așezată printre părțile trupului nostru, fiind cea care pângărește tot trupul, aprinde roata vieții și este aprinsă de focul gheenei.`,
    text_questions: JSON.stringify([
      'De ce alege Iacov trei imagini diferite (căpăstru, cârmă, scânteie) și ce au ele în comun în argumentația lui?',
      'Cum subliniază fiecare imagine disproporția dintre dimensiunea limbii și impactul ei asupra întregii vieți?',
      'Ce escaladare observi de la control (căpăstru), la direcție (cârmă), la distrugere (scânteie) în logica textului?'
    ]),
    meditation_questions: JSON.stringify([
      'În ce domeniu al vieții mele cuvintele mele funcționează ca o „cârmă", stabilind direcția relațiilor sau deciziilor mele?',
      'Ce situație recentă mi-a arătat că o „scânteie" verbală poate provoca daune mult mai mari decât am anticipat?',
      'Ce ar însemna să tratez vorbirea mea ca pe un instrument de mare putere, nu ca pe un detaliu minor?'
    ]),
    prayer_focus: 'Pentru ce MULȚUMEȘTI:\nCe trebuie să MĂRTURISEȘTI:\nPentru ce trebuie să MIJLOCEȘTI:',
    is_published: true
  }
];

async function populate() {
  await client.connect();
  console.log('✅ Connected to database');

  // Delete old seed data and progress
  await client.query('DELETE FROM user_progress');
  console.log('✅ Cleared user_progress');
  
  await client.query('DELETE FROM devotionals');
  console.log('✅ Cleared old devotionals');

  // Insert real devotionals from PDF
  // Start date: March 9, 2026 for Day 10, so Day 1 = Feb 28, 2026
  const baseDate = new Date('2026-02-28');
  for (const d of devotionals) {
    const devDate = new Date(baseDate);
    devDate.setDate(baseDate.getDate() + (d.day_number - 1));
    const dateStr = devDate.toISOString().split('T')[0];
    await client.query(
      `INSERT INTO devotionals (day_number, title, date, bible_passage_reference, bible_passage_text, text_questions, meditation_questions, prayer_text, is_published)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [d.day_number, d.title, dateStr, d.bible_reference, d.bible_text, d.text_questions, d.meditation_questions, d.prayer_focus, d.is_published]
    );
    console.log(`  📖 Ziua ${d.day_number}: ${d.title}`);
  }

  console.log(`\n✅ Total: ${devotionals.length} devoționale inserate!`);

  // Verify
  const result = await client.query('SELECT day_number, title, bible_passage_reference FROM devotionals ORDER BY day_number');
  console.log('\n📋 Verificare finală:');
  for (const row of result.rows) {
    console.log(`  Ziua ${row.day_number}: ${row.title} (${row.bible_passage_reference})`);
  }

  await client.end();
}

populate().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
