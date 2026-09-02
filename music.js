(()=>{
  const AUDIO_FILE='romansenykmusic-cinematic-ambient-corporate-inspiring-emotional-125960.mp3';
  const STATE_KEY='stphMusicEnabled';
  const TIME_KEY='stphMusicTime';
  const VOLUME=0.12;

  const style=document.createElement('style');
  style.textContent=`
    .stph-music-toggle{position:fixed;right:18px;bottom:18px;z-index:9999;border:1px solid #b89553;background:#0b1510e8;color:#f4efe4;padding:10px 13px;font:600 .62rem Arial,sans-serif;text-transform:uppercase;letter-spacing:.12em;box-shadow:0 5px 18px #0006;cursor:pointer;backdrop-filter:blur(4px)}
    .stph-music-toggle:hover{background:#17261d;color:#d4b66f}.stph-music-toggle.playing{color:#d4b66f}
    .author-socials{display:flex;align-items:center;justify-content:center;gap:10px;margin-top:11px;padding-top:9px;border-top:1px solid rgba(255,255,255,.08)}
    .author-socials a{width:25px;height:25px;border:1px solid currentColor;border-radius:50%;display:grid;place-items:center;color:var(--gold,var(--blue,#b89553));opacity:.58;font:700 12px Arial,sans-serif;line-height:1;transition:opacity .18s ease,transform .18s ease,background .18s ease;text-decoration:none}
    .author-socials a:hover,.author-socials a:focus-visible{opacity:1;transform:translateY(-1px);background:rgba(255,255,255,.05);outline:none}
    .author-socials .ig{font-size:15px;font-weight:500}.author-socials .tt{font-size:14px}.author-socials .li{font-size:10px;letter-spacing:-.02em}.author-socials .fb{font-size:16px;font-family:Arial,sans-serif}
    @media(max-width:520px){.stph-music-toggle{right:12px;bottom:12px;padding:9px 11px;font-size:.58rem}.author-socials{gap:8px;margin-top:7px;padding-top:6px}.author-socials a{width:21px;height:21px;font-size:10px}.author-socials .ig{font-size:12px}.author-socials .tt{font-size:12px}.author-socials .li{font-size:8px}.author-socials .fb{font-size:13px}}
  `;
  document.head.appendChild(style);

  const bio=document.querySelector('.authorbio');
  if(bio&&!bio.querySelector('.author-socials')){
    const socials=document.createElement('div');
    socials.className='author-socials';
    socials.setAttribute('aria-label','Dixon Davis social media');
    socials.innerHTML=`
      <a class="fb" href="https://www.facebook.com/profile.php?id=61591604279328" target="_blank" rel="noopener noreferrer" aria-label="Dixon Davis on Facebook" title="Facebook">f</a>
      <a class="tt" href="https://www.tiktok.com/@dixon.davis72" target="_blank" rel="noopener noreferrer" aria-label="Dixon Davis on TikTok" title="TikTok">♪</a>
      <a class="ig" href="https://www.instagram.com/author_dixon_davis" target="_blank" rel="noopener noreferrer" aria-label="Dixon Davis on Instagram" title="Instagram">◎</a>
      <a class="li" href="https://www.linkedin.com/in/dixon-davis-08418341a" target="_blank" rel="noopener noreferrer" aria-label="Dixon Davis on LinkedIn" title="LinkedIn">in</a>`;
    bio.appendChild(socials);
  }

  const audio=document.createElement('audio');
  audio.src=AUDIO_FILE;
  audio.loop=true;
  audio.preload='auto';
  audio.volume=VOLUME;
  audio.setAttribute('aria-hidden','true');
  document.body.appendChild(audio);

  const button=document.createElement('button');
  button.type='button';
  button.className='stph-music-toggle';
  button.setAttribute('aria-label','Toggle background music');
  document.body.appendChild(button);

  const stored=localStorage.getItem(STATE_KEY);
  let enabled=stored===null ? true : stored==='on';
  const savedTime=parseFloat(localStorage.getItem(TIME_KEY)||'0');

  const updateButton=()=>{
    const playing=!audio.paused;
    button.textContent=playing?'♪ Music On':'♪ Music Off';
    button.classList.toggle('playing',playing);
    button.setAttribute('aria-pressed',playing?'true':'false');
  };

  audio.addEventListener('loadedmetadata',()=>{
    if(Number.isFinite(savedTime)&&savedTime>0&&audio.duration){
      audio.currentTime=savedTime%audio.duration;
    }
  },{once:true});

  const saveTime=()=>{
    if(Number.isFinite(audio.currentTime)) localStorage.setItem(TIME_KEY,String(audio.currentTime));
  };
  setInterval(saveTime,1000);
  window.addEventListener('pagehide',saveTime);

  const start=()=>{
    if(!enabled) return;
    audio.play().then(updateButton).catch(()=>updateButton());
  };

  button.addEventListener('click',()=>{
    if(audio.paused){
      enabled=true;
      localStorage.setItem(STATE_KEY,'on');
      audio.play().then(updateButton).catch(updateButton);
    }else{
      enabled=false;
      localStorage.setItem(STATE_KEY,'off');
      audio.pause();
      updateButton();
    }
  });

  audio.addEventListener('play',updateButton);
  audio.addEventListener('pause',updateButton);
  updateButton();

  if(enabled){
    start();
    const unlock=()=>{start();document.removeEventListener('pointerdown',unlock,true);document.removeEventListener('keydown',unlock,true)};
    document.addEventListener('pointerdown',unlock,true);
    document.addEventListener('keydown',unlock,true);
  }
})();