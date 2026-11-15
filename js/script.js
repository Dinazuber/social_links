/* =====================================================
   CONFIGURATION : modifie tout ici
   ===================================================== */
const CONFIG = {
  name: "Kageina",
  bio: "Hellooo, I'm Kageina ✨",

  // Images et fond
  avatar: "assets/img/avatar.png",
  background: "assets/img/background.gif",

  // Icônes rondes sous ton nom
  socials: [
    { icon: "assets/img/youtube.webp", url: "https://www.youtube.com/@kageina_805", label: "YouTube" },
    { icon: "assets/img/github.png", url: "https://github.com/Dinazuber",          label: "GitHub" },
    { icon: "assets/img/spotify.png", url: "https://open.spotify.com/user/twr1h5270w8h3r41knkmibx5u", label: "Spotify" },
  ],

  // Liens (colonne de droite)
  links: [
    { label: "Tiktok", url: "https://www.tiktok.com/@kageina_alberich", icon: "assets/img/tiktok.png" },
    { url: "https://discord.com/users/626441904573382700", label: "Discord", icon: "assets/img/discord.png" },
    // Connexions Discord
    // Connexions Discord
    { label: "Steam", url: "https://steamcommunity.com/profiles/76561199177114819/", icon: "assets/img/steam.png" },
    { label: "Riot Games", text: "Kageina#1606", icon: "assets/img/riot_games.png" }, // pas de url : affiche juste le texte
  ],
  
  discord: {
    id: "626441904573382700",   // les 18-19 chiffres copiés à l'étape 1
    showCard: true,         // mets false pour masquer la carte
    fallbackStatus: "It's dangerous to go alone!", // affiché si aucun statut Discord n'est défini
  },

  footer: "Fait avec ♥",
  openInNewTab: true,

  // ===== MUSIQUE =====
  music: {
    mode: "local",                   // "local" = ta playlist | "spotify" = embed Spotify
    icon: "assets/img/icon.png",     // icône affichée à côté du titre
    volume: 0.4,                     // entre 0 et 1
    autoplay: true,                  // tente de lancer au chargement (bloqué par la plupart des navigateurs)

    // Ta playlist locale : ajoute, retire ou réordonne les morceaux ici
    tracks: [
      { title: "Title Theme",  file: "assets/audio/ocarina.m4a" },
      { title: "Princess Zelda", file: "assets/audio/Princess_Zelda.mp3" },
      { title: "Kokiri Forest", file: "assets/audio/Kokiri_Forest.mp3" },
    ],

    // Mode "spotify" : URL embed uniquement (pas de balise <iframe>)
    spotifyEmbed: "",
  },
};

/* ===================================================== */

function render() {
  document.title = CONFIG.name;
  document.getElementById("name").textContent = CONFIG.name;
  document.getElementById("bio").textContent = CONFIG.bio;
  document.getElementById("footer").textContent = CONFIG.footer;

  document.getElementById("bg").src = CONFIG.background;

  const avatar = document.getElementById("avatar");
  avatar.src = CONFIG.avatar;
  avatar.alt = CONFIG.name;

  // Icônes sociales
  const socials = document.getElementById("socials");
  CONFIG.socials.forEach(s => {
    const a = makeLink(s.url, "social");
    a.title = s.label;
    a.setAttribute("aria-label", s.label);
    a.appendChild(makeIcon(s.icon, "social-img"));
    socials.appendChild(a);
  });

  // Liens
    // Liens
  const links = document.getElementById("links");
  CONFIG.links.forEach((l, i) => links.appendChild(makeLinkItem(l, i)));

  setupDiscord();
  setupMusic();  
}

function makeLinkItem(l, i) {
  const isImg = l.icon && /\.(png|svg|jpe?g|webp)$/i.test(l.icon);

  const el = l.url ? makeLink(l.url, "link") : document.createElement("div");
  if (!l.url) el.className = "link static";
  el.style.animation = `rise 0.6s ease ${0.15 + i * 0.1}s both`;

  let icon;
  if (isImg) {
    icon = document.createElement("img");
    icon.src = l.icon;
    icon.alt = "";
    icon.className = "icon-img";
  } else {
    icon = document.createElement("span");
    icon.className = "icon";
    icon.textContent = l.icon || "🔗";
  }

  const text = document.createElement("span");
  text.className = "link-text";
  const label = document.createElement("span");
  label.textContent = l.label;
  text.appendChild(label);

  if (l.text) {
    const sub = document.createElement("small");
    sub.textContent = l.text;
    text.appendChild(sub);
  }

  el.append(icon, text);
  return el;
}

function makeIcon(icon, cls) {
  if (icon && /\.(png|svg|jpe?g|webp|gif)$/i.test(icon)) {
    const img = document.createElement("img");
    img.src = icon;
    img.alt = "";
    img.className = cls;
    return img;
  }
  const span = document.createElement("span");
  span.className = "icon";
  span.textContent = icon || "🔗";
  return span;
}

function makeLink(url, className) {
  const a = document.createElement("a");
  a.href = url;
  a.className = className;
  if (CONFIG.openInNewTab) {
    a.target = "_blank";
    a.rel = "noopener noreferrer";
  }
  return a;
}

/* ----- Musique : playlist locale ou embed Spotify ----- */
function setupMusic() {
  const m = CONFIG.music;
  const playlistBox = document.getElementById("playlist-box");
  const spotifyBox = document.getElementById("spotify-box");
  const iframe = document.getElementById("spotify-frame");

  if (m.mode === "spotify") {
    playlistBox.classList.add("hidden");
    document.getElementById("music").remove();

    if (m.spotifyEmbed) {
      iframe.src = m.spotifyEmbed;
    } else {
      spotifyBox.classList.add("hidden");
      console.warn("Mode spotify : ajoute ton URL dans CONFIG.music.spotifyEmbed");
    }
    return;
  }

  spotifyBox.classList.add("hidden");
  setupPlaylist();
}

// Vérifie qu'un fichier audio se charge réellement
function checkTrack(file) {
  return new Promise(resolve => {
    const probe = new Audio();
    probe.preload = "metadata";

    const done = ok => {
      probe.removeAttribute("src");
      probe.load();
      resolve(ok);
    };

    probe.addEventListener("loadedmetadata", () => done(true), { once: true });
    probe.addEventListener("error", () => done(false), { once: true });
    setTimeout(() => done(false), 8000); // au-delà de 8 s, on considère le fichier comme inutilisable

    probe.src = file;
  });
}

// Vérifie qu'un fichier audio se charge réellement
function checkTrack(file) {
  return new Promise(resolve => {
    const probe = new Audio();
    probe.preload = "metadata";

    const done = ok => {
      probe.removeAttribute("src");
      probe.load();
      resolve(ok);
    };

    probe.addEventListener("loadedmetadata", () => done(true), { once: true });
    probe.addEventListener("error", () => done(false), { once: true });
    setTimeout(() => done(false), 8000); // au-delà de 8 s, on considère le fichier comme inutilisable

    probe.src = file;
  });
}

// Vérifie qu'un fichier audio se charge réellement
function checkTrack(file) {
  return new Promise(resolve => {
    const probe = new Audio();
    probe.preload = "metadata";

    const done = ok => {
      probe.removeAttribute("src");
      probe.load();
      resolve(ok);
    };

    probe.addEventListener("loadedmetadata", () => done(true), { once: true });
    probe.addEventListener("error", () => done(false), { once: true });
    setTimeout(() => done(false), 8000); // au-delà de 8 s, on considère le fichier comme inutilisable

    probe.src = file;
  });
}

async function setupPlaylist() {
  const allTracks = CONFIG.music.tracks;
  const audio = document.getElementById("music");
  const list = document.getElementById("tracks");
  const title = document.getElementById("now-title");
  const playBtn = document.getElementById("play");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");
  const icon = document.getElementById("pl-icon");

  icon.src = CONFIG.music.icon;
  audio.volume = CONFIG.music.volume ?? 0.4;

  if (!allTracks.length) {
    title.textContent = "Aucun morceau";
    return;
  }

  // 1. Vérifie chaque morceau avant de construire la liste
  title.textContent = "Chargement de la playlist…";
  const results = await Promise.all(allTracks.map(t => checkTrack(t.file)));

  allTracks.forEach((t, i) => {
    if (!results[i]) console.warn("Morceau ignoré (ne se lit pas) :", t.title, "→", t.file);
  });

  // 2. Ne garde que les morceaux lisibles
  const tracks = allTracks.filter((_, i) => results[i]);

  if (!tracks.length) {
    title.textContent = "Aucun morceau lisible";
    return;
  }

  let current = 0;

  // 3. Construit la liste avec les morceaux valides uniquement
  tracks.forEach((t, i) => {
    const li = document.createElement("li");
    li.className = "track";

    const num = document.createElement("span");
    num.className = "track-num";
    num.textContent = i + 1;

    const name = document.createElement("span");
    name.textContent = t.title;

    li.append(num, name);
    li.addEventListener("click", () => loadTrack(i, true));
    list.appendChild(li);
  });

  function highlight() {
    [...list.children].forEach((li, i) => li.classList.toggle("active", i === current));
  }

  function loadTrack(i, play) {
    current = (i + tracks.length) % tracks.length;
    audio.src = tracks[current].file;
    title.textContent = tracks[current].title;
    highlight();
    if (play) audio.play().catch(() => {});
  }

  function toggle() {
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  }

  playBtn.addEventListener("click", toggle);
  prevBtn.addEventListener("click", () => loadTrack(current - 1, true));
  nextBtn.addEventListener("click", () => loadTrack(current + 1, true));
  audio.addEventListener("ended", () => loadTrack(current + 1, true));

  audio.addEventListener("play", () => { playBtn.textContent = "⏸"; });
  audio.addEventListener("pause", () => { playBtn.textContent = "▶"; });

  loadTrack(0, false);

  // Lancement au chargement si le navigateur l'autorise,
  // sinon au premier geste de l'utilisateur sur la page
  if (CONFIG.music.autoplay) {
    // La lecture muette est autorisée par les navigateurs : la playlist démarre tout de suite
    audio.muted = true;
    audio.play().catch(() => {});

    // Au premier geste sur la page, on réactive le son
    const events = ["pointerdown", "keydown", "touchstart"];
    const unmute = () => {
      audio.muted = false;
      audio.play().catch(() => {});
      events.forEach(ev => document.removeEventListener(ev, unmute));
    };
    events.forEach(ev => document.addEventListener(ev, unmute));
  }
}

async function setupDiscord() {
  const d = CONFIG.discord;
  const card = document.getElementById("discord-card");
  if (!d || !d.id || !d.showCard) return;

  const el = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  };

  try {
    const res = await fetch(`https://api.lanyard.rest/v1/users/${d.id}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error?.message || "erreur");

    const { discord_user: user, discord_status: status, activities = [] } = json.data;

    const avatarUrl = user.avatar
      ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`
      : `https://cdn.discordapp.com/embed/avatars/${Number((BigInt(user.id) >> 22n) % 6n)}.png`;

    const colors = { online: "#22c55e", idle: "#eab308", dnd: "#ef4444", offline: "#6b7280" };
    const statusLabels = { online: "En ligne", idle: "Absent", dnd: "Ne pas déranger", offline: "Hors ligne" };

    // Activités : jeu en premier, puis musique Spotify, puis statut personnalisé
    const game = activities.find(a => a.type === 0);
    const music = activities.find(a => a.type === 2 && a.name === "Spotify");
    const custom = activities.find(a => a.type === 4);

    card.innerHTML = "";

    // En-tête : avatar, nom, statut
    const img = el("img", "dc-avatar");
    img.src = avatarUrl;
    img.alt = user.username;

    const dot = el("span", "dc-dot");
    dot.style.background = colors[status] || colors.offline;

    const avWrap = el("div", "dc-avwrap");
    avWrap.append(img, dot);

    const head = el("div", "dc-head");
    const headText = el("div", "dc-text");
    const subText = el("span", "dc-sub");
    if (custom?.emoji) {
      if (custom.emoji.id) {
        const em = el("img", "dc-status-emoji");
        em.src = `https://cdn.discordapp.com/emojis/${custom.emoji.id}.${custom.emoji.animated ? "gif" : "png"}`;
        em.alt = custom.emoji.name || "";
        subText.appendChild(em);
      } else if (custom.emoji.name) {
        subText.append(custom.emoji.name + " ");
      }
    }
    subText.append(custom?.state || d.fallbackStatus || statusLabels[status] || "");

    headText.append(
      el("strong", "", user.global_name || user.username),
      subText
    );
    head.append(avWrap, headText);
    card.appendChild(head);

    const list = el("div", "dc-list");

    // Jeu
    if (game) {
      const row = el("div", "dc-row");

      if (game.application_id && game.assets?.large_image && !/^(mp:|spotify:)/.test(game.assets.large_image)) {
        const art = el("img", "dc-art");
        art.src = `https://cdn.discordapp.com/app-assets/${game.application_id}/${game.assets.large_image}.png`;
        art.alt = game.name;
        art.onerror = () => art.remove();
        row.appendChild(art);
      } else {
        row.appendChild(el("span", "dc-emoji", "🎮"));
      }

      const info = el("div", "dc-info");
      info.append(el("span", "dc-label", "En jeu"), el("strong", "", game.name));
      const mode = [game.details, game.state].filter(Boolean).join(" · ");
      if (mode) info.appendChild(el("span", "dc-sub", mode));
      row.appendChild(info);
      list.appendChild(row);
    }

    // Musique Spotify
    if (music) {
      const row = el("div", "dc-row");

      const artId = music.assets?.large_image?.replace("spotify:", "");
      if (artId) {
        const art = el("img", "dc-art");
        art.src = `https://i.scdn.co/image/${artId}`;
        art.alt = music.details || "Pochette";
        art.onerror = () => art.remove();
        row.appendChild(art);
      } else {
        row.appendChild(el("span", "dc-emoji", "🎵"));
      }

      const info = el("div", "dc-info");
      info.append(el("span", "dc-label", "En écoute"), el("strong", "", music.details || "Spotify"));
      if (music.state) info.appendChild(el("span", "dc-sub", music.state));
      row.appendChild(info);
      list.appendChild(row);
    }

    if (list.children.length) card.appendChild(list);
    card.classList.remove("hidden");
  } catch (err) {
    console.warn("Discord : impossible de charger le profil", err);
  }
}

document.addEventListener("DOMContentLoaded", render);
