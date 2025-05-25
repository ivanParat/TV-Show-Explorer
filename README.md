## TV Show Explorer

Isprobajte aplikaciju: [https://tv-show-explorer.vercel.app/](https://tv-show-explorer.vercel.app/)\
Aplikacija omogućuje istraživanje raznih TV emisija i informacija vezanih uz njih. Informacije se dobivaju s [TV Maze API](https://www.tvmaze.com/api).
#### Funkcionalnosti uključuju:
- Početna stranica - prikaz serija s današnjeg rasporeda poredanih po prosječnoj ocjeni, te mogućnost učitavanja više (infinite scroll)
- Prikaz detalja – stranica sa prikazom detalja pojedine serije, kao što su poster, naziv, žanrovi, ocjena, opis...
- Stranica sa prikazom svih sezona i epizoda serije
- Stranica sa prikazom glumaca serije i njihovim likovima
- Stranica sa prikazom detalja pojedine epizode
- Stranica sa prikazom detalja pojedinog glumca, uključujući sve uloge
- Pretraga serija
- Filtriranje serija po žanrovima na svakoj stranici s popisom serija
- SEO
- loading i not-found
- [NextAuth](https://authjs.dev/) integracija - GitHub OAuth
- API rute koje za logirane korisnike omogućuju dodavanje serija, epizoda, ili glumaca u favorite, dohvat svih favorita i brisanje stavke iz favorita
- Favoriti se prvo spremaju u cookies, te zatim u bazu podataka
- Favoriti u bazi i cookiejima se sinkroniziraju u određenim trenutcima
- Korištena baza je [Supabase](https://supabase.com/), a kao middleware se korisi [Drizzle ORM](https://orm.drizzle.team/)
- [Vercel](https://vercel.com) deployment

## Upute za lokalno pokretanje
### 1. Kloniranje repozitorija
#### HTTPS
```bash
git clone https://github.com/ivanParat/TV-Show-Explorer.git
```
#### SSH
```bash
git clone git@github.com:ivanParat/TV-Show-Explorer.git
```
#### GitHub CLI
```bash
gh repo clone ivanParat/TV-Show-Explorer
```
### 2. Ulazak u repozitorij
```bash
cd TV-Show-Explorer
```

### 3. Instaliranje dependencies
```bash
npm install
```
### 4. Postavljanje environment varijabli
Za omogućiti logiranje i trajnu pohranu favorita, potrebno je napraviti .env datoteku u root direktoriju projekta sa sljedećim varijablama:
- DATABASE_URL
- AUTH_GITHUB_ID
- AUTH_GITHUB_SECRET
- AUTH_SECRET
- AUTH_DRIZZLE_URL
- AUTH_TRUST_HOST=true
\
Više informacija o AUTH varijablama možete potražiti na [https://authjs.dev/getting-started/migrating-to-v5#environment-variables](https://authjs.dev/getting-started/migrating-to-v5#environment-variables), [https://authjs.dev/getting-started/adapters/drizzle](https://authjs.dev/getting-started/adapters/drizzle)

### 5. Pokretanje
#### Development verzija
```bash
npm run dev
```
#### Produkcijska verzija
```bash
npm run build
npm run start
```